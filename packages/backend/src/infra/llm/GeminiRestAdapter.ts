/**
 * ECONEURA - Gemini REST Adapter
 * Adaptador para Google Gemini 3 API (REST directo sin SDK)
 */
import { type LLMClient, type GenerationResult } from '../../llm/invokeLLMAgent';
import { ok, err, type Result } from '../../shared/Result';
import { logger } from '../../shared/logger';
import { getValidatedEnv } from '../../config/env';

interface GeminiPart {
    text?: string;
    inlineData?: {
        mimeType: string;
        data: string;
    };
}

interface GeminiContent {
    role: 'user' | 'model';
    parts: GeminiPart[];
}

interface GeminiSystemInstruction {
    parts: { text: string }[];
}

interface GeminiRequest {
    contents: GeminiContent[];
    systemInstruction?: GeminiSystemInstruction;
    generationConfig?: {
        temperature?: number;
        maxOutputTokens?: number;
        topP?: number;
        topK?: number;
    };
    safetySettings?: Array<{
        category: string;
        threshold: string;
    }>;
}

interface GeminiResponse {
    candidates?: Array<{
        content: {
            parts: Array<{ text: string }>;
            role: string;
        };
        finishReason?: string;
    }>;
    error?: {
        code: number;
        message: string;
        status: string;
    };
}

export class GeminiRestAdapter implements LLMClient {
    private apiKey: string | null = null;
    private readonly baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';

    private ensureApiKey(): string {
        if (this.apiKey) return this.apiKey;

        // Intentar leer de process.env directamente si getValidatedEnv falla o no tiene la key
        const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
        if (!key) {
            throw new Error('GEMINI_API_KEY no configurada en variables de entorno');
        }
        this.apiKey = key;
        return this.apiKey;
    }

    async generate(params: {
        model: string;
        systemPrompt: string;
        userInput: string;
        temperature: number;
        maxTokens: number;
        correlationId?: string;
        image?: string;
        file?: string;
        conversationHistory?: Array<{ role: string; content: string }>;
    }): Promise<Result<GenerationResult, Error>> {
        try {
            const apiKey = this.ensureApiKey();
            // Usar el modelo especificado o fallback a gemini-3-pro
            const modelName = params.model || 'gemini-3-pro';
            const endpoint = `${this.baseUrl}/${modelName}:generateContent?key=${apiKey}`;

            // 1. Construir historial (Sincronización Mistral -> Gemini)
            const contents: GeminiContent[] = [];

            // Mapear historial previo
            if (params.conversationHistory && params.conversationHistory.length > 0) {
                params.conversationHistory.forEach(msg => {
                    const role = msg.role === 'user' ? 'user' : 'model'; // assistant -> model
                    // Filtrar mensajes de sistema del historial si los hubiera (se manejan aparte)
                    if (msg.role !== 'system') {
                        contents.push({
                            role,
                            parts: [{ text: msg.content }]
                        });
                    }
                });
            }

            // 2. Construir mensaje actual (Multimodalidad)
            const currentParts: GeminiPart[] = [];

            // Agregar texto del usuario
            if (params.userInput) {
                currentParts.push({ text: params.userInput });
            }

            // Agregar imagen si existe
            if (params.image) {
                currentParts.push({
                    inlineData: {
                        mimeType: 'image/jpeg', // Asumimos jpeg por defecto si no viene metadata, o detectar
                        data: params.image
                    }
                });
            }

            // Agregar archivo si existe
            if (params.file) {
                // Intentar detectar tipo MIME básico o usar application/pdf por defecto para documentos
                // En una implementación real, params.file debería venir con metadata de tipo
                currentParts.push({
                    inlineData: {
                        mimeType: 'application/pdf',
                        data: params.file
                    }
                });
            }

            contents.push({
                role: 'user',
                parts: currentParts
            });

            // 3. Construir Request
            const requestBody: GeminiRequest = {
                contents,
                systemInstruction: {
                    parts: [{ text: params.systemPrompt }]
                },
                generationConfig: {
                    temperature: params.temperature || 0.7,
                    maxOutputTokens: params.maxTokens || 2048,
                    topP: 0.95,
                    topK: 40
                },
                safetySettings: [
                    {
                        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_HATE_SPEECH",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_HARASSMENT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    }
                ]
            };

            // 4. Llamada REST
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorText = await response.text();
                let errorMsg = `Gemini API Error: ${response.status} ${response.statusText}`;
                try {
                    const errorJson = JSON.parse(errorText);
                    if (errorJson.error && errorJson.error.message) {
                        errorMsg += ` - ${errorJson.error.message}`;
                    }
                } catch {
                    errorMsg += ` - ${errorText}`;
                }

                logger.error('[GeminiRestAdapter] Error API', {
                    status: response.status,
                    error: errorMsg,
                    correlationId: params.correlationId
                });
                return err(new Error(errorMsg));
            }

            const data = await response.json() as GeminiResponse;

            // 5. Procesar respuesta
            if (data.candidates && data.candidates.length > 0) {
                const candidate = data.candidates[0];
                const outputText = candidate.content?.parts?.map(p => p.text).join('') || '';

                if (!outputText && candidate.finishReason) {
                    logger.warn('[GeminiRestAdapter] Respuesta vacía con finishReason', {
                        reason: candidate.finishReason,
                        correlationId: params.correlationId
                    });
                }

                return ok({
                    agentId: '',
                    outputText,
                    raw: data
                });
            } else {
                return err(new Error('Gemini no devolvió candidatos válidos'));
            }

        } catch (e: unknown) {
            const error = e instanceof Error ? e : new Error(String(e));
            logger.error('[GeminiRestAdapter] Excepción', {
                error: error.message,
                correlationId: params.correlationId
            });
            return err(error);
        }
    }
}

// Singleton lazy
let _geminiAdapter: GeminiRestAdapter | null = null;

export function getGeminiAdapter(): GeminiRestAdapter {
    if (!_geminiAdapter) {
        _geminiAdapter = new GeminiRestAdapter();
    }
    return _geminiAdapter;
}


import { getGeminiAdapter } from '../src/infra/llm/GeminiRestAdapter.ts';
import { logger } from '../src/shared/logger';

// Mock process.env for testing if not set
if (!process.env.GEMINI_API_KEY) {
    process.env.GEMINI_API_KEY = 'AIzaSyD7tuY948nL76Vtvz7Y1678cSLHN1j2aJI';
}

async function testGemini() {
    console.log('🚀 Iniciando prueba de Gemini 3 REST Adapter...');

    const adapter = getGeminiAdapter();

    try {
        console.log('📡 Enviando mensaje a Gemini 3...');
        const result = await adapter.generate({
            model: 'gemini-3-pro',
            systemPrompt: 'Eres un asistente de prueba.',
            userInput: 'Hola, ¿qué versión de Gemini eres? Responde brevemente.',
            temperature: 0.7,
            maxTokens: 100,
            conversationHistory: []
        });

        if (result.success) {
            console.log('✅ ÉXITO!');
            console.log('📝 Respuesta:', result.data.outputText);
            console.log('🔍 Raw:', JSON.stringify(result.data.raw, null, 2));
        } else {
            console.error('❌ ERROR:', result.error);
        }

    } catch (error) {
        console.error('💥 EXCEPCIÓN:', error);
    }
}

testGemini();

import { useState, useRef, useEffect, useCallback } from 'react';

// Polyfill definitions
interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
    resultIndex: number;
}

interface SpeechRecognitionResultList {
    length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
    isFinal: boolean;
    length: number;
    item(index: number): SpeechRecognitionAlternative;
    [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
    transcript: string;
    confidence: number;
}

interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    abort(): void;
    onresult: (event: SpeechRecognitionEvent) => void;
    onerror: (event: Event) => void;
    onend: () => void;
}

declare global {
    interface Window {
        SpeechRecognition: {
            new(): SpeechRecognition;
        };
        webkitSpeechRecognition: {
            new(): SpeechRecognition;
        };
    }
}

export function useSpeechRecognition(onResult: (text: string) => void) {
    const [listening, setListening] = useState(false);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const [voiceSupported] = useState<boolean>(typeof window !== 'undefined' && 'speechSynthesis' in window);

    useEffect(() => {
        try {
            const g = globalThis as typeof globalThis & {
                SpeechRecognition?: any;
                webkitSpeechRecognition?: any;
            };
            const SR = g.SpeechRecognition || g.webkitSpeechRecognition;
            if (SR) {
                const rec = new SR();
                rec.lang = 'es-ES';
                rec.interimResults = true;
                rec.onresult = (e: SpeechRecognitionEvent) => {
                    let t = '';
                    for (let i = e.resultIndex; i < e.results.length; i++) { t += e.results[i][0].transcript; }
                    onResult(t);
                };
                rec.onend = () => setListening(false);
                recognitionRef.current = rec;
            }
        } catch { }
    }, [onResult]);

    const speak = useCallback((text: string) => {
        try {
            if (!('speechSynthesis' in window)) return;
            const u = new SpeechSynthesisUtterance(text);
            u.lang = 'es-ES';
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(u);
        } catch { }
    }, []);

    const stopSpeak = useCallback(() => {
        try { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); } catch { }
    }, []);

    const toggleListen = useCallback(() => {
        const rec = recognitionRef.current;
        if (!rec) return;
        if (!listening) {
            // Note: consumer should clear input if needed
            setListening(true);
            try { rec.start(); } catch { }
        } else {
            try { rec.stop(); } catch { }
        }
    }, [listening]);

    return {
        listening,
        voiceSupported,
        speak,
        stopSpeak,
        toggleListen
    };
}

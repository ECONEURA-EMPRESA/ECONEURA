import { useState, useRef, useEffect } from 'react';

interface VoiceServiceProps {
  onTranscript: (text: string) => void;
  onSpeakingComplete?: () => void;
  language?: string;
  continuous?: boolean;
}

export function useVoiceService({
  onTranscript,
  onSpeakingComplete,
  language = 'es-ES',
  continuous = false
}: VoiceServiceProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    // Verificar soporte de APIs
    const speechRecognitionSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    const speechSynthesisSupported = 'speechSynthesis' in window;
    
    setIsSupported(speechRecognitionSupported && speechSynthesisSupported);

    if (speechRecognitionSupported) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = continuous;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = language;

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          onTranscript(finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        setError(`Error de reconocimiento: ${event.error}`);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthesisRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, [language, continuous, onTranscript]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        setError('No se pudo iniciar el reconocimiento de voz');
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const speak = (text: string, options?: {
    rate?: number;
    pitch?: number;
    volume?: number;
    voice?: SpeechSynthesisVoice;
  }) => {
    if (!window.speechSynthesis) {
      setError('Síntesis de voz no soportada');
      return;
    }

    // Cancelar síntesis anterior
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    utterance.rate = options?.rate || 1;
    utterance.pitch = options?.pitch || 1;
    utterance.volume = options?.volume || 1;
    utterance.lang = language;

    if (options?.voice) {
      utterance.voice = options.voice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setError(null);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      if (onSpeakingComplete) {
        onSpeakingComplete();
      }
    };

    utterance.onerror = (event) => {
      setError(`Error de síntesis: ${event.error}`);
      setIsSpeaking(false);
    };

    synthesisRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const getAvailableVoices = (): SpeechSynthesisVoice[] => {
    return window.speechSynthesis.getVoices();
  };

  const getVoicesByLanguage = (lang: string): SpeechSynthesisVoice[] => {
    return getAvailableVoices().filter(voice => voice.lang.startsWith(lang));
  };

  return {
    isListening,
    isSpeaking,
    isSupported,
    error,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    getAvailableVoices,
    getVoicesByLanguage
  };
}

// Componente VoiceControls movido a archivo separado
// Este archivo solo contiene hooks, no componentes JSX

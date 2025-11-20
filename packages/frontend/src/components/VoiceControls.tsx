import React from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useVoiceService } from '../hooks/useVoiceService';

// Componente de control de voz
export function VoiceControls({ 
  onTranscript, 
  onSpeakingComplete,
  className = ""
}: {
  onTranscript: (text: string) => void;
  onSpeakingComplete?: () => void;
  className?: string;
}) {
  const {
    isListening,
    isSpeaking,
    isSupported,
    error,
    startListening,
    stopListening,
    speak,
    stopSpeaking
  } = useVoiceService({
    onTranscript,
    onSpeakingComplete,
    language: 'es-ES',
    continuous: true
  });

  if (!isSupported) {
    return (
      <div className={`text-red-500 text-sm ${className}`}>
        🎤 Reconocimiento de voz no soportado en este navegador
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {error && (
        <div className="text-red-500 text-xs">
          {error}
        </div>
      )}
      
      <button
        onClick={isListening ? stopListening : startListening}
        className={`p-2 rounded-lg transition-colors ${
          isListening 
            ? 'bg-red-500 text-white hover:bg-red-600' 
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
        title={isListening ? 'Detener escucha' : 'Iniciar escucha'}
      >
        {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
      </button>

      <button
        onClick={isSpeaking ? stopSpeaking : () => speak('Hola, soy tu asistente de voz')}
        className={`p-2 rounded-lg transition-colors ${
          isSpeaking 
            ? 'bg-orange-500 text-white hover:bg-orange-600' 
            : 'bg-green-500 text-white hover:bg-green-600'
        }`}
        title={isSpeaking ? 'Detener voz' : 'Probar voz'}
      >
        {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </button>

      <div className="text-xs text-gray-500">
        {isListening && '🎤 Escuchando...'}
        {isSpeaking && '🔊 Hablando...'}
      </div>
    </div>
  );
}

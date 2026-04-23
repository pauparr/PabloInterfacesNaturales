import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

function useNativeSpeechRecognition({ language = 'es-ES', continuous = true, onFinalTranscript } = {}) {
  const recognitionRef = useRef(null);
  const lastProcessedFinalIndexRef = useRef(0);
  const [transcript, setTranscript] = useState('');
  const [listening, setListening] = useState(false);
  const [error, setError] = useState('');

  const browserSupportsSpeechRecognition = useMemo(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
  }, []);

  const ensureRecognition = useCallback(() => {
    if (!browserSupportsSpeechRecognition) {
      return null;
    }

    if (!recognitionRef.current) {
      const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognitionCtor();

      recognition.interimResults = true;
      recognition.continuous = continuous;
      recognition.lang = language;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setListening(true);
      };

      recognition.onend = () => {
        setListening(false);
      };

      recognition.onerror = (event) => {
        setError(event.error || 'No se pudo usar el micrófono.');
        setListening(false);
      };

      recognition.onresult = (event) => {
        const finalParts = [];
        const interimParts = [];

        for (let index = event.resultIndex; index < event.results.length; index += 1) {
          const result = event.results[index];
          const spokenText = result[0].transcript.trim();

          if (result.isFinal) {
            finalParts.push(spokenText);
            if (index >= lastProcessedFinalIndexRef.current && onFinalTranscript) {
              onFinalTranscript(spokenText);
            }
          } else {
            interimParts.push(spokenText);
          }
        }

        lastProcessedFinalIndexRef.current = event.results.length;
        setTranscript([...finalParts, ...interimParts].join(' ').trim());
      };

      recognitionRef.current = recognition;
    }

    return recognitionRef.current;
  }, [browserSupportsSpeechRecognition, continuous, language, onFinalTranscript]);

  const startListening = useCallback(async (options = {}) => {
    const recognition = ensureRecognition();

    if (!recognition) {
      const message = 'Este navegador no soporta reconocimiento de voz.';
      setError(message);
      throw new Error(message);
    }

    if (!window.isSecureContext) {
      const message = 'El micrófono solo funciona en HTTPS o localhost.';
      setError(message);
      throw new Error(message);
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      const message = 'Este navegador no puede solicitar permiso de micrófono.';
      setError(message);
      throw new Error(message);
    }

    recognition.continuous = options.continuous ?? continuous;
    recognition.lang = options.language ?? language;

    lastProcessedFinalIndexRef.current = 0;
    setTranscript('');
    setError('');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      recognition.start();
    } catch (startError) {
      const message = startError instanceof Error ? startError.message : 'No se pudo activar el micrófono.';
      setError(message);
      throw startError instanceof Error ? startError : new Error(message);
    }
  }, [continuous, ensureRecognition, language]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  const abortListening = useCallback(() => {
    recognitionRef.current?.abort();
  }, []);

  const resetTranscript = useCallback(() => {
    lastProcessedFinalIndexRef.current = 0;
    setTranscript('');
  }, []);

  useEffect(() => () => {
    recognitionRef.current?.abort();
  }, []);

  return {
    transcript,
    listening,
    resetTranscript,
    startListening,
    stopListening,
    abortListening,
    browserSupportsSpeechRecognition,
    error,
  };
}

export default useNativeSpeechRecognition;
import React from 'react';
import { useState } from 'react';
import useNativeSpeechRecognition from './useNativeSpeechRecognition';

//Ejemplo en el que se transcribe lo que dice la persona
//cuando encendemos el micro
function EjVoz(){
      const [micError, setMicError] = useState('');
  
      const {
        transcript,
        listening,
        resetTranscript,
        startListening,
        stopListening,
        browserSupportsSpeechRecognition
      } = useNativeSpeechRecognition();

      const handleStartListening = async () => {
        setMicError('');

        try {
          await startListening({ continuous: true, language: 'es-ES' });
        } catch (error) {
          setMicError(error instanceof Error ? error.message : 'No se pudo activar el micrófono.');
        }
      };
    
      if (!browserSupportsSpeechRecognition) {
        return <span>Este navegador no soporta reconocimiento de voz. Usa Chrome o Edge en un dispositivo compatible.</span>;
      }
    
      return (
        <div>
          <p>Microphone: {listening ? 'on' : 'off'}</p>
          <button onClick={handleStartListening}>Start</button>
          {/*Si queremos que se escuche continuamente:
          <button onClick={() => SpeechRecognition.startListening({continuous: true})}>Start</button>*/}
          <button onClick={stopListening}>Stop</button>
          <button onClick={resetTranscript}>Reset</button>
          <p>{transcript}</p>
          {micError && <p>{micError}</p>}
        </div>
      );
    };
    

export default EjVoz;
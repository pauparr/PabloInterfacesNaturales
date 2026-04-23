import React, { useState } from 'react'
import useNativeSpeechRecognition from './useNativeSpeechRecognition'
import { runVoiceCommands } from './voiceHelpers'

const VozOrdenes = () => {

  const [message, setMessage] = useState('')
  const [micError, setMicError] = useState('')
  const commands = [
    {
      command: 'Me gustaría pedir *',
      callback: (food) => setMessage(`Tu pedido es de: ${food}`)
    },
    {
      command: 'El tiempo está :condition hoy',
      callback: (condition) => setMessage(`Hoy el tiempo está ${condition}`)
    },
    {
      command: 'Mis deportes favoritos son * y *',
      callback: (sport1, sport2) => setMessage(`#1: ${sport1}, #2: ${sport2}`)
    },
    {
      command: 'Pásame la sal (por favor)',
      callback: () => setMessage('Aquí tienes')
    },
    {
      command: ['Hola', 'Holitas'],
      callback: ({ command }) => setMessage(`Hola. Dijiste: "${command}"`),
      matchInterim: true
    },
    {
      command: 'Beijing',
      callback: (command, spokenPhrase, similarityRatio) => setMessage(`${command} and ${spokenPhrase} are ${similarityRatio * 100}% similar`),
      // If the spokenPhrase is "Benji", the message would be "Beijing and Benji are 40% similar"
      isFuzzyMatch: true,
      fuzzyMatchingThreshold: 0.2
    },
    {
      command: 'borrar',
      callback: ({ resetTranscript }) => resetTranscript()
    }
  ]

  const { transcript, browserSupportsSpeechRecognition, startListening, stopListening, resetTranscript } = useNativeSpeechRecognition({
    onFinalTranscript: (spokenText) => {
      runVoiceCommands(commands, spokenText, {
        resetTranscript,
      })
    },
  })

  const handleStartListening = async () => {
    setMicError('')

    try {
      await startListening({ continuous: true, language: 'es-ES' })
    } catch (error) {
      setMicError(error instanceof Error ? error.message : 'No se pudo activar el micrófono.')
    }
  }

  if (!browserSupportsSpeechRecognition) {
    return <p>Este navegador no soporta reconocimiento de voz. Usa Chrome o Edge en un dispositivo compatible.</p>
  }

   
  
  console.log(message)
  return (
    <div>
      <button onClick={handleStartListening}>Start</button>
      <button onClick={stopListening}>Stop</button>
      <p>{transcript}</p>
      <p>{message}</p>
      {micError && <p>{micError}</p>}
      
     
    </div>
  )
}
export default VozOrdenes
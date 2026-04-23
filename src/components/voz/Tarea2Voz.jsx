import { useState } from 'react';
import useNativeSpeechRecognition from './useNativeSpeechRecognition';
import { runVoiceCommands } from './voiceHelpers';

const GRID_SIZE = 7;
const COLORS = {
  azul: '#4f8cff',
  rojo: '#ff5c77',
  verde: '#30c48d',
  amarillo: '#f6c24b',
  morado: '#8b6cff',
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function Tarea2Voz() {
  const [position, setPosition] = useState({ x: 3, y: 3 });
  const [color, setColor] = useState(COLORS.azul);
  const [size, setSize] = useState(120);
  const [status, setStatus] = useState('Espera un comando de voz.');
  const [micError, setMicError] = useState('');

  const commands = [
    {
      command: ['arriba', 'sube'],
      callback: () => {
        setPosition((current) => ({ ...current, y: clamp(current.y - 1, 0, GRID_SIZE - 1) }));
        setStatus('Movido hacia arriba.');
      },
    },
    {
      command: ['abajo', 'baja'],
      callback: () => {
        setPosition((current) => ({ ...current, y: clamp(current.y + 1, 0, GRID_SIZE - 1) }));
        setStatus('Movido hacia abajo.');
      },
    },
    {
      command: ['izquierda', 'izq'],
      callback: () => {
        setPosition((current) => ({ ...current, x: clamp(current.x - 1, 0, GRID_SIZE - 1) }));
        setStatus('Movido a la izquierda.');
      },
    },
    {
      command: ['derecha', 'der'],
      callback: () => {
        setPosition((current) => ({ ...current, x: clamp(current.x + 1, 0, GRID_SIZE - 1) }));
        setStatus('Movido a la derecha.');
      },
    },
    {
      command: ['centrar', 'centro', 'volver al centro'],
      callback: () => {
        setPosition({ x: 3, y: 3 });
        setStatus('Marcador centrado.');
      },
    },
    {
      command: ['color azul', 'azul'],
      callback: () => {
        setColor(COLORS.azul);
        setStatus('Color azul activado.');
      },
    },
    {
      command: ['color rojo', 'rojo'],
      callback: () => {
        setColor(COLORS.rojo);
        setStatus('Color rojo activado.');
      },
    },
    {
      command: ['color verde', 'verde'],
      callback: () => {
        setColor(COLORS.verde);
        setStatus('Color verde activado.');
      },
    },
    {
      command: ['color amarillo', 'amarillo'],
      callback: () => {
        setColor(COLORS.amarillo);
        setStatus('Color amarillo activado.');
      },
    },
    {
      command: ['color morado', 'morado', 'violeta'],
      callback: () => {
        setColor(COLORS.morado);
        setStatus('Color morado activado.');
      },
    },
    {
      command: ['grande', 'más grande'],
      callback: () => {
        setSize((current) => clamp(current + 24, 80, 200));
        setStatus('Tamaño aumentado.');
      },
    },
    {
      command: ['pequeño', 'más pequeño'],
      callback: () => {
        setSize((current) => clamp(current - 24, 80, 200));
        setStatus('Tamaño reducido.');
      },
    },
    {
      command: ['reiniciar', 'resetear', 'limpiar'],
      callback: () => {
        setPosition({ x: 3, y: 3 });
        setColor(COLORS.azul);
        setSize(120);
        setStatus('Panel reiniciado.');
      },
    },
    {
      command: ['ayuda', 'mostrar ayuda'],
      callback: () => {
        setStatus('Comandos: arriba, abajo, izquierda, derecha, centrar, color rojo/verde/azul/amarillo/morado, grande, pequeño, reiniciar.');
      },
    },
  ];

  const {
    transcript,
    listening,
    resetTranscript,
    startListening,
    stopListening,
    browserSupportsSpeechRecognition,
  } = useNativeSpeechRecognition({
    onFinalTranscript: (spokenText) => {
      runVoiceCommands(commands, spokenText, { resetTranscript });
    },
  });

  const cellSize = `${100 / GRID_SIZE}%`;

  const handleStartListening = async () => {
    setMicError('');

    try {
      await startListening({ continuous: true, language: 'es-ES' });
      setStatus('Micrófono activado. Habla para mover el marcador.');
    } catch (error) {
      setMicError(error instanceof Error ? error.message : 'No se pudo activar el micrófono.');
      setStatus('No se pudo activar el micrófono.');
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return (
      <section className="voice-app voice-app--error">
        <h2>Tarea 2: panel de voz</h2>
        <p>Este navegador no soporta reconocimiento de voz. Usa Chrome o Edge en un dispositivo compatible.</p>
      </section>
    );
  }

  return (
    <section className="voice-app">
      <header className="voice-hero">
        <div>
          <p className="voice-kicker">Tarea 2</p>
          <h1>Panel de voz para mover a Pablo</h1>
          <p className="voice-intro">
            Habla con la app para mover el marcador, cambiar el color, variar el tamaño y reiniciar el panel.
          </p>
        </div>
        <div className="voice-actions">
          <button onClick={handleStartListening}>
            {listening ? 'Escuchando...' : 'Activar micrófono'}
          </button>
          <button onClick={stopListening}>Parar</button>
          <button onClick={resetTranscript}>Borrar texto</button>
        </div>
      </header>

      <div className="voice-layout">
        <main className="voice-board">
          <div className="voice-grid" aria-label="tablero de voz">
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
              const row = Math.floor(index / GRID_SIZE);
              const col = index % GRID_SIZE;
              const active = row === position.y && col === position.x;

              return (
                <div
                  key={index}
                  className={`voice-cell ${active ? 'is-active' : ''}`}
                  style={{ width: cellSize, height: cellSize }}
                >
                  {active && (
                    <div
                      className="voice-marker"
                      style={{
                        background: color,
                        width: size,
                        height: size,
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </main>

        <aside className="voice-panel">
          <div className="voice-card">
            <h2>Estado</h2>
            <p>{status}</p>
            <p>Micro: {listening ? 'activo' : 'apagado'}</p>
            {micError && <p>{micError}</p>}
          </div>

          <div className="voice-card">
            <h2>Lo que has dicho</h2>
            <p>{transcript || 'Todavía no hay transcripción.'}</p>
          </div>

          <div className="voice-card">
            <h2>Comandos</h2>
            <ul>
              <li>arriba, abajo, izquierda, derecha</li>
              <li>color rojo, color verde, color azul, color amarillo, color morado</li>
              <li>grande, pequeño, centrar, reiniciar, ayuda</li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default Tarea2Voz;
import Webcam from "react-webcam";
import { useEffect, useRef, useState } from "react";
import * as handTrack from 'handtrackjs';
import Texto from './Texto'


export default function EjGestos() {
  const [backgroundColor, setBackgroundColor] = useState('pink');

  
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);

  const defaultParams = {
    flipHorizontal: false,
    outputStride: 16,
    imageScaleFactor: 1,
    maxNumBoxes: 20,
    iouThreshold: 0.2,
    scoreThreshold: 0.6,
    modelType: "ssd320fpnlite",
    modelSize: "large",
    bboxLineWidth: "2",
    fontSize: 17,
  };

  const runHandtrack = async () => {
    const model = await handTrack.load(defaultParams);
    console.log("Model loaded");
    intervalRef.current = setInterval(() => {
      runDetection(model);
    }, 3000);
  };

  const runDetection = async (model) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const predictions = await model.detect(video);
      const currentLabel = predictions[0]?.label ?? null;

      if (currentLabel === 'point') {
        setBackgroundColor((currentColor) =>
          currentColor === 'pink' ? '#39ff14' : 'pink'
        );
      }

      if (currentLabel === "open") {
        console.log("scrolling down");
      
        window.scrollBy(0, window.innerHeight);
      } else if (currentLabel === "closed") {
        console.log("scrolling up");
      
        window.scrollBy(0, -window.innerHeight);
      } 
      else 
      {
        console.log("detecting...");
      
      }
    }
  };

  useEffect(() => {
    let isActive = true;

    const initializeHandtrack = async () => {
      const model = await handTrack.load(defaultParams);
      if (!isActive) {
        return;
      }

      console.log("Model loaded");
      intervalRef.current = setInterval(() => {
        runDetection(model);
      }, 3000);
    };

    initializeHandtrack();

    return () => {
      isActive = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <>
        <div style = {{
          alignItems: 'center',
          display: 'flex',
          backgroundColor,
          flexDirection: 'column',
          }}>
            <div>
                <h3>Gestos Mano: abierta y cerrada.</h3>
                <p>Tienes que activar la cam si tienes 14 o mas.</p>
            </div>
            <div >
                <Webcam
                    ref={webcamRef}
                    audio={false}
                    mirrored={false}
                    videoConstraints={{
                      facingMode: { ideal: 'environment' },
                    }}
                    style={{
                    width: 100,
                    height: 100,
                }}
            />
            <canvas
                ref={canvasRef}
                  style={{
                    width: 100,
                    height: 100,
                  }}
            />
        </div>
      </div>

      <Texto />
      


    </>
  );
}

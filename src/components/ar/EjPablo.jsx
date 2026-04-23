import { Canvas } from "@react-three/fiber";
import { ARButton, XR } from "@react-three/xr";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { useEffect, useState } from "react";


function Model() {
    const gltf = useLoader(GLTFLoader, '/Sussy%20Imposter.glb');

    return <primitive object={gltf.scene} scale={1.5} position={[0, -1, -2]} rotation={[0, Math.PI, 0]} />
}

function EjPablo() {
    const [arSupported, setArSupported] = useState(null);

    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const arUnavailableMessage = !window.isSecureContext
        ? "AR no está disponible porque esta página no está en HTTPS."
        : !navigator.xr
            ? isMobile
                ? "Este navegador móvil no soporta WebXR para AR. Usa Chrome en Android."
                : "En ordenador normalmente no hay soporte de cámara AR (immersive-ar). Prueba desde un móvil compatible."
            : isMobile
                ? "Tu móvil o navegador no soporta esta sesión AR concreta."
                : "Este equipo no soporta AR inmersiva. Prueba desde móvil Android con Chrome.";

    useEffect(() => {
        let active = true;

        async function checkSupport() {
            if (!window.isSecureContext || !navigator.xr) {
                if (active) {
                    setArSupported(false);
                }
                return;
            }

            try {
                const supported = await navigator.xr.isSessionSupported('immersive-ar');
                if (active) {
                    setArSupported(supported);
                }
            } catch {
                if (active) {
                    setArSupported(false);
                }
            }
        }

        checkSupport();

        return () => {
            active = false;
        };
    }, []);

    if (arSupported === null) {
        return <p>Comprobando compatibilidad de AR...</p>;
    }

    if (!arSupported) {
        return (
            <p>
                {arUnavailableMessage}
            </p>
        );
    }

    return (
        <>
            <ARButton />
            <Canvas>
                <XR>
                    <ambientLight intensity={1.2} />
                    <directionalLight position={[2, 4, 2]} intensity={1.5} />
                    <Model />
                </XR>
            </Canvas>
        </>
    )
}

export default EjPablo
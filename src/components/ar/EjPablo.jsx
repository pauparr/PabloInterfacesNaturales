import { Canvas } from "@react-three/fiber";
import { ARButton, XR } from "@react-three/xr";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";


function Model() {
    const gltf = useLoader(GLTFLoader, '/Sussy%20Imposter.glb');

    return <primitive object={gltf.scene} scale={1.5} position={[0, -1, -2]} rotation={[0, Math.PI, 0]} />
}

function EjPablo() {
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
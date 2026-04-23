import { OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";


function XrTorus() {
    const torusRef = useRef();
    
    useFrame((state, delta) => {
        torusRef.current.rotation.y += delta;
        torusRef.current.rotation.x += delta * 0.5;
    });

return (<>
    <OrbitControls />
    <ambientLight />
    <mesh ref={torusRef} position={[0, 0, -5]}>
        <torusGeometry args={[1.4, 0.5, 24, 48]} />
        <meshStandardMaterial color='deepskyblue' />
    </mesh>
    </>

)
}

export default XrTorus;
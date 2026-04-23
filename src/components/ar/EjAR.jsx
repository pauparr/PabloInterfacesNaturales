//Ejemplo de un cubo en RA
import { Canvas} from "@react-three/fiber";
import XrTorus from './XrTorus';
import { ARButton, XR } from "@react-three/xr";


function EjAR(){


    return(
        <>
            <ARButton/>
            <Canvas>
                <XR>
                    <XrTorus />
                   
                </XR>
            </Canvas>
        </>
)

}

export default EjAR;
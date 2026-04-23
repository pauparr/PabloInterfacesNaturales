import Dashboard from "./Dashboard"
import { Typography } from "@mui/material"

function Home() {
    return <>
        <Dashboard/>

                <Typography variant="h2" sx={{ mt: 4, mb: 2 }}>
                    Aplicaciones naturales de usuario de Pablo
                </Typography>
                <Typography variant="h6" sx={{ maxWidth: 800, mx: 'auto' }}>
                    Proyecto con reconocimiento de gestos, realidad aumentada y una interfaz de voz propia para la Tarea 2.
                </Typography>
    </>


}

export default Home
import { AppBar, Button, Container, Toolbar } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Link } from "react-router-dom";

function Dashboard() {
    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar >
                    <Grid container spacing={1} sx={{ width: '100%' }} >

                        <Grid size={{xs:12, md:2, lg:2}}>        
                            <Link to={'/'} style={{textDecoration:'none', color:'white'}}>Inicio</Link>
                        </Grid>

                        <Grid size={{xs:12, md:2, lg:2}}>        
                            <Link to={'/gestos'} style={{textDecoration:'none', color:'white'}}>Gestos</Link>
                        </Grid>
 
                        <Grid size={{xs:12, md:3, lg:3}}>        
                            <Link to={'/vozej1'} style={{textDecoration:'none', color:'white'}}>Voz: ejemplo básico</Link>
                        </Grid>

                        <Grid size={{xs:12, md:3, lg:3}}>        
                            <Link to={'/vozej2'} style={{textDecoration:'none', color:'white'}}>Voz: ejemplo comandos</Link>
                        </Grid>

                        <Grid size={{xs:12, md:3, lg:3}}>        
                            <Link to={'/voz-tarea2'} style={{textDecoration:'none', color:'white'}}>Voz: tarea 2</Link>
                        </Grid>

                        <Grid size={{xs:12, md:1, lg:1}}>        
                            <Link to={'/ar'} style={{textDecoration:'none', color:'white'}}>AR</Link>
                        </Grid>

                        <Grid size={{xs:12, md:2, lg:2}}>        
                            <Link to={'/pablo'} style={{textDecoration:'none', color:'white'}}>ARPablo</Link>
                        </Grid>

                        
                    </Grid>
                </Toolbar >
            </Container>
        </AppBar>
      
    );
  }
  
  export default Dashboard;
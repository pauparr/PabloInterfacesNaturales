import 'regenerator-runtime/runtime';
import React from 'react'
import './App.css';
import VozEj1 from './components/VozEj1'
import VozEj2 from './components/VozEj2'
import Tarea2Voz from './components/voz/Tarea2Voz'
import Gestos from './components/Gestos'
import AR from './components/AR'
import Pablo from './components/Pablo'
import Home from './components/Home'


//import Pruebas from './components/Pruebas'
//importamos la función createBrowserRouter y el componente RouterProvider
//de la librería react-router-dom
import {createBrowserRouter, RouterProvider} from 'react-router-dom'


const router = createBrowserRouter([
  {
    path: '/',
    children: [
    
      {
        index: true,
        element: <Home />
      },
      {
        path: '/vozej1',
        element: <VozEj1 />
      },
      {
        path: '/vozej2',
        element: <VozEj2 />
      },
      {
        path: '/voz-tarea2',
        element: <Tarea2Voz />
      },
      {
        path: '/gestos',
        element: <Gestos />
      }

      ,
      {
        path: '/ar',
        element: <AR />
      },
      {
        path: '/pablo',
        element: <Pablo />
      }

      
    ]
  }
])

function App() {
  return (
       
    <RouterProvider router={router} />
  );
}

export default App;

import { useState } from 'react'
import {BrowserRouter , Routes , Route} from "react-router-dom";
import Dashboard from "./pages/Dashoard";
import PublicForm from "./pages/PublicForm";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App(){
  return (
    <BrowserRouter>
    <Routes>
      <Route path = "/dashboard" element = {<Dashboard />} />
      <Route path = "/form/:formId" element = {<PublicForm />} />
    </Routes>
  </BrowserRouter>
  )
}

export default App ; 

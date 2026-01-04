import { useState } from 'react'
import {BrowserRouter , Routes , Route} from "react-router-dom";
import Dashboard from "./pages/Dashoard";
import PublicForm from "./pages/PublicForm";
import FormResponses from './pages/FormResponses';
import ResetPassword from "./pages/ResetPassword";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import './App.css'
import AnalyticsDashboard from './pages/AnalyticsDashboard';

function App(){
  const [user , setUser] = useState(null)
  return (
    <BrowserRouter>
    <Routes>
      <Route path = "/" element = {<Dashboard />} />
      {/* <Route path = "/dashboard/:formId" element = {<FormResponses />} /> */}
      <Route path = "/form/:formId" element = {<PublicForm />} />
      {/* <Route path="/login" element={<Login setUser={setUser} />} /> */}
      {/* <Route path="/" element={<Signup />} /> */}
      {/* <Route path="/forgot-password" element={<ForgotPassword />} /> */}
      {/* <Route path="/reset-password" element={<ResetPassword />} /> */}
      <Route path="/analytics/:formId" element={<AnalyticsDashboard />} />


    </Routes>
  </BrowserRouter>
  )
}

export default App ; 

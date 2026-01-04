import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const res = await api.post("/signup", { email, password });
      setMsg("Signup successful! Please log in.");
      navigate("/login");
    } catch (err) {
      setMsg(err.response?.data?.detail || "Signup failed");
    }
    
  };
  const navigateToLogin = async () => {
      navigate("/login")
    }

  return (
    <div>
      <h2>Sign Up</h2>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button onClick={navigateToLogin}> Already A User Login </button>
      <button onClick={handleSignup}>Sign Up</button>
      <p>{msg}</p>
    </div>
  );
}

import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import "../App.css"

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
    <div className="signup-container">
      <div className="signup-box">
        <h2>Sign Up</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button className="secondary" onClick={navigateToLogin}>
          Already a User? Login
        </button>
        <button onClick={handleSignup}>Sign Up</button>
        {msg && <p className="msg">{msg}</p>}
      </div>
    </div>
  );
}

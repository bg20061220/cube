
import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await api.post("/login", { email, password });
      setUser(res.data); // store user info in App state
      navigate("/dashboard"); // redirect to dashboard
    } catch (err) {
      setMsg(err.response?.data?.detail || "Login failed");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Log In</button>
      <p>{msg}</p>
      <p>
        Forgot password? <a href="/forgot-password">Click here</a>
      </p>
      <p>
        No account? <a href="/signup">Sign up</a>
      </p>
    </div>
  );
}

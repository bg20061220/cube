
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
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>

        <input
          placeholder="Email"
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>Log In</button>

        {msg && <p className="msg">{msg}</p>}

       <button className="link-button" onClick={() => navigate("/forgot-password")}>
  Forgot Password?
</button>

<button className="link-button" onClick={() => navigate("/signup")}>
  No Account? Sign Up
</button>
      </div>
    </div>
  );
}

import { useState } from "react";
import api from "../api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const handleRequestReset = async () => {
    try {
      await api.post("/forgot-password", { email });
      setMsg("If an account exists, a reset link has been sent!");
    } catch (err) {
      setMsg("Error sending reset link");
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <button onClick={handleRequestReset}>Send Reset Link</button>
      <p>{msg}</p>
    </div>
  );
}

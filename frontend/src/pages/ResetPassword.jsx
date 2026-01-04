import { useState } from "react";
import api from "../api";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token"); // from URL

  const handleReset = async () => {
    try {
      await api.post("/reset-password", { token, new_password: newPassword });
      setMsg("Password reset successful!");
      navigate("/login");
    } catch (err) {
      setMsg("Reset failed or token expired");
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <input type="password" placeholder="New Password" onChange={e => setNewPassword(e.target.value)} />
      <button onClick={handleReset}>Reset Password</button>
      <p>{msg}</p>
    </div>
  );
}

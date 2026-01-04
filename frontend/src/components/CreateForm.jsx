import { useState } from "react";
import api from "../api";
import "../App.css"

export default function CreateForm({ onCreate }) {
  const [title, setTitle] = useState("");
  const [contexts, setContexts] = useState("");
  const [link, setLink] = useState(null);
  const VERCEL_URL = "https://cubeee-20dictjbk-bhavya-goels-projects.vercel.app/";
  const handleCreate = async () => {
    const res = await api.post("/forms/", {
      title,
      context_options: contexts.split(",").map(c => c.trim())
    });

    onCreate(res.data.id);
    setLink(`${VERCEL_URL}/form/${res.data.id}`);

  };

  return (
    <div>
      <h2 className = "create-form-title">Create Feedback Form</h2>
    <div className="create-form-fields"> 

    
      <input
        placeholder="Form title"
        onChange={e => setTitle(e.target.value)}
      />

      <input
        placeholder="Contexts (comma separated)"
        onChange={e => setContexts(e.target.value)}
      />

      <button className = "crete-form-btn" onClick={handleCreate}>Create Form</button>

      {link && (
        <p>
          Share link:
          <br />
          <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>

        </p>
      )}
      </div>
    </div>
  );
}

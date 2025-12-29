import { useState } from "react";
import api from "../api";

export default function CreateForm({ onCreate }) {
  const [title, setTitle] = useState("");
  const [contexts, setContexts] = useState("");
  const [link, setLink] = useState(null);

  const handleCreate = async () => {
    const res = await api.post("/forms/", {
      title,
      context_options: contexts.split(",").map(c => c.trim())
    });

    onCreate(res.data.id);
    setLink(`/form/${res.data.id}`);
  };

  return (
    <div>
      <h2>Create Feedback Form</h2>

      <input
        placeholder="Form title"
        onChange={e => setTitle(e.target.value)}
      />

      <input
        placeholder="Contexts (comma separated)"
        onChange={e => setContexts(e.target.value)}
      />

      <button onClick={handleCreate}>Create Form</button>

      {link && (
        <p>
          Share link:
          <br />
          <a href={link}>
            {window.location.origin + link}
          </a>
        </p>
      )}
    </div>
  );
}

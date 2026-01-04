import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";

export default function PublicForm() {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [text, setText] = useState("");
  const [category, setCategory] = useState("Usability");
  const [context, setContext] = useState("");
  const [severity, setSeverity] = useState("Minor");

useEffect(() => {
  if (!formId) return;

  const idNum = Number(formId);
  if (isNaN(idNum)) {
    console.error("Invalid formId", formId);
    return;
  }

  api.get(`/forms/public/${idNum}`)
    .then(res => {
      setForm(res.data);
      setContext(res.data.context_options?.[0] || "");
    })
    .catch(err => console.error("Failed to fetch form:", err));
}, [formId]);

  const submit = async () => {
    await api.post("/responses/", {
      form_id: Number(formId),
      text,
      category,
      context,
      severity
    });
    alert("Feedback submitted!");
  };

  if (!form) return <p>Loading...</p>;

  return (
    <div>
      <h2>{form.title}</h2>

      <textarea
        placeholder="Your feedback"
        onChange={e => setText(e.target.value)}
      />

      <select onChange={e => setCategory(e.target.value)}>
        <option>Usability</option>
        <option>Clarity</option>
        <option>Emotion</option>
        <option>Feature request</option>
      </select>

      <select onChange={e => setContext(e.target.value)}>
        {form.context_options.map(c => (
          <option key={c}>{c}</option>
        ))}
      </select>

      <select onChange={e => setSeverity(e.target.value)}>
        <option>Minor</option>
        <option>Moderate</option>
        <option>Major</option>
      </select>

      <button onClick={submit}>Submit Feedback</button>
    </div>
  );
}

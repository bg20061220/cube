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
    api.get("/forms/").then(res => {
      const found = res.data.find(f => f.id == formId);
      setForm(found);
      setContext(found.context_options[0]);
    });
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

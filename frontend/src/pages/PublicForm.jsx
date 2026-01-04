import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";

export default function PublicForm() {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [text, setText] = useState("");
  const [category, setCategory] = useState("");
  const [context, setContext] = useState("");
  const [severity, setSeverity] = useState("");

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
      // setContext(res.data.context_options?.[0] || "");
    })
    .catch(err => console.error("Failed to fetch form:", err));
}, [formId]);

  const submit = async () => {
    await api.post("/responses/", {
      form_id: Number(formId),
      text,
      category : category || null,
      context : context || null,
      severity: severity || null 
    });
    alert("Feedback submitted!");
    window.close(); 
  };

  if (!form) return <p>Loading...</p>;

  return (
  <div className="feedback-container">
    <div className="feedback-box">
      <h2 className="feedback-title">{form.title}</h2>

      <div className="feedback-fields">
        <textarea
          placeholder="Your feedback"
          onChange={e => setText(e.target.value)}
        />

        <select value = {category} onChange={e => setCategory(e.target.value)}>
          <option value="" disabled>Category</option> 
          <option>Usability</option>
          <option>Clarity</option>
          <option>Emotion</option>
          <option>Feature Request</option>
          <option value = "None">None </option>

        </select>

        <select value = {context} onChange={e => setContext(e.target.value)}>
          <option value="" disabled>Context</option>  
          {form.context_options.map(c => (
            <option key={c}>{c}</option>
          ))}
          <option value="None">None </option>
        </select>

        <select value = {severity} onChange={e => setSeverity(e.target.value)}>
          <option value="" disabled>Severity</option> 
          <option>Minor</option>
          <option>Moderate</option>
          <option>Major</option>
          <option value = "None">None </option>

        </select>
      </div>

      <button className="feedback-submit-btn" onClick={submit}>
        Submit Feedback
      </button>
    </div>
  </div>
);

}

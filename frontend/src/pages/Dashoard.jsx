import { useState } from "react";
import CreateForm from "../components/CreateForm";
import ResponseList from "../components/ResponseList";
import api from "../api"
import { useNavigate } from "react-router-dom";
export default function Dashboard() {
  const [activeFormId, setActiveFormId] = useState(null);
  const [forms , setForms] = useState([]);
  const [showForms , setShowForms] = useState(false) ;
  const navigate = useNavigate()

  const fetchMyForms = async () =>{
    const res = await api.get("/my/forms/");
    setForms(res.data);
    setShowForms(true);
  }

  return (
    <div>
      <h1>Researcher Dashboard</h1>

      <CreateForm onCreate={setActiveFormId} />

      <button onClick={fetchMyForms}>
        View all created forms
      </button>

      {showForms && (
  <div>
    <h2>Your Forms</h2>

    {forms.length === 0 ? (
      <p>You haven’t created any forms yet.</p>
    ) : (
      <ul>
        {forms.map((form) => (
          <li key={form.id}>
            <strong>{form.title}</strong>
            <button onClick={() => setActiveFormId(form.id)}>
              View Responses
            </button>
            <button onClick={() => navigate(`/analytics/${form.id}`)}>
  View Analytics
</button>
          </li>
        ))}
      </ul>
    )}
  </div>
)}


      {activeFormId && (
        <>
          <h2>Responses for Form #{activeFormId}</h2>
          <ResponseList formId={activeFormId} />
        </>
      )}
    </div>
  );
}
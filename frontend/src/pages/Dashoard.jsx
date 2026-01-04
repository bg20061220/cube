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
  <div className="dashboard-container">
    {/* Title */}
    <h1 className="dashboard-title">Researcher Dashboard</h1>

    {/* Create Form Box */}
    <div className="create-form-box">
      <CreateForm onCreate={setActiveFormId} />
    </div>

    {/* View Forms Button */}
    <button className="view-forms-btn" onClick={fetchMyForms}>
      View all created forms
    </button>

    {/* Forms Table */}
    {showForms && (
      <div className="forms-section">
        <h2>Your Forms</h2>

        {forms.length === 0 ? (
          <p>You haven’t created any forms yet.</p>
        ) : (
          <table className="forms-table">
            <thead>
              <tr>
                <th>Form Title</th>
                <th>Responses</th>
                <th>Analytics</th>
                <th>Open Form</th>
              </tr>
            </thead>
            <tbody>
              {forms.map((form) => (
                <tr key={form.id}>
                  <td>{form.title}</td>
                  <td>
                    <button onClick={() => setActiveFormId(form.id)}>
                      View Responses
                    </button>
                  </td>
                  <td>
                    <button onClick={() => navigate(`/analytics/${form.id}`)}>
                      View Analytics
                    </button>
                  </td>
                  <td>
                    <button onClick={() => window.open(`/form/${form.id}`, "_blank")}>
                      Open Feedback Form
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    )}

    {/* Responses */}
    {activeFormId && (
      <div className="responses-section">
        <h2>Responses for Form #{activeFormId}</h2>
        <ResponseList formId={activeFormId} />
      </div>
    )}
  </div>
);

}
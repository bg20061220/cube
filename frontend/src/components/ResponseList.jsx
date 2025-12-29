import { useEffect, useState } from "react";
import api from "../api";

export default function ResponseList({ formId }) {
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    if (!formId) return;

    api.get(`/responses/?form_id=${formId}`)
      .then(res => setResponses(res.data))
      .catch(err => console.error(err));
  }, [formId]);

  return (
    <div>
      <h3>All Feedback</h3>

      {responses.length === 0 && <p>No feedback yet</p>}

      {responses.map(r => (
        <div
          key={r.id}
          style={{
            border: "1px solid #ddd",
            padding: "10px",
            marginBottom: "10px"
          }}
        >
          <p><strong>Feedback:</strong> {r.text}</p>
          <p><strong>Category:</strong> {r.category}</p>
          <p><strong>Context:</strong> {r.context}</p>
          <p><strong>Severity:</strong> {r.severity}</p>
        </div>
      ))}
    </div>
  );
}

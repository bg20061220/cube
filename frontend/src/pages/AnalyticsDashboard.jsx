// import {useEffect , useState} from "react" ; 
// import {useParams} from "react-router-dom";
// import api from "../api"

// export default function AnalyticsDashboard(){
//     const {formId} =  useParams();
//     const [analytics , setAnalytics] = useState(null);
//     const[expandedSeverity , setExpandedSeverity] = useState(null);

//      useEffect(() => {
//     if (!formId) return;

//     api.get(`/analytics/${formId}`)
//          .then(res => {
//       console.log("Analytics response:", res.data); // <-- print here
//       setAnalytics(res.data);
//     })
//       .catch(err => console.error("Failed to fetch analytics:", err));
//   }, [formId]);

//     return (
//   <div>
//     <h1>Analytics Dashboard for Form #{formId}</h1>

//     {!analytics ? (
//       <p>Loading analytics...</p>
//     ) : (
//       <div className="tiles-grid">
//         <div className="tile">
//           <h3>All Feedback</h3>
//           <p>{analytics.total_responses}</p>
//         </div>

//         <div className="tile">
//           <h3>By Category</h3>
//           {Object.entries(analytics.by_category).map(([cat, count]) => (
//             <p key={cat}>{cat}: {count}</p>
//           ))}
//         </div>

//         <div className="tile">
//   <h3>By Severity</h3>
//   {Object.entries(analytics.by_severity).map(([sev, count]) => (
//     <div key={sev}>
//       <button onClick={() => setExpandedSeverity(sev)}>
//         {sev}: {count}
//       </button>

//       {expandedSeverity === sev && (
//         <ul>
//           {analytics.feedbacks_by_severity[sev].map((f, i) => (
//             <li key={i}>
//               <strong>{f.category}</strong> ({f.context || "No context"}): {f.text}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   ))}
// </div>

//         <div className="tile">
//           <h3>By Context</h3>
//           {Object.entries(analytics.by_context).map(([ctx, count]) => (
//             <p key={ctx}>{ctx}: {count}</p>
//           ))}
//         </div>
//       </div>
//     )}
//   </div>
// );


// }


import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

export default function AnalyticsDashboard() {
  const { formId } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedType, setSelectedType] = useState("");

  useEffect(() => {
    if (!formId) return;

    api
      .get(`/analytics/${formId}`)
      .then((res) => {
        setAnalytics(res.data);
      })
      .catch((err) => console.error("Failed to fetch analytics:", err));
  }, [formId]);

  if (!analytics) return <p>Loading analytics...</p>;

  const handleTileClick = (type, key) => {
    setSelectedType(type);
    setSelectedGroup({ key, feedbacks: analytics[type][key] });
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Analytics Dashboard</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <div
          style={{ padding: "1rem", border: "1px solid #ccc", cursor: "pointer" }}
          onClick={() => setSelectedGroup({ key: "All Responses", feedbacks: Object.values(analytics.by_severity).flat() })}
        >
          <h2>Total Responses</h2>
          <p>{analytics.total_responses}</p>
        </div>

        {["by_severity", "by_category", "by_context"].map((type) => (
          <div
            key={type}
            style={{ padding: "1rem", border: "1px solid #ccc" }}
          >
            <h2>{type.replace("by_", "").replace("_", " ").toUpperCase()}</h2>
            {Object.keys(analytics[type]).map((key) => (
              <div
                key={key}
                style={{
                  padding: "0.5rem",
                  border: "1px solid #eee",
                  margin: "0.5rem 0",
                  cursor: "pointer",
                }}
                onClick={() => handleTileClick(type, key)}
              >
                {key} ({analytics[type][key].length})
              </div>
            ))}
          </div>
        ))}
      </div>

      {selectedGroup && (
        <div>
          <h3>
            {selectedType.replace("by_", "").replace("_", " ").toUpperCase()}:{" "}
            {selectedGroup.key}
          </h3>
          <ul>
            {selectedGroup.feedbacks.map((text, index) => (
              <li key={index}>{text}</li>
            ))}
          </ul>
          <button onClick={() => setSelectedGroup(null)}>Close</button>
        </div>
      )}
    </div>
  );
}



import { useEffect, useState , useRef } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import "../App.css"

export default function AnalyticsDashboard() {
  const { formId } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedType, setSelectedType] = useState("");
  const responsesRef = useRef(null);


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
      setTimeout(() => {
      responsesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  return (
    <div className="analytics-container" >
  <h1 className="analytics-title">Analytics Dashboard</h1>

  {/* Tiles container */}
  <div className="analytics-tiles">
    {/* Total Responses Tile */}
    <div
      className="analytics-tile"
      onClick={() =>
        setSelectedGroup({
          key: "All Responses",
          feedbacks: Object.values(analytics.by_severity).flat(),
        })
      }
    >
      <h2>Total Responses</h2>
      <p className="analytics-number">{analytics.total_responses}</p>
    </div>

    {/* Other Tiles */}
    {["by_severity", "by_category", "by_context"].map((type) => (
      <div key={type} className="analytics-tile">
        <h2>{type.replace("by_", "").replace("_", " ").toUpperCase()}</h2>
        <div className="analytics-subtiles">
          {Object.keys(analytics[type]).map((key) => (
            <div
              key={key}
              className="analytics-subtile"
              onClick={() => handleTileClick(type, key)}
            >
              <span>{key}</span>
              <span>({analytics[type][key].length})</span>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>

  {/* Responses Table Section */}
  {selectedGroup && (
    <div className="analytics-table-section" ref = {responsesRef}>
      <h3 className="analytics-table-title">{selectedGroup.key}</h3>
      <table className="analytics-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Feedback</th>
          </tr>
        </thead>
        <tbody>
          {selectedGroup.feedbacks.map((text, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{text}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        className="analytics-close-btn"
        onClick={() => setSelectedGroup(null)}
      >
        Close
      </button>
    </div>
  )}
</div>

  );
}


import {useEffect , useState} from "react" ; 
import {useParams} from "react-router-dom";
import api from "../api"

export default function AnalyticsDashboard(){
    const {formId} =  useParams();
    const [analytics , setAnalytics] = useState(null);

     useEffect(() => {
    if (!formId) return;

    api.get(`/forms/${formId}/analytics`)
         .then(res => {
      console.log("Analytics response:", res.data); // <-- print here
      setAnalytics(res.data);
    })
      .catch(err => console.error("Failed to fetch analytics:", err));
  }, [formId]);

    return (
  <div>
    <h1>Analytics Dashboard for Form #{formId}</h1>

    {!analytics ? (
      <p>Loading analytics...</p>
    ) : (
      <div className="tiles-grid">
        <div className="tile">
          <h3>All Feedback</h3>
          <p>{analytics.total_responses}</p>
        </div>

        <div className="tile">
          <h3>By Category</h3>
          {Object.entries(analytics.by_category).map(([cat, count]) => (
            <p key={cat}>{cat}: {count}</p>
          ))}
        </div>

        <div className="tile">
          <h3>By Severity</h3>
          {Object.entries(analytics.by_severity).map(([sev, count]) => (
            <p key={sev}>{sev}: {count}</p>
          ))}
        </div>

        <div className="tile">
          <h3>By Context</h3>
          {Object.entries(analytics.by_context).map(([ctx, count]) => (
            <p key={ctx}>{ctx}: {count}</p>
          ))}
        </div>
      </div>
    )}
  </div>
);


}


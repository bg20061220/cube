import { useState } from "react";
import CreateForm from "../components/CreateForm";
import ResponseList from "../components/ResponseList";

export default function Dashboard() {
  const [activeFormId, setActiveFormId] = useState(null);

  return (
    <div>
      <h1>Researcher Dashboard</h1>

      <CreateForm onCreate={setActiveFormId} />

      {activeFormId && (
        <>
          <h2>Responses for Form #{activeFormId}</h2>
          <ResponseList formId={activeFormId} />
        </>
      )}
    </div>
  );
}

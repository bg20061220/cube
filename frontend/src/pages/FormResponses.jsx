import {useParams} from "react-router-dom" ; 
import ResponseList from "../components/ResponseList";

export default function FormResponses() {
    const {formId} = useParams() ; 

return (
    <div>
        <h1>Responses for Form #{formId}</h1>
        <ResponseList formId={formId} />
    </div>
)
}
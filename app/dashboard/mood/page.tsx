import { useMoody } from "@/context/MoodyContext";
import MoodClient from "./MoodClient";

export default function MoodyPage() {

   

    return (
        <div className="bg-amber-50 min-h-screen p-6 ">
            <h1 className="mt-50">Moody Page</h1>
            <MoodClient />
           
        </div>
    );
}
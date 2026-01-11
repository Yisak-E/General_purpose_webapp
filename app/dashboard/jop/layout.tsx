import { JobProvider } from "@/context/JobContext";


export default function JopLayout({ children }: { children: React.ReactNode }) {
    return (
        
        <div>
           <JobProvider>
              {children}
            </JobProvider>
        </div>
    );
}
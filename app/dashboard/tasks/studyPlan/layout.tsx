import { StudyPlanContextProvider } from "@/context/StudyPlanContext";


export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <StudyPlanContextProvider>
            {children}
        </StudyPlanContextProvider>
    );
}
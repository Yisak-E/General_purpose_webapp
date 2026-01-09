import { MoodyProvider } from "@/context/MoodyContext";


export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <MoodyProvider>
            {children}
            </MoodyProvider>
        </div>
    );
}
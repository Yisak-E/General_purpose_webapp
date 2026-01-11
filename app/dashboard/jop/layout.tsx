import { JopProvider } from "@/context/JopContext";


export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        
        <div>
           <JopProvider>
              {children}
            </JopProvider>
        </div>
    );
}
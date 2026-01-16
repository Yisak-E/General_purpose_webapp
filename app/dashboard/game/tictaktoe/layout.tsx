import { TicContextProvider } from "@/context/TicContext";


export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <TicContextProvider>{children}</TicContextProvider>
        </div>
    );
}
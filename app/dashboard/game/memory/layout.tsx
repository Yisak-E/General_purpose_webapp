import { MemoryGameProvider } from "@/context/MemoryGameContext";


export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <MemoryGameProvider>{children}</MemoryGameProvider>
        </div>
    );
}
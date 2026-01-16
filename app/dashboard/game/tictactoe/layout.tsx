import { TicContextProvider } from "@/context/TicContext";


export default function TicTacToeLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <TicContextProvider>{children}</TicContextProvider>
        </div>
    );
}

//game/tictactoe
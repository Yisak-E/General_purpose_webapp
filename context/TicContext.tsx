'use client';

import {useContext , createContext, useState} from 'react';

type TicContextType = {
    gameOver: boolean;
    setGameOver: React.Dispatch<React.SetStateAction<boolean>>;
    
    winner: string | null;
    setWinner: React.Dispatch<React.SetStateAction<string | null>>;

     
};

export const TicContext = createContext<TicContextType | null>(null);

export const TicContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [gameOver , setGameOver] = useState(false);
    const [winner, setWinner] = useState<string | null>(null);

    return (
        <TicContext.Provider
            value={
               {
                 gameOver , setGameOver,
                 winner, setWinner
               }
            }>
            {children}
        </TicContext.Provider>
    );
}

export const useTicContext = () => {
    const context = useContext(TicContext);
    if (!context) {
        throw new Error("useTicContext must be used within a TicContextProvider");
    }
    return context;
};
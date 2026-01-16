'use client';
import React, { useState, useEffect } from 'react';

const scorePackage: number[] = [ 5, 10, 15, 20, 25, 30, 40, 50,60, 70];

type MemoryGameContextType = {
    score: number;
    setScore: React.Dispatch<React.SetStateAction<number>>;
    showAllCards: boolean;
    setShowAllCards: React.Dispatch<React.SetStateAction<boolean>>;
    flipCount: number;
    setFlipCount: React.Dispatch<React.SetStateAction<number>>;
    cards: { emoji: string; isFlipped: boolean; isMatched: boolean }[];
    setCards: React.Dispatch<React.SetStateAction<{ emoji: string; isFlipped: boolean; isMatched: boolean }[]>>;
    bestScore: number;
    setBestScore: React.Dispatch<React.SetStateAction<number>>;
    clickedEmojis: Set<{id: number, emoji: string}>;
    setClickedEmojis: React.Dispatch<React.SetStateAction<Set<{id: number, emoji: string}>>>;
    gameStarted: boolean;
    setGameStarted: React.Dispatch<React.SetStateAction<boolean>>;
    gameCompleted: boolean;
    setGameCompleted: React.Dispatch<React.SetStateAction<boolean>>;
    pairedEmojis: Set<string>;
    setPairedEmojis: React.Dispatch<React.SetStateAction<Set<string>>>;

    handleCardClick: (index: number) => void;
};

export const MemoryGameContext = React.createContext<MemoryGameContextType | undefined>(undefined);

export const MemoryGameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [score, setScore] = useState(0);
    const [showAllCards, setShowAllCards] = useState(false);
    const [flipCount, setFlipCount] = useState(0);
    const [cards, setCards] = useState<{ emoji: string; isFlipped: boolean; isMatched: boolean }[]>([]);
    const [bestScore, setBestScore] = useState(0);
    const [clickedEmojis, setClickedEmojis] = useState<Set<{id: number, emoji: string}>>(new Set());
    const [gameStarted, setGameStarted] = useState(false);
    const [canClick, setCanClick] = useState(true);
    const [gameCompleted, setGameCompleted] = useState(false);
    const [pairedEmojis, setPairedEmojis] = useState<Set<string>>(new Set());

    
         // function to handle card click
    const handleCardClick = (index: number) => {
        if (gameCompleted || cards[index].isFlipped || cards[index].isMatched || !canClick) return;
        const selectedEmoji = cards[index].emoji;


        // Flip the selected card
        if(flipCount %2 ===0){
            setCards(prevCards =>
                prevCards.map((card, i) =>
                    i === index ? { ...card, isFlipped: true } : card
                )
            );
            setFlipCount(prev => prev + 1);
            setClickedEmojis(prev => new Set(prev).add({id: index, emoji: selectedEmoji}) );
        }

        else{
            setCards(prevCards =>
                prevCards.map((card, i) =>
                    i === index ? { ...card, isFlipped: true } : card
                )
            );
           
            // Check for match with previously clicked card
            const prevClickedArray = Array.from(clickedEmojis);
            const prevClicked = prevClickedArray.length > 0 ? prevClickedArray[prevClickedArray.length - 1] : null;
             
            if (prevClicked && prevClicked.emoji === selectedEmoji) {
                // It's a match
                setCards(prevCards =>
                    prevCards.map((card, i) =>
                        i === index || i === prevClicked.id ? { ...card, isMatched: true } : card
                    )
                );
                setPairedEmojis(prev => new Set(prev).add(selectedEmoji));

                if(flipCount < scorePackage.length){
                    setScore(prevScore => prevScore + scorePackage[flipCount]); 
                }

                else{
                setScore(prevScore => prevScore + 2);
                }
            }
            else {
                // Not a match - flip back after a delay
                setCanClick(false);
                setTimeout(() => {
                    setCards(prevCards =>
                        prevCards.map((card, i) =>
                            i === index || (prevClicked && i === prevClicked.id) ? { ...card, isFlipped: false } : card
                        )
                    );

                    clickedEmojis.delete(prevClicked!);
                    setClickedEmojis(new Set(clickedEmojis));
                    setCanClick(true);
                }, 1000);
            }
            setFlipCount(prev => prev + 1);
            setScore(prevScore => prevScore - 1); // Deduct score for every second flip
        }

        

    };
    return (
        <MemoryGameContext.Provider
            value={{
                score,
                setScore,
                showAllCards,
                setShowAllCards,
                flipCount,
                setFlipCount,
                cards,
                setCards,
                bestScore,
                setBestScore,
                clickedEmojis,
                setClickedEmojis,
                gameStarted,
                setGameStarted,
                gameCompleted,
                setGameCompleted,
                pairedEmojis,
                setPairedEmojis,
                handleCardClick,

            }}
        >
            {children}
        </MemoryGameContext.Provider>
    );
}

export const useMemoryGameContext = () => {
    const context = React.useContext(MemoryGameContext);
    if (!context) {
        throw new Error('useMemoryGameContext must be used within a MemoryGameProvider');
    }
    return context;
};

'use client';
import React, { useState } from 'react';
import { db } from "@/api/firebaseConfigs";
import {
    collection,
    onSnapshot,
    orderBy,
    query,
    doc,
    setDoc,
    getDoc,
    QueryDocumentSnapshot,
    DocumentData,
} from "firebase/firestore";
import { FirebaseError } from 'firebase/app';
import { LeaderboardEntry } from '@/type/memoType';


const scorePackage: number[] = [ 10, 20,30, 40, 50,60, 70, 80, 75, 65, 60, 55, 50, 45, 40, 35, 30, 25, 20, 15, 10, 5 ];

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

   
    getLeaderboard: (difficulty?: string) => Promise<LeaderboardEntry[]>;
    updateLeaderboard: (entry: LeaderboardEntry) => Promise<void>;
    
    user : { name: string; score: number; difficulty?: string } | null;
    setUser: React.Dispatch<React.SetStateAction<{ name: string; score: number; difficulty?: string } | null>>;
    

    
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
    const [user, setUser] = useState<{ name: string; score: number; difficulty?: string } | null>(null);



   
    const getLeaderboard = async (difficulty?: string): Promise<LeaderboardEntry[]> => {
        try{
        const q = query(
            collection(db, "memoScore"),
            orderBy("score", "desc")
        )
        const snap = await new Promise((resolve, reject) => {
            onSnapshot(q, (snapshot) => {
                resolve(snapshot);
            }, (error) => {
                reject(error);
            });
        });

        const entries: LeaderboardEntry[] = (snap as { docs: QueryDocumentSnapshot<DocumentData>[] }).docs.map((d) => {
            const data = d.data();
            return {
                name: data.name,
                score: data.score,
                timestamp: data.timestamp,
                difficulty: data.difficulty || undefined,
            } satisfies LeaderboardEntry;
        });

        if (difficulty) {
            return entries.filter(entry => entry.difficulty === difficulty);
        } else {
            return entries;
        }
        }catch (error) {
        console.error(error);
        throw new FirebaseError('failed-precondition', 'Failed to fetch leaderboard');
        }
    }
   const updateLeaderboard = async (entry: LeaderboardEntry): Promise<void> => {
    try {
        const id = entry.name;
        const docRef = doc(db, "memoScore", id);

            const snap = await getDoc(docRef);

            // If user exists and old score is higher → do nothing
            if (snap.exists() && snap.data().score >= entry.score) {
                return;
            }

            await setDoc(
                docRef,
                {
                    name: entry.name,
                    score: entry.score,
                    timestamp: entry.timestamp,
                    difficulty: entry.difficulty ?? null,
                },
                    { merge: true }
            );

        
        } catch (error) {
            console.error(error);
            throw new Error("Failed to update leaderboard");
            }
        };
    

    
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
                // state and setters
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

                // firebase functions
                getLeaderboard,
                updateLeaderboard,
                user,
                setUser,

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






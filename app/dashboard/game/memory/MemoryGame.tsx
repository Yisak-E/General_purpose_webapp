'use client';

import { useEffect, useState } from "react";

interface MemoryGameProps {
    emojiSet: string[];
}

export default function MemoryGame({ emojiSet }: MemoryGameProps) {
    const [score, setScore] = useState(0);
    const [showAllCards, setShowAllCards] = useState(false);
    const [flipCount, setFlipCount] = useState(0);
    const [cards, setCards] = useState<{ emoji: string; isFlipped: boolean; isMatched: boolean }[]>([]);
    const [bestScore, setBestScore] = useState(0);
    const [clickedEmojis, setClickedEmojis] = useState<Set<string>>(new Set());

    const [gameStarted, setGameStarted] = useState(false);
    const [gameCompleted, setGameCompleted] = useState(false);
    const [pairedEmojis, setPairedEmojis] = useState<Set<string>>(new Set());
    const [shuffledEmojis, setShuffledEmojis] = useState<string[]>([]);

    useEffect(() => {
        gameStarter();
    }, [emojiSet]);

    useEffect(() => {
        if (score > bestScore) {
            setBestScore(score);
        }
    }, [score, bestScore]);

   

    useEffect(() => {
        if (gameStarted && !gameCompleted) {
            setShowAllCards(true);
            const timer = setTimeout(() => {
                setShowAllCards(false);
                cards.forEach((card, index) => {
                    card.isFlipped = false;
                });
                setCards([...cards]);
            }, 5000); // Show all cards for 5 seconds

            return () => clearTimeout(timer);
        }



        
    }, [gameStarted, gameCompleted]);


    const gameStarter = () => {
        setScore(0);
        setClickedEmojis(new Set());
        setPairedEmojis(new Set());
        const doubledEmojis = [...emojiSet, ...emojiSet];
        setShuffledEmojis(shuffleArray(doubledEmojis));
        setCards(
            shuffleArray(doubledEmojis).map((emoji) => ({
                emoji,
                isFlipped: true,
                isMatched: false,
            }))
        );
        setGameStarted(true);
        setGameCompleted(false);
    }



    return (
        <div>
       <h1>Memory Game</h1>
       <article className="grid gap-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 ">
        <section className={"border p-4 m-2 rounded-lg shadow-lg lg:col-span-1 md:col-span-2 sm:col-span-1"}>
        {/* how to play description  */}
        <h2 className="text-xl font-bold mb-2">How to Play</h2>
        <p className="mb-4">
            Click on a card to reveal the emoji. Try to find matching pairs!
        </p>
        <p className="mb-4">
            If you click on a card you've already revealed, the game is over.
        </p>
        <p className="mb-4">
            Match all pairs to win the game!
        </p>
        </section>

       <section className={"border p-4 m-2 rounded-lg shadow-lg lg:col-span-1 md:col-span-2 sm:col-span-1 flex justify-center items-center"}>
        <GameBoard emojiSet={cards} showAllCards={showAllCards} />
       </section>


        <section className={"border p-4 m-2 rounded-lg shadow-lg lg:col-span-1 md:grid-cols-2 sm:col-span-1"}>
            {/* Scoreboard */}
            <h2 className="text-xl font-bold mb-2">Scoreboard</h2>
            <p className="mb-2">Current Score: {score}</p>
            <p className="mb-2">Best Score: {bestScore}</p>
            <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={gameStarter}
            >
                Restart Game
            </button>
        </section>
       </article>
    </div>
    );
}


interface GameBoardProps {
    emojiSet: { emoji: string; isFlipped: boolean; isMatched: boolean }[];
    showAllCards: boolean;
}
function GameBoard({ emojiSet, showAllCards }: GameBoardProps) {
    return (
        <div className="flex flex-wrap max-w-md">
           {
            emojiSet.map((emoji, index) => (
                <Card key={index} index={index} card={emoji} showAllCards={showAllCards} />
            ))
            
           }
        </div>
    );
}

interface CardProps {
    index?: number;
    card: { emoji: string; isFlipped: boolean; isMatched: boolean };
    showAllCards: boolean;
}
function Card({ card, showAllCards }: CardProps) {
    return (
        <div 
        onClick={() => {
            if (!card.isFlipped && !card.isMatched) {
                card.isFlipped = true;
            }
        }}
        className={`border p-4 m-2 inline-block text-4xl cursor-pointer rounded-lg shadow-lg hover:scale-105 transition-transform ${card.isFlipped || card.isMatched ? 'bg-white' : 'bg-gray-300'}`}>
            {card.isFlipped || card.isMatched ? card.emoji : '❓'}
        </div>
    );
}

function shuffleArray(doubledEmojis: string[]): string[] {
    return doubledEmojis.sort(() => Math.random() - 0.5);
}

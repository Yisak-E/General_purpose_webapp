'use client';

import { useMemoryGameContext } from "@/context/MemoryGameContext";
import { motion } from "motion/react";
import { useEffect } from "react";


interface MemoryGameProps {
    emojiSet: string[];
}

export default function MemoryGame({ emojiSet }: MemoryGameProps) {
   
    const {
        gameStarted, setGameStarted,
        gameCompleted, setGameCompleted,
        score, setScore,
        showAllCards, setShowAllCards,
        cards, setCards,
        bestScore, setBestScore,
        clickedEmojis, setClickedEmojis,
        pairedEmojis, setPairedEmojis,
        flipCount, setFlipCount,

    } = useMemoryGameContext();

    // Initialize cards on component mount
    const initializeCards = () => {
        const doubledEmojis = [...emojiSet, ...emojiSet];
        const shuffledEmojis = shuffleArray(doubledEmojis);
        const initialCards = shuffledEmojis.map(emoji => ({ emoji, isFlipped: true, isMatched: false }));
        setCards(initialCards);
    }
  

    // Function to start/restart the game
    const startGame = () => {
        initializeCards();
        setScore(0);
        setClickedEmojis(new Set());
        setPairedEmojis(new Set());
        setGameStarted(true);
        setGameCompleted(false);
        setShowAllCards(true);
        setFlipCount(0);
        // Hide cards after a brief delay
        setTimeout(() => {
            setCards(prevCards => prevCards.map(card => ({ ...card, isFlipped: false })));
            setShowAllCards(false);
        }, 2000);
    };


    // Effect to check for game completion
    useEffect(() => {
        if (gameStarted && cards.every(card => card.isMatched)) {
            setGameCompleted(true);
            setGameStarted(false);
            if (bestScore === 0 || score < bestScore) {
                setBestScore(score);
            }
        }
    }, [cards, gameStarted, score, bestScore, setBestScore, setGameCompleted, setGameStarted]);
   




    return (
        <div>
       <h1>Memory Game</h1>
       <article className={`grid gap-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 min-h-[400px]`}>

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
        <p>{flipCount}</p>
        </section>

       <section className={`border p-4 m-2 rounded-lg shadow-lg lg:col-span-1 md:col-span-2 sm:col-span-1 flex justify-center items-center  `}>
        {
            gameCompleted || !gameStarted ? (
                <div>
                  <div>
                    {gameCompleted ? (
                        <div className="text-center mb-4">
                            <h2 className="text-2xl font-bold mb-2">Congratulations! 🎉</h2>
                            <p className="mb-2">You've completed the game!</p>
                            <p className="mb-2">Your Score: {score}</p>
                            <p className="mb-2">Best Score: {bestScore}</p>
                        </div>
                    ) : (
                        <motion.div className="text-center mb-4 border p-4 rounded-lg shadow-lg bg-green-300"
                            initial={{scale: 1,  backgroundColor: "rgb(56, 200, 12)",}}
                            animate={{ scale: 1.5,  backgroundColor: "rgb(203, 200, 12)" }}
                            transition={{ duration: 5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 0 }}
                            whileHover={{ scale: 1.1, rotateY: 360, transition: { duration: 3 }  }}
                            exit={{ scale: 1,rotateY: 0, backgroundColor: "rgb(200, 20, 12)" }}
                            
                        
                        >
                            <h2 className="text-2xl font-bold mb-2">Memory Game</h2>
                            <p className="mb-2">Click "Play" to start the game!</p>
                        </motion.div>
                    )}

                  </div>
                    <motion.button
                        className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 hover:cursor-pointer border shadow-lg"
                        onClick={startGame}
                        initial={{ scale: 1 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        Play 
                    </motion.button>
                </div>
            ) : (
                <GameBoard emojiSet={cards} />
            )
        }
       
       </section>


        <section className={"border p-4 m-2 rounded-lg shadow-lg lg:col-span-1 md:grid-cols-2 sm:col-span-1"}>
            {/* Scoreboard */}
            <h2 className="text-xl font-bold mb-2">Scoreboard</h2>
            <p className="mb-2">Current Score: {score}</p>
            <p className="mb-2">Best Score: {bestScore}</p>
            <motion.button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 hover:cursor-pointer border shadow-lg"
                onClick={startGame}
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.1, rotate: 360, transition: { duration: 3 }  }}
                whileTap={{ scale: 0.9 , }}

            >
                Start Game
            </motion.button>

            {
                clickedEmojis.size >0 && (
                    <div className="mt-4">
                        <h3 className="text-lg font-bold mb-2">Clicked Emojis:</h3>
                        <div className="flex flex-wrap">
                            {[...clickedEmojis].map((item) => (
                                <span key={item.id} className="text-3xl m-1">{item.emoji}</span>
                            ))}
                        </div>
                    </div>
                )
            }



        </section>
       </article>
    </div>
    );
}


interface GameBoardProps {
    emojiSet: { emoji: string; isFlipped: boolean; isMatched: boolean }[];
}
function GameBoard({ emojiSet }: GameBoardProps) {
    return (
        <div className="flex flex-wrap max-w-md">
           {
            emojiSet.map((emoji, index) => (
                <Card key={index} index={index} card={emoji} />
            ))
            
           }
        </div>
    );
}

interface CardProps {
    index?: number;
    card: { emoji: string; isFlipped: boolean; isMatched: boolean };
   
}
function Card({ card, index }: CardProps) {
    const { handleCardClick } = useMemoryGameContext();
    return (
        <div 
        onClick={() => { handleCardClick(index!) }}
        className={`border p-4 m-2 inline-block text-4xl cursor-pointer rounded-lg shadow-lg hover:scale-105 transition-transform ${card.isFlipped || card.isMatched ? 'bg-white' : 'bg-gray-300'}`}>
            {card.isFlipped || card.isMatched ? card.emoji : '❓' }
        </div>
    );
}

function shuffleArray(doubledEmojis: string[]): string[] {
    return doubledEmojis.sort(() => Math.random() - 0.5);
}

'use client';

import { useMemoryGameContext } from "@/context/MemoryGameContext";
import { LeaderboardEntry } from "@/type/memoType";
import { motion } from "motion/react";
import { useEffect, useState } from "react";


interface MemoryGameProps {
    emojiSet: string[];
}

export default function MemoryGame({ emojiSet }: MemoryGameProps) {
    const [name, setName] = useState("Ruhama");
    const [gameScores, setGameScores] = useState<{ name: string; score: number }[]>([]);
   
    const {
        gameStarted, setGameStarted,
        gameCompleted, setGameCompleted,
        score, setScore,
        setShowAllCards,
        cards, setCards,
        bestScore, setBestScore,
        setClickedEmojis,
        setPairedEmojis,
        flipCount, setFlipCount,
        getLeaderboard,
        updateLeaderboard,
        user, setUser,

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

    useEffect(() => {
        gameScoresHandler();
        if(gameCompleted){
            setUser({ name, score });
            const camelName = name.trim().charAt(0).toUpperCase() + name.trim().slice(1).toLowerCase();
            const entry : LeaderboardEntry = { name: camelName, score, timestamp: Date.now() };
            updateLeaderboard(entry);   
           
           
        }
    }, [gameCompleted, name , score]);

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
   

    const gameScoresHandler = async () => {
        const gameScores = await getLeaderboard();
        setGameScores(gameScores);
    }

    const gameStartHandler = () => {
       if( name.trim().length < 3){
        alert("Name must be at least 3 characters long.");
        return;
       }
        startGame();
        setName(name.trim());
    };


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
                </div>
            ) : (
                <GameBoard emojiSet={cards} />
            )
        }
       
       </section>


        <section className={"border p-4 m-2 rounded-lg shadow-lg lg:col-span-1 md:grid-cols-2 sm:col-span-1"}>
          <div className="grid grid-cols-2">
            <div className="mb-4 rounded-l-lg shadow-lg p-4 bg-yellow-100">
             <h2>Leaderboard</h2>
               {
                /* Leaderboard component or display logic here */
                gameScores.slice(0,10).map((entry, index) => (
                    <div key={index} className="flex justify-between border-b py-2">
                        <span>{entry.name}</span>
                            <span>{entry.score}</span>
                    </div>
                ))
               }
            </div>
            <div className="mb-4 p-4 rounded-r-lg shadow-lg bg-blue-100">
                <form action="">
                    <label htmlFor="name" className="block mb-2 font-semibold">Enter Name:</label>
                    <input 
                        type="text"
                        id="name"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 border rounded mb-4"
                    />
                    <p>{name}</p>
                </form>
                <h2>Score: {score}</h2>
                <h2>Best Score: {bestScore}</h2>

                {/* button  */}
                <div className="mt-4">
                <motion.button
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 hover:cursor-pointer border shadow-lg"
                        onClick={gameStartHandler}
                        initial={{ scale: 1 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        {gameStarted ? 'Restart Game' : 'Start Game'}
                    </motion.button>

               </div>
            </div>
            

          </div>



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

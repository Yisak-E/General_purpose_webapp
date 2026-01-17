'use client';

import RainingLetters from "@/animations/amie/RainingLetters";
import { useTicContext } from "@/context/TicContext";
import { motion } from "framer-motion";





export default function TikClient() {
    const {gameOver, winner, resetGame, playerTurn} = useTicContext();
    return (
        <main>
            <article className="space-y-6 grid lg:grid-cols-3 lg:gap-x-8 lg:space-y-0">
                <section className="lg:col-span-1 space-y-6">
                    <div className="p-4 bg-white border border-gray-300 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold mb-4">Tic Tac Toe Instructions</h2>
                        <ul className="list-disc list-inside space-y-2 text-lg">
                            <li>Click on an empty cell to make your move.</li>
                            <li>The game will alternate turns between you and the AI.</li>
                            <li>The first player to get three in a row wins!</li>
                            <li>If all cells are filled without a winner, the game ends in a draw.</li>
                        </ul>
                    </div>

                    <div className="p-4 bg-black border border-gray-300 rounded-lg shadow-md h-100 flex items-center justify-center">
                        <RainingLetters text="✖️❤️⭕Ⓜ️♨️ YM"/>
                            
                    </div>
                </section>

                <section className="lg:col-span-1 space-y-6">
                    <GameComponent />
                </section>

                <section className="lg:col-span-1 space-y-6">
                    <div className="p-4 bg-white border border-gray-300 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold mb-4">Game Status</h2>
                        {gameOver ? (
                            winner ? (
                                <p className="text-xl">Winner: {winner}</p>
                            ) : (
                                <p className="text-xl">It's a Draw!</p>
                            )
                        ) : (
                            <p className="text-xl">Current Turn: {playerTurn}</p>
                        )}
                        <button
                            onClick={() => {
                                resetGame();
                            }}
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                        >
                            Reset Game
                        </button>

                    </div>
                </section>
            </article>
           
        </main>
    );
}

//  emojiSet={['❌', '🟢']}
 

const GameComponent = () => {
    const ticCards = Array(9).fill(null);
    const { board } = useTicContext();
    return (
        <div className="grid grid-cols-3 gap-2  w-full mx-auto border-2 border-gray-300 p-4 rounded-lg">
            {
                ticCards.map((_, index) => (
                    <TicCard key={index} index={index} value={ board[index]}  />
                ))
            }
        </div>
    );
}


interface TicCardProps {
    index: number;
    value: string;

}

const TicCard = ({ index, value }: TicCardProps) => {
    const {handleUserMove, winningCombination} = useTicContext();
    
    return (
        <motion.div onClick={() => handleUserMove(index)} 
            initial={{ scale: 1 }}
            whileTap={{ scale: 1.1, rotateY: 360, transition: { duration: 0.5 }  }}
            className={`flex items-center justify-center h-40 w-40  border-2 border-gray-400 rounded-lg shadow-md cursor-pointer text-7xl ${winningCombination.includes(index) ? "bg-green-500" : "bg-white"}`}>
            {value}
        </motion.div>
    );
}



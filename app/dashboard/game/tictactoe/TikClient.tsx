'use client';

import { useTicContext } from "@/context/TicContext";
import { motion } from "framer-motion";





export default function TikClient() {
    return (
        <main>
            <article className="space-y-6 grid lg:grid-cols-3 lg:gap-x-8 lg:space-y-0">
                <section className="lg:col-span-1 space-y-6">

                </section>

                <section className="lg:col-span-1 space-y-6">
                    <GameComponent />
                </section>

                <section className="lg:col-span-1 space-y-6">
                </section>
            </article>
           
        </main>
    );
}

//  emojiSet={['❌', '⭕']}
 

const GameComponent = () => {
    const ticCards = Array(9).fill(null);
    const { board, playerTurn } = useTicContext();
    return (
        <div className="grid grid-cols-3 gap-4 w-full mx-auto border-2 border-gray-300 p-4 rounded-lg">
            {
                ticCards.map((_, index) => (
                    <TicCard key={index} index={index} value={playerTurn + index}  />
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
    const {handleUserMove} = useTicContext();
    return (
        <motion.div onClick={() => handleUserMove(index)} 
            initial={{ scale: 1 }}
            whileTap={{ scale: 1.1, rotateY: 360, transition: { duration: 0.5 }  }}
            className="flex items-center justify-center h-40 w-40 bg-white border-2 border-gray-400 rounded-lg shadow-md cursor-pointer text-7xl">
            {value}
        </motion.div>
    );
}



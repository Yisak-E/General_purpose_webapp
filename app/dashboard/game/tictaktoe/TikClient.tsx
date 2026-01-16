'use client';

import { motion } from "framer-motion";


interface TicTacToeClientProps {
    emojiSet: string[];
}

export default function TikClient({ emojiSet }: TicTacToeClientProps) {
    return (
        <div>
            Tik Client Component
        </div>
    );
}

interface GameComponentProps {
    // Define any props needed for the GameComponent
}

 

const GameComponent = () => {
    const ticCards = Array(9).fill(null);
    return (
        <div>
            {
               
                ticCards.map((_, index) => (
                    <TicCard key={index} value={""} onClick={() => {}} />
                ))


            }
        </div>
    );
}


interface TicCardProps {
    value: string;
    onClick: () => void;
}

const TicCard = ({ value, onClick }: TicCardProps) => {
    return (
        <motion.div onClick={onClick} 
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.1, rotateY: 360, transition: { duration: 0.5 }  }}
            whileTap={{ scale: 0.9 }}

            className="tic-card">
            {value}
        </motion.div>
    );
}



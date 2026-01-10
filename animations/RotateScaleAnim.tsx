
import {motion } from "framer-motion";
interface RotateScaleAnimProps {
    text: string;
}

export default function RotateScaleAnim({ text }: RotateScaleAnimProps) {
    return (
        <motion.span

                        className="text-3xl mr-3 inline-block"
                        
                        initial ={{
                            y:[0, 0, 0],
                            x: [-250, 0, 0],
                            scale:1,
                            rotate: 0
                        }}
                        animate ={{
                            y:[0, 100, 0],
                            x: [250, 0, 0],
                            scale: 3,
                            rotate:360,
                            color: ["#FFD700", "#FF4500", "#FF69B4"]
                        }}

                        transition ={{
                            duration: 5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                       
                    >
                        {text}
                        </motion.span> 
    );
}
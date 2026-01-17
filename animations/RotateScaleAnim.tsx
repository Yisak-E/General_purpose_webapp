
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface RotateScaleAnimProps {
    text: string;
}

export default function RotateScaleAnim({ text }: RotateScaleAnimProps) {
    const [isMounted, setIsMounted] = useState(false);
    const [xOffsets, setXOffsets] = useState<number[] | null>(null);

    useEffect(() => {
        setIsMounted(true);
        // Generate random offsets once after mount to keep behavior stable
        setXOffsets([Math.random() * 250, Math.random() * 250]);
    }, []);

    // Avoid rendering on the server to prevent hydration mismatches
    // caused by non-deterministic Math.random()-based animation values.
    if (!isMounted) {
        return null;
    }

    // Wait until offsets are initialized
    if (!xOffsets) {
        return null;
    }

    return (
        <motion.div
            className="text-3xl mr-3 inline-block"
            initial={{
                y: [0, 0, 0],
                x: [xOffsets[0], xOffsets[1], 0],
                scale: 1,
                rotate: 0,
            }}
            animate={{
                y: [0, 100, 0],
                x: [xOffsets[0], xOffsets[1], 0],
                scale: 3,
                rotate: 360,
                color: ["#FFD700", "#FF4500", "#FF69B4"],
            }}
            transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
            }}
        >
            {text}
        </motion.div>
    );
}
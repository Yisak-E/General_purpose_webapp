"use client";

import { motion } from "framer-motion";

interface RainingLettersProps {
  /** Text whose letters will fall like rain */
  text?: string;
  /** Number of times to repeat the text horizontally */
  columns?: number;
}

/**
 * Simple "raining letters" animation.
 * - Letters fall from top to bottom repeatedly.
 * - Staggered delays create a rain-like effect.
 */
export default function RainingLetters({
  text = "RAINING WATER",
  columns = 3,
}: RainingLettersProps) {
  const baseChars = text.split("");
  const rows: string[][] = Array.from({ length: columns }, (_, colIndex) => {
    // Repeat the base text so each column has enough letters
    const repeated = Array.from({ length: 3 }, () => baseChars).flat();
    return repeated.map((ch, i) => (ch === " " ? "\u00A0" : ch));
  });

  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-b from-sky-900 via-sky-950 to-black flex items-center justify-center">
      <div className="flex gap-6 text-3xl md:text-4xl lg:text-5xl font-semibold tracking-widest text-sky-300/90">
        {rows.map((column, colIndex) => (
          <div key={colIndex} className="flex flex-col">
            {column.map((char, index) => (
              <motion.span
                key={`${colIndex}-${index}`}
                initial={{ y: -200, opacity: 0 }}
                animate={{ y: 400, opacity: [0, 1, 1, 0] }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: (colIndex * 0.4 + index * 0.15) % 3,
                }}
                className="drop-shadow-[0_0_12px_rgba(56,189,248,0.9)]"
              >
                {char}
              </motion.span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

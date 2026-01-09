'use client';

import {AnimatePresence, motion, useInView} from "framer-motion";
import * as React from "react";

export default function TextTypingAnim({ text }: { text: string }) {
    const ref = React.useRef(null)
    const isInView = useInView(ref, { once: true });
    
    return (
          <AnimatePresence>
            {
                text.split('').map((char, index) => (
                    <motion.span
                        key={index}
                        ref={ref}
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                    >
                        {char}
                    </motion.span>
                ))
            }

          </AnimatePresence>
    )
}
"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function WalkingStudent() {
  const [width, setWidth] = useState(1200);

  useEffect(() => {
    const update = () => setWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <motion.div
      aria-hidden
      initial={{ x: -120 }}
      animate={{ x: width + 120 }}
      transition={{
        duration: 40, // 👈 slow walk
        repeat: Infinity,
        ease: "linear",
      }}
      style={{
        position: "fixed",
        bottom: 20,
        zIndex: 9999,
        pointerEvents: "none",
      }}
    >
      {/* Body bounce */}
      <motion.div
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 1.2, repeat: Infinity }}
        style={{ position: "relative", width: 60, height: 100 }}
      >
        {/* Head */}
        <div
          style={{
            width: 26,
            height: 26,
            background: "#ffd6b0",
            borderRadius: "50%",
            margin: "0 auto",
          }}
        />

        {/* Body */}
        <div
          style={{
            width: 32,
            height: 40,
            background: "#4f7cff",
            margin: "4px auto 0",
            borderRadius: "6px",
          }}
        />

        {/* Legs */}
        <div style={{ position: "relative", width: 40, margin: "6px auto 0" }}>
          {/* Left leg */}
          <motion.div
            animate={{ rotate: [20, -20, 20] }}
            transition={{ duration: 0.6, repeat: Infinity }}
            style={{
              width: 6,
              height: 30,
              background: "#333",
              borderRadius: 3,
              position: "absolute",
              left: 8,
              transformOrigin: "top center",
            }}
          />

          {/* Right leg */}
          <motion.div
            animate={{ rotate: [-20, 20, -20] }}
            transition={{ duration: 0.6, repeat: Infinity }}
            style={{
              width: 6,
              height: 30,
              background: "#333",
              borderRadius: 3,
              position: "absolute",
              right: 8,
              transformOrigin: "top center",
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

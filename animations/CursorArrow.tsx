"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

export default function CursorArrow() {
  // Cursor position
  const mouseX = useMotionValue(window.innerWidth / 2);
  const mouseY = useMotionValue(window.innerHeight / 2);

  // Smooth follow
  const x = useSpring(mouseX, { stiffness: 80, damping: 20 });
  const y = useSpring(mouseY, { stiffness: 80, damping: 20 });

  // Rotation toward movement direction
  const rotate = useTransform(
    [mouseX, mouseY],
    ([mx, my]: [number, number]) => {
      const dx = mx - window.innerWidth / 2;
      const dy = my - window.innerHeight / 2;
      return Math.atan2(dy, dx) * (180 / Math.PI);
    }
  );

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      aria-hidden
      style={{
        position: "fixed",
        x,
        y,
        rotate,
        zIndex: 10000,
        pointerEvents: "none",
        transform: "translate(-50%, -50%)",
      }}
    >
      {/* Arrow body */}
      <div
        style={{
          width: 32,
          height: 6,
          background: "#00d4ff",
          borderRadius: 4,
          position: "relative",
          boxShadow: "0 0 12px rgba(0,212,255,0.8)",
        }}
      >
        {/* Arrow head */}
        <div
          style={{
            position: "absolute",
            right: -10,
            top: -6,
            width: 0,
            height: 0,
            borderTop: "9px solid transparent",
            borderBottom: "9px solid transparent",
            borderLeft: "14px solid #00d4ff",
          }}
        />
      </div>
    </motion.div>
  );
}

"use client";

import { motion } from "framer-motion";
import React from "react";

interface PlanetProps {
  size: number;
  orbitX: number;
  orbitY: number;
  orbitDuration: number;
  color: string;
  tilt?: number;
}

const Planet: React.FC<PlanetProps> = ({
  size,
  orbitX,
  orbitY,
  orbitDuration,
  color,
  tilt = 25,
}) => {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{
        repeat: Infinity,
        duration: orbitDuration,
        ease: "linear",
      }}
      style={{
        position: "absolute",
        width: orbitX * 2,
        height: orbitY * 2,
        borderRadius: "50%",
        border: "1px dashed rgba(255,255,255,0.2)", // ORBIT PATH
        transformStyle: "preserve-3d",
        transform: `rotateX(${tilt}deg)`,
      }}
    >
      {/* Planet */}
      <div
        style={{
          width: size,
          height: size,
          background: color,
          borderRadius: "50%",
          position: "absolute",
          top: "50%",
          left: "100%",
          transform: "translate(-50%, -50%)",
        }}
      />
    </motion.div>
  );
};

export default function SolarSystem() {
  return (
    <div
      style={{
        width: 700,
        height: 700,
        margin: "auto",
        position: "relative",
        perspective: 900,
        background: "black",
      }}
    >
      {/* Sun */}
      <div
        style={{
          width: 110,
          height: 110,
          background: "yellow",
          borderRadius: "50%",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          boxShadow: "0 0 80px 30px rgba(255,200,0,0.7)",
        }}
      />

      {/* Mercury */}
      <Planet size={12} orbitX={70} orbitY={50} orbitDuration={6} color="#aaa" />

      {/* Venus */}
      <Planet size={18} orbitX={100} orbitY={75} orbitDuration={9} color="#e6c16f" />

      {/* Earth */}
      <Planet size={20} orbitX={135} orbitY={100} orbitDuration={12} color="skyblue" />

      {/* Mars */}
      <Planet size={16} orbitX={170} orbitY={130} orbitDuration={18} color="red" />

      {/* Jupiter */}
      <Planet size={40} orbitX={220} orbitY={170} orbitDuration={30} color="#d9a066" />

      {/* Saturn */}
      <Planet size={36} orbitX={270} orbitY={210} orbitDuration={40} color="#e8d29f" />

      {/* Uranus */}
      <Planet size={30} orbitX={320} orbitY={260} orbitDuration={55} color="#9fd9ff" />
    </div>
  );
}

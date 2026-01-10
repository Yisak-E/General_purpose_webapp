import { motion } from "framer-motion";
import React from "react";

interface PlanetProps {
  name: string;
  size: number;        // px
  radius: number;      // orbit distance
  orbitSpeed: number;  // seconds per full orbit
  spinSpeed: number;   // seconds per self-rotation
  color: string;
}

const Planet: React.FC<PlanetProps> = ({
  size,
  radius,
  orbitSpeed,
  spinSpeed,
  color,
}) => {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{
        repeat: Infinity,
        duration: orbitSpeed,
        ease: "linear",
      }}
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
      }}
    >
      <motion.div
        animate={{ rotate: -360 }}
        transition={{
          repeat: Infinity,
          duration: spinSpeed,
          ease: "linear",
        }}
        style={{
          width: size,
          height: size,
          background: color,
          borderRadius: "50%",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(${radius}px, -${size / 2}px)`,
        }}
      />
    </motion.div>
  );
};

export default function SolarSystem() {
  return (
    <div
      style={{
        width: 400,
        height: 400,
        borderRadius: "50%",
        position: "relative",
        margin: "auto",
        background: "radial-gradient(circle, #111, #000)",
      }}
    >
      {/* Sun */}
      <div
        style={{
          width: 70,
          height: 70,
          background: "yellow",
          borderRadius: "50%",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          boxShadow: "0 0 40px 15px rgba(255,200,0,0.6)",
        }}
      />

      {/* Earth */}
      <Planet
        name="Earth"
        size={30}
        radius={120}
        orbitSpeed={10}
        spinSpeed={2}
        color="skyblue"
      />

      {/* Mars */}
      <Planet
        name="Mars"
        size={22}
        radius={170}
        orbitSpeed={18}
        spinSpeed={3}
        color="red"
      />
    </div>
  );
}
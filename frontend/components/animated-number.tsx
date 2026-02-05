"use client";

import { motion } from "framer-motion";

interface AnimatedNumberProps {
  number: string;
  delay: number;
}

export function AnimatedNumber({ number, delay }: AnimatedNumberProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -100, filter: "blur(12px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: 20, filter: "blur(12px)" }}
      transition={{
        delay,
        duration: 1.9,
        ease: "easeOut",
        type: "spring",
        stiffness: 40,
        damping: 12,
      }}
      className="font-bold drop-shadow-2xl xl:-mt-44 bg-[linear-gradient(to_bottom,white_40%,rgba(255,255,255,0.5)_60%)] bg-clip-text text-transparent"
      style={{
        fontSize: "clamp(4rem, 35vw, 650px)", // min 4rem, scales with viewport, max 600px
      }}
    >
      {number}
    </motion.div>
  );
}

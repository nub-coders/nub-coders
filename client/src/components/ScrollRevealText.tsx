import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface ScrollRevealTextProps {
  text: string;
  className?: string;
  delay?: number;
  staggerDelay?: number;
  once?: boolean;
}

export default function ScrollRevealText({ 
  text, 
  className = "", 
  delay = 0,
  staggerDelay = 0.03,
  once = true 
}: ScrollRevealTextProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-100px" });

  const words = text.split(" ");

  // Pre-calculate delays for each word
  let accumulatedDelay = delay;
  const wordDelays = words.map(word => {
    const current = accumulatedDelay;
    accumulatedDelay += (word.length + 1) * staggerDelay;
    return current;
  });

  return (
    <motion.span ref={ref} className={className}>
      {words.map((word, wordIndex) => {
        const wordStartDelay = wordDelays[wordIndex];
        
        return (
          <span key={wordIndex} className="inline-block whitespace-nowrap mr-[0.25em]">
            {word.split("").map((char, charIndex) => {
              const charDelay = wordStartDelay + (charIndex * staggerDelay);
              
              return (
                <motion.span
                  key={charIndex}
                  initial={{ opacity: 0, filter: "blur(10px)", y: 10 }}
                  animate={
                    isInView 
                      ? { opacity: 1, filter: "blur(0px)", y: 0 } 
                      : { opacity: 0, filter: "blur(10px)", y: 10 }
                  }
                  transition={{
                    duration: 0.4,
                    delay: charDelay,
                    ease: [0.25, 0.4, 0.25, 1]
                  }}
                  className="inline-block"
                  style={{ display: char === " " ? "inline" : "inline-block" }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              );
            })}
          </span>
        );
      })}
    </motion.span>
  );
}

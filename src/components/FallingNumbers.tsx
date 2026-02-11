import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo } from "react";

const FallingNumbers = () => {
  const [animationKey, setAnimationKey] = useState(0);
  const [show, setShow] = useState(false);
  const [initialDelayPassed, setInitialDelayPassed] = useState(false);

  // Generate random numbers for each animation cycle
  const numbers = useMemo(() => {
    return [...Array(30)].map((_, i) => ({
      id: i,
      value: i % 2 === 0 ? "2" : "3",
      x: Math.random() * 100,
      delay: Math.random() * 1.5,
      duration: 2 + Math.random() * 1.5,
      size: 1.5 + Math.random() * 2,
      rotation: -30 + Math.random() * 60,
    }));
  }, [animationKey]);

  // Wait 1 minute before starting the animation
  useEffect(() => {
    const initialDelay = setTimeout(() => {
      setInitialDelayPassed(true);
      setShow(true);
      setAnimationKey((prev) => prev + 1);
    }, 60000); // 1 minute delay

    return () => clearTimeout(initialDelay);
  }, []);

  useEffect(() => {
    if (!initialDelayPassed) return;

    const hideTimer = setTimeout(() => setShow(false), 4000);
    
    const interval = setInterval(() => {
      setAnimationKey((prev) => prev + 1);
      setShow(true);
    }, 60000); // Every 1 minute

    return () => {
      clearTimeout(hideTimer);
      clearInterval(interval);
    };
  }, [animationKey, initialDelayPassed]);

  return (
    <AnimatePresence>
      {show && (
        <div key={animationKey} className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {/* Many small falling 2s and 3s */}
          {numbers.map((num) => (
            <motion.div
              key={num.id}
              initial={{ 
                y: -100, 
                x: `${num.x}vw`, 
                rotate: num.rotation, 
                opacity: 0 
              }}
              animate={{ 
                y: ["0vh", "110vh"],
                opacity: [0, 1, 1, 0],
                rotate: [num.rotation, num.rotation + (Math.random() > 0.5 ? 180 : -180)],
              }}
              transition={{ 
                duration: num.duration,
                delay: num.delay,
                ease: "easeIn",
                opacity: { 
                  duration: num.duration, 
                  times: [0, 0.1, 0.85, 1] 
                }
              }}
              className="absolute font-display font-bold text-gradient select-none"
              style={{ 
                fontSize: `${num.size}rem`,
                textShadow: "0 0 20px hsl(43, 74%, 49% / 0.6)",
              }}
            >
              {num.value}
            </motion.div>
          ))}

          {/* Sparkle particles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={`sparkle-${i}`}
              initial={{ 
                y: -30, 
                x: `${Math.random() * 100}vw`, 
                opacity: 0,
                scale: 0
              }}
              animate={{ 
                y: ["0vh", "100vh"],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                rotate: [0, 360]
              }}
              transition={{ 
                duration: 2.5 + Math.random(),
                delay: Math.random() * 2,
                ease: "easeIn"
              }}
              className="absolute w-2 h-2 bg-primary rounded-full"
              style={{
                boxShadow: "0 0 12px hsl(43, 74%, 49%)"
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};

export default FallingNumbers;

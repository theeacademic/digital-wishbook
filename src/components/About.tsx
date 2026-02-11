import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const tributes = [
  {
    image: "/images/placeholder-1.svg",
    role: "A Treasured Son",
    color: "from-amber-400 to-yellow-600",
    bgGlow: "bg-amber-500/20",
    statement: "The pride of his parents, a blessing beyond measure",
  },
  {
    image: "/images/placeholder-2.svg",
    role: "A Beloved Brother",
    color: "from-amber-300 to-amber-500",
    bgGlow: "bg-amber-400/20",
    statement: "The bond that time only makes stronger",
  },
  {
    image: "/images/placeholder-3.svg",
    role: "A Cherished Uncle",
    color: "from-yellow-500 to-amber-600",
    bgGlow: "bg-yellow-500/20",
    statement: "Making memories that last a lifetime",
  },
  {
    image: "/images/placeholder-4.svg",
    role: "A Loyal Friend",
    color: "from-amber-400 to-yellow-500",
    bgGlow: "bg-amber-400/20",
    statement: "The one you call when life gets tough",
  },
  {
    image: "/images/placeholder-5.svg",
    role: "A Devoted Heart",
    color: "from-yellow-400 to-amber-500",
    bgGlow: "bg-yellow-400/20",
    statement: "The reason she believes in forever",
  },
];

const About = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % tributes.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Safeguard: ensure index is within bounds
  const safeIndex = currentIndex % tributes.length;
  const current = tributes[safeIndex];

  return (
    <section className="py-24 bg-dark-surface relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-background to-transparent" />

      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
            Celebrating <span className="text-gradient">Someone Special</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            To the world they are one person, but to us they are the world
          </p>
        </motion.div>

        {/* Single mobile-shaped card with changing content */}
        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Background glow effect */}
            <AnimatePresence mode="wait">
              <motion.div
                key={current.bgGlow}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className={`absolute inset-0 ${current.bgGlow} blur-3xl scale-150`}
              />
            </AnimatePresence>

            {/* Mobile phone frame */}
            <div className="relative w-72 h-[28rem] bg-card rounded-[3rem] border-4 border-border shadow-2xl p-6 flex flex-col items-center justify-center overflow-hidden">
              {/* Notch */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-2 bg-border rounded-full" />

              {/* Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="flex flex-col items-center text-center"
                >
                  {/* Photo instead of icon */}
                  <div className={`w-24 h-24 rounded-full overflow-hidden border-4 border-transparent bg-gradient-to-br ${current.color} p-0.5 mb-6 shadow-lg`}>
                    <img
                      src={current.image}
                      alt={current.role}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>

                  {/* Role title */}
                  <h3 className={`text-2xl font-display font-bold mb-4 bg-gradient-to-r ${current.color} bg-clip-text text-transparent`}>
                    {current.role}
                  </h3>

                  {/* Statement */}
                  <p className="text-muted-foreground leading-relaxed text-lg italic px-4">
                    "{current.statement}"
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Progress indicators */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5">
                {tributes.map((tribute, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === currentIndex ? `w-6 bg-gradient-to-r ${tribute.color}` : "w-1.5 bg-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>

              {/* Bottom bar */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-muted-foreground/20 rounded-full" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;

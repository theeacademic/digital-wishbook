import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cake, PartyPopper } from "lucide-react";

const heroImages = [
  "/images/placeholder-1.svg",
  "/images/placeholder-2.svg",
  "/images/placeholder-3.svg",
  "/images/placeholder-4.svg",
  "/images/placeholder-5.svg",
];

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Preload all images for faster switching
  useEffect(() => {
    heroImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000); // 5 seconds per photo
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-cool">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary/20 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-accent/15 blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.2, 0.4] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-navy/30 blur-3xl"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Image Carousel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            <div className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden shadow-glow border-4 border-primary/50 relative">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentIndex}
                  src={heroImages[currentIndex]}
                  alt="Birthday Celebration"
                  className="w-full h-full object-cover absolute inset-0"
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6 }}
                />
              </AnimatePresence>
            </div>
            {/* Carousel indicators */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
              {heroImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    idx === currentIndex ? "bg-primary w-6" : "bg-muted-foreground/40"
                  }`}
                />
              ))}
            </div>
            <motion.div
              className="absolute -bottom-4 -right-4 bg-gradient-blue p-4 rounded-full shadow-glow"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Cake className="w-8 h-8 text-primary-foreground" />
            </motion.div>
          </motion.div>

          {/* Text content */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center justify-center lg:justify-start gap-2 mb-4"
            >
              <PartyPopper className="w-5 h-5 text-accent" />
              <span className="text-muted-foreground font-medium tracking-wide uppercase text-sm">
                Happy Birthday!
              </span>
              <PartyPopper className="w-5 h-5 text-accent" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6"
            >
              <span className="text-gradient">Birthday</span>
              <br />
              <span className="text-foreground">Celebration</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-lg md:text-xl text-muted-foreground max-w-md mx-auto lg:mx-0"
            >
              Today we celebrate an amazing person! Share your birthday wishes, 
              voice notes, photos, and videos to make this day unforgettable.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-8"
            >
              <a
                href="#wishes"
                className="inline-flex items-center gap-2 bg-[hsl(43,70%,35%)] hover:bg-[hsl(43,74%,42%)] text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-glow transition-all duration-300 hover:-translate-y-1 border border-[hsl(43,74%,49%/0.3)]"
              >
                <Cake className="w-5 h-5" />
                Send Birthday Wishes
              </a>
            </motion.div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default Hero;
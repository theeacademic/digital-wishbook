import { motion } from "framer-motion";
import { Cake } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-16 bg-gradient-blue relative overflow-hidden">
      <div className="absolute inset-0 bg-black/20" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block mb-6"
          >
            <Cake className="w-12 h-12 text-white" />
          </motion.div>
          
          <h3 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            Happy Birthday! 🎂
          </h3>
          
          <p className="text-white/90 max-w-md mx-auto mb-8">
            This birthday tribute was made with love. Here's to another year 
            of amazing adventures, growth, and blessings!
          </p>
          
          <p className="text-white/70 text-sm">
            🎈 Cheers to another wonderful year! 🎈
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
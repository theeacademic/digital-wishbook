import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Gift } from "lucide-react";
import WishForm, { NewWish } from "./WishForm";
import WishGallery, { Wish } from "./WishGallery";
import { saveWishesToStorage, loadWishesFromStorage } from "@/lib/localStorage";

const WishesSection = () => {
  const [wishes, setWishes] = useState<Wish[]>([]);

  // Load wishes from localStorage on mount
  useEffect(() => {
    const savedWishes = loadWishesFromStorage();
    setWishes(savedWishes);
  }, []);

  // Save wishes to localStorage whenever they change
  useEffect(() => {
    if (wishes.length > 0 || localStorage.getItem("digital-wishbook-wishes")) {
      saveWishesToStorage(wishes);
    }
  }, [wishes]);

  const handleWishAdded = (newWish: NewWish) => {
    const wish: Wish = {
      id: crypto.randomUUID(),
      sender_name: newWish.sender_name,
      message: newWish.message,
      media_type: newWish.media_type,
      media_urls: newWish.media_urls,
      created_at: new Date().toISOString(),
    };
    setWishes((prev) => [wish, ...prev]);
  };

  return (
    <section id="wishes" className="py-24 bg-background relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, type: "spring" }}
            className="inline-flex items-center gap-2 bg-secondary px-4 py-2 rounded-full mb-6 border border-border"
          >
            <Gift className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-secondary-foreground">Birthday Wishes</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
            Celebrate <span className="text-gradient">This Special Day</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Share your messages, voice notes, photos, and videos to make this birthday special!
          </p>
        </motion.div>

        {/* Wish Form */}
        <div className="mb-16">
          <WishForm onWishAdded={handleWishAdded} />
        </div>

        {/* Wish Gallery */}
        <WishGallery wishes={wishes} onChangeWishes={setWishes} />
      </div>
    </section>
  );
};

export default WishesSection;
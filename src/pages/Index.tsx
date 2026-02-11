import Hero from "@/components/Hero";
import About from "@/components/About";
import WishesSection from "@/components/WishesSection";
import Footer from "@/components/Footer";
import FallingNumbers from "@/components/FallingNumbers";

const Index = () => {
  return (
    <main className="overflow-hidden">
      <FallingNumbers />
      <Hero />
      <About />
      <WishesSection />
      <Footer />
    </main>
  );
};

export default Index;
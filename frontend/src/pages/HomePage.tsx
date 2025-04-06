import Navbar from "../components/ui/navbar"; // if you're inside /pages/
// import HeroSection from "../components/ui/hero-section";
import Hero from "../components/ui/hero-section";
import Features from "@/components/ui/features";

const Home = () => {
    return (
          <div>
             <Navbar />
             <Hero />
             <Features />
          </div>
    );
  };
  
  export default Home;
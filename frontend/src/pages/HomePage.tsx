import Navbar from "../components/ui/navbar"; // if you're inside /pages/
// import HeroSection from "../components/ui/hero-section";
import Hero from "../components/ui/hero-section";
import Features from "@/components/ui/features";
import HowItWorksCarousel from "@/components/ui/how-it-works";
import TestimonialsScroll from "@/components/ui/testimonial";

const Home = () => {
    return (
          <div>
             <Navbar />
             <Hero />
             <Features />
             <HowItWorksCarousel />
             <TestimonialsScroll />
          </div>
    );
  };
  
  export default Home;
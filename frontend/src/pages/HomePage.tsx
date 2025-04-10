import Navbar from "../components/ui/navbar";
import Hero from "../components/ui/hero-section";
import Features from "@/components/ui/features";
import HowItWorksCarousel from "@/components/ui/how-it-works";
import TestimonialsScroll from "@/components/ui/testimonial";
import CTASection from "@/components/ui/cta";
import Footer from "@/components/ui/footer";

const Home = () => {
    return (
          <div>
             <Navbar />
             <Hero />
             <Features />
             <HowItWorksCarousel />
             <TestimonialsScroll />
             <CTASection />
             <Footer />
          </div>
    );
  };
  
  export default Home;
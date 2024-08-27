import CallToActionSection from "../components/HomePageContent/CallToActionSection";
import FeaturesSection from "../components/HomePageContent/FeaturesSection";
import HeroSection from "../components/HomePageContent/HeroSection";
import HowItWorksSection from "../components/HomePageContent/HowItWorksSection";
import TestimonialsSection from "../components/HomePageContent/TestimonialsSection";

const HomePage = () => {
  return (
    <div className="space-y-20">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CallToActionSection />
    </div>
  );
};

export default HomePage;

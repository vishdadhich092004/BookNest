import HeroSection from "../components/HomePageContent/HeroSection";
import BookCarousel from "../components/HomePageContent/BookCarousel";
import LampComponent from "../components/HomePageContent/LampComponent";
import InfiniteMovingCardsComponent from "../components/HomePageContent/InfiniteMovingCardsComponent";
import DoYouKnow from "../components/HomePageContent/DoYouKnow";

const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <BookCarousel />
      <DoYouKnow />
      <InfiniteMovingCardsComponent />
      <LampComponent />
    </div>
  );
};

export default HomePage;

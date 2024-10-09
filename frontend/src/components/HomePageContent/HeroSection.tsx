import BackgroundBeamsWithCollision from "../aceternity-ui/background-beams-with-collision";
import { FlipWords } from "../aceternity-ui/flip-words";
import UniversalSearchBar from "../Search/UniversalSeachBar";

const words = ["A Book", "An Author", "A Genre", "A Discussion"];

function HeroSection() {
  return (
    <BackgroundBeamsWithCollision>
      <div className="flex flex-col h-screen">
        <div className="flex flex-col md:flex-row flex-grow">
          {/* Main content - on bottom for mobile, on left for larger screens */}
          <div className="w-full md:w-1/2 flex flex-col justify-center px-4 md:px-8 py-8 md:py-0 flex-grow md:flex-grow-0">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-4xl xl:text-6xl font-bold text-white font-sans tracking-tight mb-4 sm:mb-6 text-center md:text-left">
              Unlock a World of Stories
            </h2>
            <div className="relative mx-auto md:mx-0 inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))] mb-10">
              <div className="absolute left-0 top-[1px] bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-2 sm:py-4 from-purple-500 via-violet-500 to-pink-500 [text-shadow:0_0_rgba(0,0,0,0.1)]">
                <span className="text-xl sm:text-2xl md:text-3xl lg:text-5xl xl:text-7xl">
                  Start Reading Now!
                </span>
              </div>
              <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 py-2 sm:py-4">
                <span className="text-xl sm:text-2xl md:text-3xl lg:text-5xl xl:text-7xl">
                  Start Reading Now!
                </span>
              </div>
            </div>
            <h1 className="lg:hidden font-bold text-white text-xl sm:text-2xl md:text-3xl mb-4 sm:mb-6 text-center">
              {/* A{" "} */}
              <FlipWords
                words={words}
                className="font-bold text-white text-xl sm:text-2xl md:text-3xl  text-center"
              />
              For Your Cerebrum 🧠
            </h1>
            <UniversalSearchBar className="lg:hidden" />
          </div>

          {/* Glowing line divider - hidden on mobile, visible on larger screens */}
          <div className="hidden md:block w-px bg-gradient-to-b from-transparent via-purple-500 to-transparent opacity-50 shadow-lg" />

          {/* Search component - hidden on mobile, visible on right for larger screens */}
          <div className="md:flex w-full md:w-1/2 flex-col justify-center px-4 md:px-8 py-8 md:py-0">
            <h1 className="hidden lg:block font-bold text-white text-xl sm:text-xl md:text-3xl text-center">
              {/* A{" "} */}
              <FlipWords
                words={words}
                className="font-bold text-white text-xl sm:text-xl md:text-3xl mb-4 sm:mb-6 text-center -mr-2"
              />
              For Your Cerebrum 🧠
            </h1>
            <UniversalSearchBar />
          </div>
        </div>
      </div>
    </BackgroundBeamsWithCollision>
  );
}

export default HeroSection;

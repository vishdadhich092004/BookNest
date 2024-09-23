import BackgroundBeamsWithCollision from "../aceternity-ui/background-beams-with-collision";
// import SearchBar from "../SearchBar";
import UniversalSearchBar from "../Search/UniversalSeachBar";

function HeroSection() {
  return (
    <BackgroundBeamsWithCollision>
      <div className="flex flex-col h-full">
        {/* Display the PlaceholdersAndVanishInputComponent only on smaller screens at the top */}
        <div>
          <UniversalSearchBar />
          {/* <SearchBar /> */}
        </div>

        {/* Main content */}
        <div className="flex-grow flex flex-col justify-center">
          {/* Main Heading */}
          <h2 className="text-2xl relative z-20 md:text-4xl lg:text-7xl font-bold text-center text-white font-sans tracking-tight">
            Unlock a World of Stories <br />
            <div className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
              <div className="absolute left-0 top-[1px] bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-4 from-purple-500 via-violet-500 to-pink-500 [text-shadow:0_0_rgba(0,0,0,0.1)]">
                <span className="">Start Reading Now!</span>
              </div>
              <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 py-4">
                <span className="">Start Reading Now!</span>
              </div>
            </div>
          </h2>
        </div>
      </div>
    </BackgroundBeamsWithCollision>
  );
}

export default HeroSection;

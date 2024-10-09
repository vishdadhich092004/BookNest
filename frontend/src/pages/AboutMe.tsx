import { FlipWords } from "../components/aceternity-ui/flip-words";

const words = ["She", "He"];

const AboutMe = () => {
  return (
    <div className="min-h-screen  text-gray-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-4">
            Hey <span className="text-purple-400">You</span>
          </h1>
          <div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Why this? Well...
            </p>
          </div>
          <div>
            <div className="text-xl text-gray-300 max-w-2xl mx-auto mt-14">
              This idea was suggested by my friend during a causal conversation.
              <br />
              So was the title.
              <br />
              <div className="mt-7">
                Thanks to
                <FlipWords
                  words={words}
                  duration={100}
                  className="text-xl text-white "
                />
                😁
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xl text-gray-300">
            It took me 78 days to build this from scratch
          </p>
          <p className="text-xl text-gray-300 ">Signing Off</p>

          <div className="font-greatVibe text-8xl my-20 ">Vish...</div>
        </div>
      </div>
    </div>
  );
};

export default AboutMe;

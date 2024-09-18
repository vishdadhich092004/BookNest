import { FaLightbulb } from "react-icons/fa";
import { TypewriterEffectSmooth } from "../aceternity-ui/typewriter-effect";

function DoYouKnow() {
  const words = [
    { text: "Do" },
    { text: "You" },
    { text: "Know" },
    { text: "?", className: "text-blue-500 dark:text-blue-500" },
  ];

  return (
    <div className="flex flex-col items-center justify-center pt-10">
      {/* Container for bulb and typewriter, arranged in a row */}
      <div className="flex items-center space-x-4">
        <FaLightbulb className="text-yellow-500 dark:text-yellow-400 text-6xl animate-pulse" />
        <TypewriterEffectSmooth words={words} />
      </div>
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4"></div>
    </div>
  );
}

export default DoYouKnow;

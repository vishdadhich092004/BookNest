import { motion } from "framer-motion";
import { LampContainer } from "../aceternity-ui/lamp";
import { useNavigate } from "react-router-dom";

function LampComponent() {
  const navigate = useNavigate();

  const handleJoinNow = () => {
    navigate("/sign-in");
  };
  const handleSignUp = () => {
    navigate("/register");
  };
  return (
    <LampContainer>
      <motion.h1
        initial={{ opacity: 0.5, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="bg-gradient-to-br from-slate-300 to-white py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
      >
        Read books
        <br /> the right way
      </motion.h1>
      <motion.div
        className="flex justify-center space-x-4 mt-8"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.5,
          duration: 0.8,
          ease: "easeInOut",
        }}
      >
        <button
          onClick={handleJoinNow}
          className="w-40 h-10 rounded-xl bg-black border dark:border-white border-transparent text-white text-sm"
        >
          Join now
        </button>
        <button
          onClick={handleSignUp}
          className="w-40 h-10 rounded-xl bg-white text-black border border-black text-sm "
        >
          Signup
        </button>
      </motion.div>
    </LampContainer>
  );
}

export default LampComponent;
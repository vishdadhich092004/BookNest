import { FaCalendarAlt } from "react-icons/fa";
import { FaBook, FaComments, FaStar } from "react-icons/fa6";

const features = [
  {
    icon: <FaBook />,
    title: "Vast Library",
    description: "Access to thousands of books across genres",
  },
  {
    icon: <FaComments />,
    title: "Active Discussions",
    description: "Engage in lively book discussions",
  },
  {
    icon: <FaCalendarAlt />,
    title: "Virtual Meetings",
    description: "Schedule and attend virtual book club meetings",
  },
  {
    icon: <FaStar />,
    title: "Reviews & Ratings",
    description: "Share your thoughts and see what others think",
  },
];
const FeaturesSection = () => {
  return (
    <section className="container mx-auto px-6 cursor-default">
      <h2 className="text-3xl font-semibold text-center mb-12">
        Why Choose BookNest?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300"
          >
            <div className="text-4xl text-teal-600 mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;

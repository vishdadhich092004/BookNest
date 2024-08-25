const steps = [
  {
    number: "1",
    title: "Create an Account",
    description: "Sign up and set up your reading preferences",
  },
  {
    number: "2",
    title: "Join or Create a Club",
    description: "Find a club that matches your interests or start your own",
  },
  {
    number: "3",
    title: "Participate",
    description: "Engage in discussions, attend meetings, and share reviews",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="bg-gray-100 py-20">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-semibold text-center mb-12">
          How It Works
        </h2>
        <div className="flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0 md:space-x-8">
          {steps.map((step, index) => (
            <div key={index} className="flex-1 text-center">
              <div className="w-16 h-16 bg-teal-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;

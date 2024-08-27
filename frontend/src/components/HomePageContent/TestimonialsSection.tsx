const testimonials = [
  {
    name: "Abhinav D.",
    quote:
      "BookNest has revolutionized my reading experience. I've connected with so many like-minded book lovers!",
  },
  {
    name: "Harshit S.",
    quote:
      "The discussions on BookNest have deepened my understanding and appreciation of literature.",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="container mx-auto px-6">
      <h2 className="text-3xl font-semibold text-center mb-12">
        What Our Users Say
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-600 italic mb-4">"{testimonial.quote}"</p>
            <p className="text-right font-semibold">- {testimonial.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;

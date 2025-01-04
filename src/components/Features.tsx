const Features = () => {
  const features = [
    {
      title: "Intuitive Design",
      description: "Crafted with attention to every detail for seamless interaction.",
    },
    {
      title: "Premium Experience",
      description: "Elevate your workflow with sophisticated tools and features.",
    },
    {
      title: "Innovative Technology",
      description: "Built using cutting-edge technology for optimal performance.",
    },
  ];

  return (
    <section className="py-24 px-6 bg-accent/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Exceptional Features</h2>
          <p className="text-secondary max-w-2xl mx-auto">
            Discover the tools that will transform your creative process
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-8 rounded-2xl bg-white/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 group"
            >
              <h3 className="text-xl font-semibold mb-4 group-hover:translate-y-[-2px] transition-transform duration-200">
                {feature.title}
              </h3>
              <p className="text-secondary">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
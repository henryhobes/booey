const steps: { icon: string; title: string; description: string; link?: string }[] = [
  {
    icon: "🎯",
    title: "Pick a tool",
    description: "Browse tools for cooking, work, health, and more",
    link: "/explore",
  },
  {
    icon: "💬",
    title: "Answer a few questions",
    description: "Simple questions, like talking to a friend",
  },
  {
    icon: "✨",
    title: "Get your result",
    description: "Personalized help in seconds",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16 md:py-24" aria-labelledby="how-it-works-heading">
      <div className="mx-auto max-w-5xl px-4 md:px-6 lg:px-8">
        <h2
          id="how-it-works-heading"
          className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-12 md:mb-16 text-base-content"
        >
          How it works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="text-6xl md:text-7xl mb-5" aria-hidden="true">
                {step.icon}
              </div>
              <h3 className="text-xl md:text-2xl font-semibold mb-3 text-base-content">
                {index + 1}. {step.link ? (
                  <a href={step.link} className="hover:text-primary transition-colors">
                    {step.title}
                  </a>
                ) : step.title}
              </h3>
              <p className="text-lg text-base-content/70">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

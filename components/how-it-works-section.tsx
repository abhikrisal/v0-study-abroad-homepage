const steps = [
  {
    number: "1",
    title: "Create Your Profile",
    description:
      "Tell us about your academic background, interests, budget, and preferred destinations. The more we know, the better we can match you.",
  },
  {
    number: "2",
    title: "Get Matched",
    description:
      "Our AI analyzes thousands of programs to find universities that align with your goals. Review personalized recommendations with detailed insights.",
  },
  {
    number: "3",
    title: "Apply with Confidence",
    description:
      "Track your applications, manage deadlines, and receive guidance every step of the way. We ensure nothing falls through the cracks.",
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground text-balance">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            Three simple steps to transform your study abroad dreams into
            reality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-full w-full h-px bg-border -translate-x-1/2 z-0" />
              )}
              <div className="relative z-10">
                <div className="w-24 h-24 rounded-2xl border border-border bg-card flex items-center justify-center mb-6">
                  <span className="text-4xl font-semibold text-foreground">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

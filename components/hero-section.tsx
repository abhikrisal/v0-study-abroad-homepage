import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Globe, Brain, TrendingUp } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 bg-primary overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 mb-8">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-sm text-primary-foreground/80">
                AI-Powered Study Abroad Platform
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-primary-foreground leading-tight text-balance">
              Making Global
              <br />
              Education{" "}
              <span className="text-accent">Smarter,</span>
              <br />
              Easier &amp; More
              <br />
              <span className="text-accent">Accessible</span>
            </h1>

            <p className="mt-6 text-lg text-primary-foreground/70 max-w-xl leading-relaxed">
              EduLynx uses AI to match you with the best universities worldwide, 
              track your applications, check eligibility in real-time, and provide 
              24/7 guidance on your journey to global education.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-start gap-4">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2 text-base px-8 font-semibold" asChild>
                <Link href="/onboarding">
                  Find Your University
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-base px-8" asChild>
                <Link href="/eligibility">Check Eligibility</Link>
              </Button>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-6">
              {[
                { value: "10,000+", label: "Students Helped" },
                { value: "500+", label: "Universities" },
                { value: "50+", label: "Countries" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold text-accent">{stat.value}</div>
                  <div className="text-sm text-primary-foreground/60 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right side cards */}
          <div className="hidden lg:flex flex-col gap-4">
            {[
              {
                icon: Brain,
                title: "AI Match Score",
                desc: "University of Toronto — Computer Science",
                badge: "92% Match",
                badgeColor: "bg-green-500",
              },
              {
                icon: Globe,
                title: "Top Destinations",
                desc: "Canada, Australia, Germany, UK, USA",
                badge: "50+ Countries",
                badgeColor: "bg-accent",
              },
              {
                icon: TrendingUp,
                title: "Application Tracker",
                desc: "3 applications in progress",
                badge: "Live Updates",
                badgeColor: "bg-blue-500",
              },
            ].map((card) => (
              <div key={card.title} className="flex items-center gap-4 bg-primary-foreground/10 border border-primary-foreground/20 rounded-xl p-4 backdrop-blur-sm">
                <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <card.icon className="h-6 w-6 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-primary-foreground">{card.title}</div>
                  <div className="text-xs text-primary-foreground/60 mt-0.5 truncate">{card.desc}</div>
                </div>
                <span className={`text-xs font-semibold text-white px-2.5 py-1 rounded-full flex-shrink-0 ${card.badgeColor}`}>
                  {card.badge}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

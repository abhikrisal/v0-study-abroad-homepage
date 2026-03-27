import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, ClipboardList, ShieldCheck } from "lucide-react"

const features = [
  {
    icon: Sparkles,
    title: "AI University Matching",
    description:
      "Our intelligent algorithm analyzes your profile, preferences, and goals to recommend universities that are the perfect fit for your academic journey.",
  },
  {
    icon: ClipboardList,
    title: "Application Tracking",
    description:
      "Keep all your applications organized in one place. Track deadlines, document submissions, and application status with our intuitive dashboard.",
  },
  {
    icon: ShieldCheck,
    title: "Real-Time Eligibility",
    description:
      "Instantly check if you meet admission requirements. Our system analyzes your credentials against university criteria in real-time.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 lg:py-32 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground text-balance">
            Everything You Need to
            <br />
            Study Abroad
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            Powerful tools designed to simplify your international education
            journey from start to finish.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border border-border bg-background hover:shadow-lg transition-shadow duration-300"
            >
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mb-6">
                  <feature.icon className="h-6 w-6 text-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

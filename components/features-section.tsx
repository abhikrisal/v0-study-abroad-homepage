import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, ClipboardList, ShieldCheck, MessageCircle, FileText, Users } from "lucide-react"

const features = [
  {
    icon: Sparkles,
    title: "Smart Recommendations",
    description: "AI analyzes your profile to match you with universities where you have the best chance of admission.",
  },
  {
    icon: ShieldCheck,
    title: "Real-time Eligibility",
    description: "Instantly check if you meet admission requirements with Safe, Moderate, and Reach classifications.",
  },
  {
    icon: ClipboardList,
    title: "Application Tracking",
    description: "Keep all your applications in one place. Track deadlines, document submissions, and status updates.",
  },
  {
    icon: MessageCircle,
    title: "AI Chat Assistant",
    description: "24/7 AI-powered support for all your study abroad questions — visas, SOPs, scholarships, and more.",
  },
  {
    icon: FileText,
    title: "Document Review",
    description: "Upload your SOP and LOR documents and get instant AI feedback on grammar, structure, and content.",
  },
  {
    icon: Users,
    title: "Student Community",
    description: "Connect with fellow students, share experiences, and get advice from those who've been there.",
  },
]

const problems = [
  { title: "Information Overload", desc: "Too many universities and programs to research manually." },
  { title: "Complex Applications", desc: "Each university has different requirements and deadlines." },
  { title: "Eligibility Uncertainty", desc: "Never sure if your profile meets the requirements." },
  { title: "Time-consuming Research", desc: "Weeks spent comparing options with no clear direction." },
  { title: "Lack of Guidance", desc: "No personalized advice tailored to your unique profile." },
]

export function FeaturesSection() {
  return (
    <>
      {/* Features */}
      <section id="features" className="py-20 lg:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-sm font-semibold text-accent uppercase tracking-wider">Platform Overview</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-foreground text-balance">
              Everything You Need to Study Abroad
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Powerful AI tools designed to simplify every step of your international education journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border border-border bg-card hover:shadow-md hover:border-accent/30 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-20 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-sm font-semibold text-accent uppercase tracking-wider">The Problem</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-primary-foreground text-balance">
              Why Students Struggle with Study Abroad
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/70">
              We built EduLynx to solve the real challenges students face when planning to study internationally.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {problems.map((problem, index) => (
              <div key={index} className="bg-primary-foreground/10 border border-primary-foreground/20 rounded-xl p-5">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center mb-3">
                  <span className="text-sm font-bold text-accent">{index + 1}</span>
                </div>
                <h3 className="text-sm font-semibold text-primary-foreground mb-2">{problem.title}</h3>
                <p className="text-xs text-primary-foreground/60 leading-relaxed">{problem.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

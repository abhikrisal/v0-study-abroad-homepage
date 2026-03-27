import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-20 lg:py-32 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground text-balance">
            Ready to Start Your Journey?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            Join thousands of students who have found their perfect university
            match. Your global education adventure begins here.
          </p>
          <div className="mt-8">
            <Button size="lg" className="gap-2 text-base px-8">
              Get Started Today
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

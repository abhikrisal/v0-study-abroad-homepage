import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Chen",
    university: "University of Toronto",
    country: "Canada",
    image: "/testimonials/sarah.jpg",
    quote: "Edulynx made my dream of studying in Canada a reality. The AI matching was spot-on, and I got into my top choice university!",
    rating: 5,
  },
  {
    name: "Marcus Williams",
    university: "University of Melbourne",
    country: "Australia",
    image: "/testimonials/marcus.jpg",
    quote: "The application tracker kept me organized throughout the entire process. I never missed a single deadline thanks to Edulynx.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    university: "Imperial College London",
    country: "United Kingdom",
    image: "/testimonials/priya.jpg",
    quote: "The eligibility checker saved me so much time. I knew exactly which universities I qualified for before even applying.",
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground text-balance">
            Students Love Edulynx
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            Join thousands of students who have successfully achieved their study abroad dreams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="border border-border bg-card hover:shadow-lg transition-shadow duration-300"
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  &quot;{testimonial.quote}&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.university}, {testimonial.country}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

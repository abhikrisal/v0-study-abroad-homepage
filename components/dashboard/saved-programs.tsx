import { MapPin, BookOpen, Heart, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const savedPrograms = [
  {
    id: 1,
    university: "University of Melbourne",
    country: "Australia",
    course: "Master of Data Science",
    matchPercentage: 95,
    deadline: "Mar 15, 2026",
    tuition: "$45,000/year",
  },
  {
    id: 2,
    university: "University of Toronto",
    country: "Canada",
    course: "MSc Computer Science",
    matchPercentage: 92,
    deadline: "Apr 1, 2026",
    tuition: "$52,000/year",
  },
  {
    id: 3,
    university: "Technical University of Munich",
    country: "Germany",
    course: "MSc Informatics",
    matchPercentage: 88,
    deadline: "May 31, 2026",
    tuition: "$3,500/year",
  },
  {
    id: 4,
    university: "University of Edinburgh",
    country: "United Kingdom",
    course: "MSc Artificial Intelligence",
    matchPercentage: 85,
    deadline: "Jun 30, 2026",
    tuition: "$38,000/year",
  },
]

function getMatchColor(percentage: number) {
  if (percentage >= 90) return "bg-accent text-accent-foreground"
  if (percentage >= 80) return "bg-chart-4/20 text-chart-4"
  return "bg-chart-1/20 text-chart-1"
}

export function SavedPrograms() {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-lg">Saved Programs</CardTitle>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          {savedPrograms.map((program) => (
            <div
              key={program.id}
              className="group relative rounded-lg border border-border bg-card p-4 transition-all hover:border-accent/50 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground truncate">{program.university}</h3>
                  <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{program.country}</span>
                  </div>
                </div>
                <Badge className={getMatchColor(program.matchPercentage)}>
                  {program.matchPercentage}% Match
                </Badge>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-sm text-foreground">
                <BookOpen className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <span className="truncate">{program.course}</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <span>Deadline: {program.deadline}</span>
                <span>{program.tuition}</span>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Button size="sm" className="flex-1">
                  Apply Now
                </Button>
                <Button size="sm" variant="outline" className="px-2.5">
                  <Heart className="h-4 w-4" />
                  <span className="sr-only">Remove from saved</span>
                </Button>
                <Button size="sm" variant="outline" className="px-2.5">
                  <ExternalLink className="h-4 w-4" />
                  <span className="sr-only">View details</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

import { CheckCircle, Circle, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Profile {
  first_name?: string | null
  last_name?: string | null
  phone?: string | null
  country?: string | null
  date_of_birth?: string | null
  highest_education?: string | null
  gpa?: number | null
  english_test?: string | null
  english_score?: number | null
}

interface ProfileProgressProps {
  profile: Profile | null
}

export function ProfileProgress({ profile }: ProfileProgressProps) {
  // Calculate completion based on profile data
  const profileSections = [
    { 
      id: 1, 
      name: "Personal Information", 
      completed: Boolean(profile?.first_name && profile?.last_name)
    },
    { 
      id: 2, 
      name: "Contact Details", 
      completed: Boolean(profile?.phone)
    },
    { 
      id: 3, 
      name: "Location", 
      completed: Boolean(profile?.country)
    },
    { 
      id: 4, 
      name: "Educational Background", 
      completed: Boolean(profile?.highest_education)
    },
    { 
      id: 5, 
      name: "Academic Performance", 
      completed: Boolean(profile?.gpa)
    },
    { 
      id: 6, 
      name: "English Proficiency", 
      completed: Boolean(profile?.english_test && profile?.english_score)
    },
  ]

  const completedSections = profileSections.filter((s) => s.completed).length
  const totalSections = profileSections.length
  const progressPercentage = Math.round((completedSections / totalSections) * 100)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Profile Completion</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-semibold text-foreground">{progressPercentage}%</span>
            <span className="text-sm text-muted-foreground">
              {completedSections} of {totalSections} sections
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2.5" />
          <p className="mt-2 text-sm text-muted-foreground">
            Complete your profile to get better university matches
          </p>
        </div>

        <div className="space-y-2">
          {profileSections.map((section) => (
            <div
              key={section.id}
              className="group flex items-center justify-between rounded-lg px-3 py-2 hover:bg-secondary transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                {section.completed ? (
                  <CheckCircle className="h-4 w-4 text-accent" />
                ) : (
                  <Circle className="h-4 w-4 text-muted-foreground" />
                )}
                <span
                  className={`text-sm ${
                    section.completed ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {section.name}
                </span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>

        <Button className="mt-4 w-full" variant="outline" asChild>
          <Link href="/onboarding">Complete Profile</Link>
        </Button>
      </CardContent>
    </Card>
  )
}

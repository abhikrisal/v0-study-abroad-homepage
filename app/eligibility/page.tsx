"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Sparkles, CheckCircle, AlertTriangle, Target, MapPin, DollarSign, GraduationCap } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const countries = [
  "United States", "United Kingdom", "Canada", "Australia", "Germany", 
  "France", "Netherlands", "Ireland", "New Zealand", "Singapore"
]

type CategoryType = "safe" | "moderate" | "reach"

interface University {
  name: string
  country: string
  program: string
  minGPA: string
  minIELTS: string
  tuition: string
  category: CategoryType
}

const universityResults: University[] = [
  // Safe
  { name: "University of Birmingham", country: "United Kingdom", program: "MSc Data Science", minGPA: "3.0", minIELTS: "6.5", tuition: "$28,000", category: "safe" },
  { name: "University of Auckland", country: "New Zealand", program: "Master of Data Science", minGPA: "3.0", minIELTS: "6.5", tuition: "$32,000", category: "safe" },
  { name: "Trinity College Dublin", country: "Ireland", program: "MSc Computer Science", minGPA: "3.0", minIELTS: "6.5", tuition: "$25,000", category: "safe" },
  // Moderate
  { name: "University of Toronto", country: "Canada", program: "MSc Computer Science", minGPA: "3.3", minIELTS: "7.0", tuition: "$35,000", category: "moderate" },
  { name: "University of Melbourne", country: "Australia", program: "Master of IT", minGPA: "3.2", minIELTS: "7.0", tuition: "$42,000", category: "moderate" },
  { name: "TU Munich", country: "Germany", program: "MSc Informatics", minGPA: "3.2", minIELTS: "6.5", tuition: "$500", category: "moderate" },
  // Reach
  { name: "Stanford University", country: "United States", program: "MS Computer Science", minGPA: "3.7", minIELTS: "7.5", tuition: "$58,000", category: "reach" },
  { name: "MIT", country: "United States", program: "MS EECS", minGPA: "3.8", minIELTS: "7.5", tuition: "$55,000", category: "reach" },
  { name: "Cambridge University", country: "United Kingdom", program: "MPhil Advanced CS", minGPA: "3.7", minIELTS: "7.5", tuition: "$45,000", category: "reach" },
]

const categoryConfig = {
  safe: {
    title: "Safe Schools",
    description: "You strongly meet the requirements",
    icon: CheckCircle,
    color: "text-accent",
    bgColor: "bg-accent/10",
    borderColor: "border-accent/30",
  },
  moderate: {
    title: "Moderate Schools",
    description: "You meet most requirements",
    icon: Target,
    color: "text-chart-4",
    bgColor: "bg-chart-4/10",
    borderColor: "border-chart-4/30",
  },
  reach: {
    title: "Reach Schools",
    description: "Competitive - consider strengthening your application",
    icon: AlertTriangle,
    color: "text-chart-1",
    bgColor: "bg-chart-1/10",
    borderColor: "border-chart-1/30",
  },
}

export default function EligibilityPage() {
  const [showResults, setShowResults] = useState(false)
  const [formData, setFormData] = useState({
    gpa: "",
    englishScore: "",
    budget: "",
    country: "",
  })

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault()
    setShowResults(true)
  }

  const UniversityCard = ({ university }: { university: University }) => {
    const config = categoryConfig[university.category]
    return (
      <Card className={`border ${config.borderColor}`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h4 className="font-semibold text-foreground">{university.name}</h4>
              <p className="text-sm text-accent">{university.program}</p>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {university.country}
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  {university.tuition}/year
                </span>
              </div>
            </div>
            <Badge variant="outline" className={`${config.bgColor} ${config.color} border-0`}>
              {university.category === "safe" ? "Safe" : university.category === "moderate" ? "Moderate" : "Reach"}
            </Badge>
          </div>
          <div className="mt-3 pt-3 border-t border-border grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-muted-foreground">Min GPA: </span>
              <span className="font-medium text-foreground">{university.minGPA}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Min IELTS: </span>
              <span className="font-medium text-foreground">{university.minIELTS}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const CategorySection = ({ category }: { category: CategoryType }) => {
    const config = categoryConfig[category]
    const Icon = config.icon
    const universities = universityResults.filter((u) => u.category === category)

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${config.bgColor}`}>
            <Icon className={`h-5 w-5 ${config.color}`} />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{config.title}</h3>
            <p className="text-sm text-muted-foreground">{config.description}</p>
          </div>
        </div>
        <div className="grid gap-3">
          {universities.map((university, index) => (
            <UniversityCard key={index} university={university} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 mb-6">
              <Sparkles className="h-4 w-4 text-accent" />
              <span className="text-sm text-accent font-medium">AI-Powered Analysis</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-semibold text-foreground mb-4 text-balance">
              Check Your University Eligibility
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Enter your academic profile and preferences to see which universities you qualify for,
              categorized into Safe, Moderate, and Reach schools.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Input Form */}
            <Card className="lg:col-span-1 h-fit sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-accent" />
                  Your Profile
                </CardTitle>
                <CardDescription>
                  Enter your details for personalized results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCheck} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="gpa">GPA (on 4.0 scale)</Label>
                    <Input
                      id="gpa"
                      placeholder="e.g., 3.5"
                      value={formData.gpa}
                      onChange={(e) => updateFormData("gpa", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="englishScore">IELTS / English Score</Label>
                    <Input
                      id="englishScore"
                      placeholder="e.g., 7.0"
                      value={formData.englishScore}
                      onChange={(e) => updateFormData("englishScore", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget (USD/year)</Label>
                    <Input
                      id="budget"
                      placeholder="e.g., 40000"
                      value={formData.budget}
                      onChange={(e) => updateFormData("budget", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Preferred Country</Label>
                    <Select
                      value={formData.country}
                      onValueChange={(value) => updateFormData("country", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country} value={country}>
                            {country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full gap-2">
                    <Sparkles className="h-4 w-4" />
                    Check Eligibility
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Results */}
            <div className="lg:col-span-2">
              {!showResults ? (
                <Card className="h-full flex items-center justify-center min-h-[400px]">
                  <CardContent className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      Enter Your Details
                    </h3>
                    <p className="text-muted-foreground max-w-sm mx-auto">
                      Fill in the form on the left to see your personalized university eligibility results.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-8">
                  <Card className="bg-primary text-primary-foreground">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary-foreground/10 flex items-center justify-center">
                          <Sparkles className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">Your Eligibility Analysis</h3>
                          <p className="text-primary-foreground/70 text-sm">
                            Based on GPA: {formData.gpa || "3.5"} | IELTS: {formData.englishScore || "7.0"} | Budget: ${formData.budget || "40,000"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <CategorySection category="safe" />
                  <CategorySection category="moderate" />
                  <CategorySection category="reach" />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

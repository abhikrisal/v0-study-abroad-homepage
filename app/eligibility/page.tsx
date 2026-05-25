'use client'

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Sparkles, CheckCircle, AlertTriangle, Target, MapPin, DollarSign, GraduationCap, Loader, TrendingUp } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { checkEligibility } from "@/lib/actions/eligibility"

const countries = [
  "United States", "United Kingdom", "Canada", "Australia", "Germany", 
  "France", "Netherlands", "Ireland", "New Zealand", "Singapore"
]

const fields = [
  "Computer Science", "Engineering", "Business", "Data Science", "Medicine",
  "Law", "Psychology", "Economics", "Environmental Science", "Architecture"
]

type CategoryType = "safe" | "moderate" | "reach"

interface University {
  universityName: string
  country: string
  tuition: number
  fitScore: number
  matchPercentage: number
  category: CategoryType
  reasons: string[]
}

const categoryConfig = {
  safe: {
    title: "Safe Schools",
    description: "You strongly meet the requirements (75%+ fit score)",
    icon: CheckCircle,
    color: "text-accent",
    bgColor: "bg-accent/10",
    borderColor: "border-accent/30",
  },
  moderate: {
    title: "Moderate Schools",
    description: "You meet most requirements (50-74% fit score)",
    icon: Target,
    color: "text-chart-4",
    bgColor: "bg-chart-4/10",
    borderColor: "border-chart-4/30",
  },
  reach: {
    title: "Reach Schools",
    description: "Competitive - consider strengthening your profile (<50% fit score)",
    icon: AlertTriangle,
    color: "text-chart-1",
    bgColor: "bg-chart-1/10",
    borderColor: "border-chart-1/30",
  },
}

export default function EligibilityPage() {
  const [isPending, startTransition] = useTransition()
  const [showResults, setShowResults] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<{
    safeSchools: University[]
    moderateSchools: University[]
    reachSchools: University[]
    summary: { safeCount: number; moderateCount: number; reachCount: number }
  } | null>(null)
  
  const [formData, setFormData] = useState({
    gpa: "",
    englishScore: "",
    englishTestType: "IELTS" as "IELTS" | "TOEFL",
    budget: "",
    preferredCountries: [] as string[],
    preferredFields: [] as string[],
    degreeLevel: "Masters" as "Bachelors" | "Masters" | "PhD",
  })

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleCountry = (country: string) => {
    setFormData((prev) => ({
      ...prev,
      preferredCountries: prev.preferredCountries.includes(country)
        ? prev.preferredCountries.filter((c) => c !== country)
        : [...prev.preferredCountries, country],
    }))
  }

  const toggleField = (field: string) => {
    setFormData((prev) => ({
      ...prev,
      preferredFields: prev.preferredFields.includes(field)
        ? prev.preferredFields.filter((f) => f !== field)
        : [...prev.preferredFields, field],
    }))
  }

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.gpa || !formData.englishScore || !formData.budget) {
      alert('Please fill in all required fields')
      return
    }

    startTransition(async () => {
      setError(null)
      try {
        const result = await checkEligibility({
          gpa: parseFloat(formData.gpa),
          englishScore: parseFloat(formData.englishScore),
          englishTestType: formData.englishTestType,
          budget: parseInt(formData.budget),
          preferredCountries: formData.preferredCountries.length > 0 ? formData.preferredCountries : countries,
          preferredFields: formData.preferredFields.length > 0 ? formData.preferredFields : fields,
          degreeLevel: formData.degreeLevel,
        })
        setResults(result as any)
        setShowResults(true)
      } catch (error) {
        setError('Unable to check eligibility. Please try again.')
      }
    })
  }

  const UniversityCard = ({ university }: { university: University }) => {
    const config = categoryConfig[university.category]
    return (
      <Card className={`border ${config.borderColor}`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h4 className="font-semibold text-foreground">{university.universityName}</h4>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {university.country}
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  ${university.tuition}/year
                </span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {university.fitScore}% fit
                </span>
              </div>
            </div>
            <Badge variant="outline" className={`${config.bgColor} ${config.color} border-0`}>
              {university.category === "safe" ? "Safe" : university.category === "moderate" ? "Moderate" : "Reach"}
            </Badge>
          </div>
          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-xs font-medium text-muted-foreground mb-2">Why this match:</p>
            <ul className="text-xs space-y-1">
              {university.reasons.slice(0, 3).map((reason, idx) => (
                <li key={idx} className="text-foreground">• {reason}</li>
              ))}
            </ul>
          </div>
          <Button variant="outline" size="sm" className="w-full mt-3">
            View Details
          </Button>
        </CardContent>
      </Card>
    )
  }

  const CategorySection = ({ category }: { category: CategoryType }) => {
    const config = categoryConfig[category]
    const Icon = config.icon
    const universities = category === 'safe' ? results?.safeSchools : 
                        category === 'moderate' ? results?.moderateSchools : 
                        results?.reachSchools
    
    if (!universities || universities.length === 0) return null

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${config.bgColor}`}>
            <Icon className={`h-5 w-5 ${config.color}`} />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{config.title}</h3>
            <p className="text-sm text-muted-foreground">{config.description}</p>
            <p className="text-xs text-muted-foreground mt-1">{universities.length} universities found</p>
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
              <span className="text-sm text-accent font-medium">AI-Powered Matching Algorithm</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-semibold text-foreground mb-4 text-balance">
              AI University Eligibility Checker
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Our intelligent matching algorithm compares your academic profile with real university requirements
              and categorizes them into Safe, Moderate, and Reach schools based on your fit score.
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
                  Enter your details for AI-powered analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCheck} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="gpa">GPA (on 4.0 scale) *</Label>
                    <Input
                      id="gpa"
                      type="number"
                      step="0.01"
                      min="0"
                      max="4"
                      placeholder="e.g., 3.5"
                      value={formData.gpa}
                      onChange={(e) => updateFormData("gpa", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="englishTestType">English Test</Label>
                    <Select
                      value={formData.englishTestType}
                      onValueChange={(value) => updateFormData("englishTestType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IELTS">IELTS</SelectItem>
                        <SelectItem value="TOEFL">TOEFL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="englishScore">English Score *</Label>
                    <Input
                      id="englishScore"
                      type="number"
                      step="0.1"
                      placeholder="e.g., 7.0"
                      value={formData.englishScore}
                      onChange={(e) => updateFormData("englishScore", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="budget">Annual Budget (USD) *</Label>
                    <Input
                      id="budget"
                      type="number"
                      placeholder="e.g., 40000"
                      value={formData.budget}
                      onChange={(e) => updateFormData("budget", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="degreeLevel">Degree Level</Label>
                    <Select
                      value={formData.degreeLevel}
                      onValueChange={(value) => updateFormData("degreeLevel", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Bachelors">Bachelors</SelectItem>
                        <SelectItem value="Masters">Masters</SelectItem>
                        <SelectItem value="PhD">PhD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Preferred Countries (select at least 1)</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {countries.map((country) => (
                        <button
                          key={country}
                          type="button"
                          onClick={() => toggleCountry(country)}
                          className={`text-xs px-2 py-1 rounded border transition-colors ${
                            formData.preferredCountries.includes(country)
                              ? "bg-accent text-accent-foreground border-accent"
                              : "border-border hover:bg-secondary"
                          }`}
                        >
                          {country}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Preferred Fields (select at least 1)</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {fields.map((field) => (
                        <button
                          key={field}
                          type="button"
                          onClick={() => toggleField(field)}
                          className={`text-xs px-2 py-1 rounded border transition-colors ${
                            formData.preferredFields.includes(field)
                              ? "bg-accent text-accent-foreground border-accent"
                              : "border-border hover:bg-secondary"
                          }`}
                        >
                          {field}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full gap-2"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <Loader className="h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Check Eligibility
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Results */}
            <div className="lg:col-span-2">
              {error && (
                <div className="mb-4 p-4 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive text-sm">
                  {error}
                </div>
              )}
              {!showResults ? (
                <Card className="h-full flex items-center justify-center min-h-[400px]">
                  <CardContent className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      Ready to Find Your Match?
                    </h3>
                    <p className="text-muted-foreground max-w-sm mx-auto">
                      Fill in the form on the left to get AI-powered university recommendations based on your academic profile and preferences.
                    </p>
                  </CardContent>
                </Card>
              ) : results ? (
                <div className="space-y-8">
                  <Card className="bg-primary text-primary-foreground">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary-foreground/10 flex items-center justify-center">
                          <Sparkles className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">Your AI Analysis</h3>
                          <p className="text-primary-foreground/70 text-sm">
                            {results.summary.safeCount} Safe • {results.summary.moderateCount} Moderate • {results.summary.reachCount} Reach
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <CategorySection category="safe" />
                  <CategorySection category="moderate" />
                  <CategorySection category="reach" />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

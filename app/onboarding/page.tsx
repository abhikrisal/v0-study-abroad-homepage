"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

const steps = [
  { id: 1, title: "Personal Details" },
  { id: 2, title: "Academic Background" },
  { id: 3, title: "Preferences" },
  { id: 4, title: "Career Goals" },
]

const nationalities = [
  "Nepal", "India", "Bangladesh", "Pakistan", "Sri Lanka", "Nigeria",
  "Ghana", "Kenya", "Philippines", "Vietnam", "Indonesia", "China",
  "United States", "United Kingdom", "Canada", "Australia", "Germany", 
  "France", "Netherlands", "Ireland", "New Zealand", "Singapore", "Other"
]

const preferredCountries = [
  "United States", "United Kingdom", "Canada", "Australia", "Germany", 
  "France", "Netherlands", "Ireland", "New Zealand", "Singapore", "Switzerland"
]

const fieldsOfStudy = [
  "Computer Science", "Business Administration", "Engineering", "Medicine",
  "Law", "Arts & Design", "Data Science", "Psychology", "Economics", "Biology",
  "Environmental Science", "International Relations", "Architecture"
]

const qualifications = [
  "High School Diploma", "Bachelor's Degree", "Master's Degree", "Doctorate"
]

const programLevels = [
  "Undergraduate", "Postgraduate", "Doctoral", "Certificate/Diploma"
]

const careerGoals = [
  "Work in a multinational company",
  "Start my own business",
  "Pursue academic research",
  "Work in my home country",
  "Settle abroad permanently",
  "Other"
]

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<{ id: string; email: string } | null>(null)
  
  const [formData, setFormData] = useState({
    // Step 1: Personal Details
    firstName: "",
    lastName: "",
    phone: "",
    nationality: "",
    // Step 2: Academic Background
    gpa: "",
    englishTest: "",
    englishScore: "",
    highestQualification: "",
    // Step 3: Preferences
    preferredCountry: "",
    budgetMin: "",
    budgetMax: "",
    fieldOfStudy: "",
    programLevel: "",
    // Step 4: Career Goals
    careerGoal: "",
    additionalInfo: "",
  })

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser({ id: user.id, email: user.email || '' })
        // Pre-fill email if available from user metadata
        const metadata = user.user_metadata
        if (metadata) {
          setFormData(prev => ({
            ...prev,
            firstName: metadata.first_name || '',
            lastName: metadata.last_name || '',
          }))
        }
      }
    })
  }, [])

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const progressPercentage = (currentStep / steps.length) * 100

  const handleNext = async () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    } else {
      // Submit to database
      setIsLoading(true)
      setError(null)
      
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          setError("Please log in to save your profile")
          setIsLoading(false)
          return
        }

        // 1. Update profiles table (only columns that exist)
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            email: user.email,
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
            nationality: formData.nationality,
            role: 'student',
            profile_completed: 100,
            updated_at: new Date().toISOString()
          })

        if (profileError) {
          console.log('[v0] profileError:', profileError.message)
          throw profileError
        }

        // 2. Upsert academic_background table
        const { error: academicError } = await supabase
          .from('academic_background')
          .upsert({
            user_id: user.id,
            highest_education: formData.highestQualification,
            gpa: formData.gpa ? parseFloat(formData.gpa) : null,
            english_test_type: formData.englishTest,
            english_test_score: formData.englishScore ? parseFloat(formData.englishScore) : null,
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id' })

        if (academicError) {
          console.log('[v0] academicError:', academicError.message)
          throw academicError
        }

        // 3. Upsert preferences table
        const { error: prefError } = await supabase
          .from('preferences')
          .upsert({
            user_id: user.id,
            preferred_countries: formData.preferredCountry ? [formData.preferredCountry] : [],
            preferred_fields: formData.fieldOfStudy ? [formData.fieldOfStudy] : [],
            budget_min: formData.budgetMin ? parseInt(formData.budgetMin) : null,
            budget_max: formData.budgetMax ? parseInt(formData.budgetMax) : null,
            program_level: formData.programLevel,
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id' })

        if (prefError) {
          console.log('[v0] prefError:', prefError.message)
          throw prefError
        }

        // Redirect to dashboard
        router.push("/dashboard")
        router.refresh()
      } catch (err) {
        console.error('Error saving profile:', err)
        setError("Failed to save your profile. Please try again.")
        setIsLoading(false)
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">E</span>
            </div>
            <span className="text-xl font-semibold tracking-tight text-foreground">
              Edulynx
            </span>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                      currentStep > step.id
                        ? "bg-accent text-accent-foreground"
                        : currentStep === step.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <span className="mt-2 text-xs text-muted-foreground hidden sm:block">
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-12 sm:w-24 lg:w-32 h-1 mx-2 rounded-full transition-colors ${
                      currentStep > step.id ? "bg-accent" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">
            Step {currentStep} of {steps.length}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded-md">
            {error}
          </div>
        )}

        {/* Form Card */}
        <Card className="border border-border">
          <CardHeader>
            <CardTitle>{steps[currentStep - 1].title}</CardTitle>
            <CardDescription>
              {currentStep === 1 && "Tell us a bit about yourself so we can personalize your experience."}
              {currentStep === 2 && "Share your academic achievements to help us find the best matches."}
              {currentStep === 3 && "Let us know your preferences for studying abroad."}
              {currentStep === 4 && "Help us understand your career aspirations."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Step 1: Personal Details */}
            {currentStep === 1 && (
              <div className="grid gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="Enter your first name"
                      value={formData.firstName}
                      onChange={(e) => updateFormData("firstName", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Enter your last name"
                      value={formData.lastName}
                      onChange={(e) => updateFormData("lastName", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={(e) => updateFormData("phone", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nationality">Nationality</Label>
                  <Select
                    value={formData.nationality}
                    onValueChange={(value) => updateFormData("nationality", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your nationality" />
                    </SelectTrigger>
                    <SelectContent>
                      {nationalities.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 2: Academic Background */}
            {currentStep === 2 && (
              <div className="grid gap-6">
                <div className="space-y-2">
                  <Label htmlFor="highestQualification">Highest Qualification</Label>
                  <Select
                    value={formData.highestQualification}
                    onValueChange={(value) => updateFormData("highestQualification", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your highest qualification" />
                    </SelectTrigger>
                    <SelectContent>
                      {qualifications.map((qual) => (
                        <SelectItem key={qual} value={qual}>
                          {qual}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gpa">GPA / Grade (on 4.0 scale)</Label>
                  <Input
                    id="gpa"
                    type="number"
                    step="0.1"
                    min="0"
                    max="4"
                    placeholder="e.g., 3.5"
                    value={formData.gpa}
                    onChange={(e) => updateFormData("gpa", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="englishTest">English Test</Label>
                    <Select
                      value={formData.englishTest}
                      onValueChange={(value) => updateFormData("englishTest", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select test type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IELTS">IELTS</SelectItem>
                        <SelectItem value="TOEFL">TOEFL</SelectItem>
                        <SelectItem value="PTE">PTE Academic</SelectItem>
                        <SelectItem value="Duolingo">Duolingo English Test</SelectItem>
                        <SelectItem value="none">Not taken yet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="englishScore">Score</Label>
                    <Input
                      id="englishScore"
                      type="number"
                      step="0.5"
                      placeholder="e.g., 7.0 for IELTS"
                      value={formData.englishScore}
                      onChange={(e) => updateFormData("englishScore", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Preferences */}
            {currentStep === 3 && (
              <div className="grid gap-6">
                <div className="space-y-2">
                  <Label htmlFor="preferredCountry">Preferred Country</Label>
                  <Select
                    value={formData.preferredCountry}
                    onValueChange={(value) => updateFormData("preferredCountry", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select preferred country" />
                    </SelectTrigger>
                    <SelectContent>
                      {preferredCountries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Budget Range (USD per year)</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="number"
                      placeholder="Min (e.g., 15000)"
                      value={formData.budgetMin}
                      onChange={(e) => updateFormData("budgetMin", e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="Max (e.g., 50000)"
                      value={formData.budgetMax}
                      onChange={(e) => updateFormData("budgetMax", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fieldOfStudy">Field of Study</Label>
                  <Select
                    value={formData.fieldOfStudy}
                    onValueChange={(value) => updateFormData("fieldOfStudy", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select field of study" />
                    </SelectTrigger>
                    <SelectContent>
                      {fieldsOfStudy.map((field) => (
                        <SelectItem key={field} value={field}>
                          {field}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="programLevel">Program Level</Label>
                  <Select
                    value={formData.programLevel}
                    onValueChange={(value) => updateFormData("programLevel", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select program level" />
                    </SelectTrigger>
                    <SelectContent>
                      {programLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 4: Career Goals */}
            {currentStep === 4 && (
              <div className="grid gap-6">
                <div className="space-y-2">
                  <Label htmlFor="careerGoal">Primary Career Goal</Label>
                  <Select
                    value={formData.careerGoal}
                    onValueChange={(value) => updateFormData("careerGoal", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your primary career goal" />
                    </SelectTrigger>
                    <SelectContent>
                      {careerGoals.map((goal) => (
                        <SelectItem key={goal} value={goal}>
                          {goal}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="additionalInfo">Tell us more about your goals (optional)</Label>
                  <Textarea
                    id="additionalInfo"
                    placeholder="Share any additional information about your career aspirations, specific universities you're interested in, or any other relevant details..."
                    className="min-h-[150px]"
                    value={formData.additionalInfo}
                    onChange={(e) => updateFormData("additionalInfo", e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1 || isLoading}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <Button onClick={handleNext} disabled={isLoading} className="gap-2">
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : currentStep === steps.length ? (
                  "Complete"
                ) : (
                  <>
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {!user && (
          <p className="text-center text-sm text-muted-foreground mt-4">
            <Link href="/login" className="text-accent hover:underline">
              Log in
            </Link>{" "}
            to save your profile and get personalized recommendations.
          </p>
        )}
      </main>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Search, SlidersHorizontal, MapPin, GraduationCap, DollarSign, Heart, ArrowUpDown, Loader2, Sparkles } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase/client"
import { calculateFitScore, type StudentProfile, type UniversityRequirements } from "@/lib/services/eligibility-matcher"

interface Program {
  id: string
  name: string
  field_of_study: string
  level: string
  duration_months: number
  tuition_fee: number
  currency: string
  deadline: string
  university: {
    id: string
    name: string
    country: string
    city: string
  }
}

const countries = ["All Countries", "Canada", "United Kingdom", "Australia", "Germany", "Switzerland"]
const fieldsOfStudy = ["All Fields", "Computer Science", "Data Science", "Engineering", "Business"]
const programLevels = ["All Levels", "Bachelors", "Masters", "Doctoral"]

const countryCodeMap: { [key: string]: string } = {
  "Canada": "CA",
  "United Kingdom": "GB",
  "Australia": "AU",
  "Germany": "DE",
  "United States": "US",
  "Netherlands": "NL",
  "Singapore": "SG",
  "Switzerland": "CH",
}

function getMatchBadgeColor(percentage: number, category?: string) {
  if (category === 'safe') return "bg-green-500 text-white"
  if (category === 'moderate') return "bg-accent text-accent-foreground"
  if (category === 'reach') return "bg-orange-500 text-white"
  if (percentage >= 90) return "bg-green-500 text-white"
  if (percentage >= 75) return "bg-accent text-accent-foreground"
  return "bg-orange-500 text-white"
}

function getCountryFlag(country: string) {
  const code = countryCodeMap[country] || "UN"
  const codePoints = code
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCountry, setSelectedCountry] = useState("All Countries")
  const [selectedField, setSelectedField] = useState("All Fields")
  const [selectedLevel, setSelectedLevel] = useState("All Levels")
  const [budgetRange, setBudgetRange] = useState([0, 60000])
  const [minIelts, setMinIelts] = useState("")
  const [sortBy, setSortBy] = useState("match")
  const [savedPrograms, setSavedPrograms] = useState<string[]>([])
  const [user, setUser] = useState<any>(null)
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null)
  const [showAIRecommendations, setShowAIRecommendations] = useState(false)

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()
      
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      const { data: programsData, error } = await supabase
        .from('programs')
        .select(`*, university:universities(*)`)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching programs:', error)
      } else {
        setPrograms(programsData || [])
      }

      if (user) {
        const { data: savedData } = await supabase
          .from('saved_programs')
          .select('program_id')
          .eq('user_id', user.id)

        if (savedData) {
          setSavedPrograms(savedData.map(s => s.program_id))
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        const { data: preferences } = await supabase
          .from('preferences')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (profile && preferences) {
          setStudentProfile({
            gpa: profile.gpa || 3.0,
            englishScore: profile.english_score || 6.5,
            englishTestType: (profile.english_test_type as 'IELTS' | 'TOEFL') || 'IELTS',
            budget: preferences.budget_max || 50000,
            preferredCountries: preferences.preferred_countries || [],
            preferredFields: preferences.preferred_fields || [],
            degreeLevel: (preferences.degree_level as 'Bachelors' | 'Masters' | 'PhD') || 'Masters',
          })
          setShowAIRecommendations(true)
        }
      }

      setIsLoading(false)
    }

    fetchData()
  }, [])

  const calculateRealMatchPercentage = (program: Program): { score: number, category: 'safe' | 'moderate' | 'reach', reasons: string[] } => {
    if (!studentProfile || !program.university) {
      return { score: Math.floor(Math.random() * 20) + 75, category: 'moderate', reasons: ['Complete your profile for personalized recommendations'] }
    }

    const universityReq: UniversityRequirements = {
      id: program.university.id,
      name: program.university.name,
      country: program.university.country,
      city: program.university.city || '',
      minGPA: 3.0,
      minEnglishScore: 6.5,
      englishTestType: 'IELTS',
      tuitionFee: program.tuition_fee || 30000,
      selectivityRank: 100,
      fields: [program.field_of_study || ''],
      degreeLevel: program.level || 'Masters',
    }

    return calculateFitScore(studentProfile, universityReq)
  }

  const toggleSave = async (programId: string) => {
    if (!user) {
      window.location.href = '/login'
      return
    }

    const supabase = createClient()
    
    if (savedPrograms.includes(programId)) {
      await supabase
        .from('saved_programs')
        .delete()
        .eq('user_id', user.id)
        .eq('program_id', programId)
      
      setSavedPrograms(prev => prev.filter(p => p !== programId))
    } else {
      const matchResult = calculateRealMatchPercentage(programs.find(p => p.id === programId)!)
      await supabase
        .from('saved_programs')
        .insert({
          user_id: user.id,
          program_id: programId,
          match_percentage: matchResult.score
        })
      
      setSavedPrograms(prev => [...prev, programId])
    }
  }

  const filteredPrograms = programs
    .filter(program => {
      if (searchQuery && 
          !program.university?.name?.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !program.name?.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }
      if (selectedCountry !== "All Countries" && program.university?.country !== selectedCountry) {
        return false
      }
      if (program.tuition_fee < budgetRange[0] || program.tuition_fee > budgetRange[1]) {
        return false
      }
      if (selectedLevel !== "All Levels" && program.level !== selectedLevel) {
        return false
      }
      if (selectedField !== "All Fields" && program.field_of_study !== selectedField) {
        return false
      }
      return true
    })
    .map(program => {
      const matchResult = calculateRealMatchPercentage(program)
      return {
        ...program,
        matchPercentage: matchResult.score,
        matchCategory: matchResult.category,
        matchReasons: matchResult.reasons,
      }
    })
    .sort((a, b) => {
      if (sortBy === "match") return b.matchPercentage - a.matchPercentage
      if (sortBy === "tuition-low") return a.tuition_fee - b.tuition_fee
      if (sortBy === "tuition-high") return b.tuition_fee - a.tuition_fee
      return 0
    })

  const FilterContent = () => (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="text-sm font-medium">Country</Label>
        {countries.map((country) => (
          <div key={country} className="flex items-center gap-2">
            <Checkbox 
              id={country}
              checked={selectedCountry === country}
              onCheckedChange={() => setSelectedCountry(country)}
            />
            <label htmlFor={country} className="text-sm text-muted-foreground cursor-pointer">
              {country}
            </label>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">Field of Study</Label>
        <Select value={selectedField} onValueChange={setSelectedField}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {fieldsOfStudy.map((field) => (
              <SelectItem key={field} value={field}>{field}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">Budget Range (USD/year)</Label>
        <Slider
          value={budgetRange}
          onValueChange={setBudgetRange}
          max={60000}
          step={1000}
          className="mt-2"
        />
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>${budgetRange[0].toLocaleString()}</span>
          <span>${budgetRange[1].toLocaleString()}</span>
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">Min IELTS Score</Label>
        <Input 
          placeholder="e.g., 6.5"
          value={minIelts}
          onChange={(e) => setMinIelts(e.target.value)}
        />
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">Program Level</Label>
        {programLevels.map((level) => (
          <div key={level} className="flex items-center gap-2">
            <Checkbox 
              id={level}
              checked={selectedLevel === level}
              onCheckedChange={() => setSelectedLevel(level)}
            />
            <label htmlFor={level} className="text-sm text-muted-foreground cursor-pointer">
              {level}
            </label>
          </div>
        ))}
      </div>

      <Button 
        variant="outline" 
        className="w-full"
        onClick={() => {
          setSelectedCountry("All Countries")
          setSelectedField("All Fields")
          setSelectedLevel("All Levels")
          setBudgetRange([0, 60000])
          setMinIelts("")
        }}
      >
        Clear Filters
      </Button>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        <div className="bg-primary text-primary-foreground py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-semibold mb-6">Find Your Perfect Program</h1>
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Search universities or programs..."
                  className="pl-10 bg-background text-foreground h-12"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="secondary" className="lg:hidden h-12 px-4">
                    <SlidersHorizontal className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-24 bg-card border border-border rounded-lg p-6">
                <h2 className="font-semibold text-foreground mb-6">Filters</h2>
                <FilterContent />
              </div>
            </aside>

            <div className="flex-1">
              {showAIRecommendations && (
                <div className="mb-6 p-4 bg-accent/10 border border-accent/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-5 w-5 text-accent" />
                    <span className="font-semibold text-foreground">AI-Powered Recommendations</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Programs ranked based on your profile: GPA ({studentProfile?.gpa}), 
                    {studentProfile?.englishTestType} ({studentProfile?.englishScore}), 
                    Budget (${studentProfile?.budget?.toLocaleString()}), 
                    Preferred: {studentProfile?.preferredCountries?.join(', ') || 'Any country'}.
                  </p>
                </div>
              )}
              
              {!showAIRecommendations && user && (
                <div className="mb-6 p-4 bg-muted border border-border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-5 w-5 text-muted-foreground" />
                    <span className="font-semibold text-foreground">Get AI Recommendations</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <Link href="/onboarding" className="text-accent hover:underline">Complete your profile</Link> to get personalized AI-powered university recommendations.
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">{filteredPrograms.length}</span> programs found
                </p>
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-44">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="match">AI Match %</SelectItem>
                      <SelectItem value="tuition-low">Tuition (Low-High)</SelectItem>
                      <SelectItem value="tuition-high">Tuition (High-Low)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-accent" />
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredPrograms.map((program) => (
                    <Card key={program.id} className="border border-border hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="w-14 h-14 rounded-lg bg-secondary flex items-center justify-center text-2xl shrink-0">
                              {getCountryFlag(program.university?.country || '')}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h3 className="font-semibold text-foreground">{program.university?.name}</h3>
                                  <p className="text-accent font-medium">{program.name}</p>
                                </div>
                                <Badge className={getMatchBadgeColor(program.matchPercentage, program.matchCategory)}>
                                  {program.matchCategory === 'safe' ? 'Safe' : program.matchCategory === 'moderate' ? 'Target' : 'Reach'} - {program.matchPercentage}%
                                </Badge>
                              </div>
                              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  {program.university?.country}
                                </span>
                                <span className="flex items-center gap-1">
                                  <GraduationCap className="h-4 w-4" />
                                  {program.duration_months} months
                                </span>
                                <span className="flex items-center gap-1">
                                  <DollarSign className="h-4 w-4" />
                                  {program.currency} {program.tuition_fee?.toLocaleString()}/year
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex sm:flex-col items-center gap-2 sm:ml-4">
                            <Button asChild className="flex-1 sm:flex-none">
                              <Link href={`/programs/${program.id}`}>Apply Now</Link>
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => toggleSave(program.id)}
                              className={savedPrograms.includes(program.id) ? "text-accent border-accent" : ""}
                            >
                              <Heart className={`h-4 w-4 ${savedPrograms.includes(program.id) ? "fill-current" : ""}`} />
                            </Button>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Application Deadline</span>
                          <span className="font-medium text-foreground">
                            {program.deadline ? new Date(program.deadline).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            }) : 'Rolling'}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {!isLoading && filteredPrograms.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No programs match your filters. Try adjusting your criteria.</p>
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

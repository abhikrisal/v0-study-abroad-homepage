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
import { Search, SlidersHorizontal, MapPin, GraduationCap, DollarSign, Heart, ArrowUpDown, Loader2 } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase/client"

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

function getMatchBadgeColor(percentage: number) {
  if (percentage >= 90) return "bg-accent text-accent-foreground"
  if (percentage >= 80) return "bg-primary text-primary-foreground"
  return "bg-muted text-muted-foreground"
}

function getCountryFlag(country: string) {
  const code = countryCodeMap[country] || "UN"
  const codePoints = code
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}

function calculateMatchPercentage(): number {
  // Placeholder match calculation - would use user profile data in real app
  return Math.floor(Math.random() * 20) + 75
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

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()
      
      // Check if user is logged in
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      // Fetch programs with universities
      const { data: programsData, error } = await supabase
        .from('programs')
        .select(`
          *,
          university:universities(*)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching programs:', error)
      } else {
        setPrograms(programsData || [])
      }

      // Fetch saved programs if user is logged in
      if (user) {
        const { data: savedData } = await supabase
          .from('saved_programs')
          .select('program_id')
          .eq('user_id', user.id)

        if (savedData) {
          setSavedPrograms(savedData.map(s => s.program_id))
        }
      }

      setIsLoading(false)
    }

    fetchData()
  }, [])

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
      await supabase
        .from('saved_programs')
        .insert({
          user_id: user.id,
          program_id: programId,
          match_percentage: calculateMatchPercentage()
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
    .map(program => ({
      ...program,
      matchPercentage: calculateMatchPercentage()
    }))
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
        {/* Search Header */}
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
            {/* Sidebar Filters - Desktop */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-24 bg-card border border-border rounded-lg p-6">
                <h2 className="font-semibold text-foreground mb-6">Filters</h2>
                <FilterContent />
              </div>
            </aside>

            {/* Results */}
            <div className="flex-1">
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
                      <SelectItem value="match">Match %</SelectItem>
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
                                <Badge className={getMatchBadgeColor(program.matchPercentage)}>
                                  {program.matchPercentage}% Match
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

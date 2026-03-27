"use client"

import { useState } from "react"
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
import { Search, SlidersHorizontal, MapPin, GraduationCap, DollarSign, Heart, ArrowUpDown } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const programs = [
  {
    id: 1,
    university: "University of Toronto",
    country: "Canada",
    countryCode: "CA",
    course: "MSc Computer Science",
    tuition: 32500,
    matchPercentage: 95,
    deadline: "Jan 15, 2027",
    duration: "2 years",
    level: "Postgraduate",
  },
  {
    id: 2,
    university: "Imperial College London",
    country: "United Kingdom",
    countryCode: "GB",
    course: "MSc Data Science",
    tuition: 38000,
    matchPercentage: 92,
    deadline: "Dec 1, 2026",
    duration: "1 year",
    level: "Postgraduate",
  },
  {
    id: 3,
    university: "University of Melbourne",
    country: "Australia",
    countryCode: "AU",
    course: "Master of Engineering",
    tuition: 45000,
    matchPercentage: 88,
    deadline: "Nov 30, 2026",
    duration: "2 years",
    level: "Postgraduate",
  },
  {
    id: 4,
    university: "TU Munich",
    country: "Germany",
    countryCode: "DE",
    course: "MSc Informatics",
    tuition: 500,
    matchPercentage: 85,
    deadline: "Jan 15, 2027",
    duration: "2 years",
    level: "Postgraduate",
  },
  {
    id: 5,
    university: "MIT",
    country: "United States",
    countryCode: "US",
    course: "PhD Computer Science",
    tuition: 58000,
    matchPercentage: 78,
    deadline: "Dec 15, 2026",
    duration: "5 years",
    level: "Doctoral",
  },
  {
    id: 6,
    university: "University of Amsterdam",
    country: "Netherlands",
    countryCode: "NL",
    course: "MSc Artificial Intelligence",
    tuition: 15000,
    matchPercentage: 91,
    deadline: "Feb 1, 2027",
    duration: "2 years",
    level: "Postgraduate",
  },
  {
    id: 7,
    university: "National University of Singapore",
    country: "Singapore",
    countryCode: "SG",
    course: "MSc Business Analytics",
    tuition: 42000,
    matchPercentage: 87,
    deadline: "Jan 31, 2027",
    duration: "1.5 years",
    level: "Postgraduate",
  },
  {
    id: 8,
    university: "ETH Zurich",
    country: "Switzerland",
    countryCode: "CH",
    course: "MSc Robotics",
    tuition: 1500,
    matchPercentage: 82,
    deadline: "Dec 15, 2026",
    duration: "2 years",
    level: "Postgraduate",
  },
]

const countries = ["All Countries", "Canada", "United Kingdom", "Australia", "Germany", "United States", "Netherlands", "Singapore", "Switzerland"]
const fieldsOfStudy = ["All Fields", "Computer Science", "Data Science", "Engineering", "Business", "Artificial Intelligence"]
const programLevels = ["All Levels", "Undergraduate", "Postgraduate", "Doctoral"]

function getMatchBadgeColor(percentage: number) {
  if (percentage >= 90) return "bg-accent text-accent-foreground"
  if (percentage >= 80) return "bg-primary text-primary-foreground"
  return "bg-muted text-muted-foreground"
}

function getCountryFlag(countryCode: string) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}

export default function ProgramsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCountry, setSelectedCountry] = useState("All Countries")
  const [selectedField, setSelectedField] = useState("All Fields")
  const [selectedLevel, setSelectedLevel] = useState("All Levels")
  const [budgetRange, setBudgetRange] = useState([0, 60000])
  const [minIelts, setMinIelts] = useState("")
  const [sortBy, setSortBy] = useState("match")
  const [savedPrograms, setSavedPrograms] = useState<number[]>([])

  const toggleSave = (id: number) => {
    setSavedPrograms(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    )
  }

  const filteredPrograms = programs
    .filter(program => {
      if (searchQuery && !program.university.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !program.course.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }
      if (selectedCountry !== "All Countries" && program.country !== selectedCountry) {
        return false
      }
      if (program.tuition < budgetRange[0] || program.tuition > budgetRange[1]) {
        return false
      }
      if (selectedLevel !== "All Levels" && program.level !== selectedLevel) {
        return false
      }
      return true
    })
    .sort((a, b) => {
      if (sortBy === "match") return b.matchPercentage - a.matchPercentage
      if (sortBy === "tuition-low") return a.tuition - b.tuition
      if (sortBy === "tuition-high") return b.tuition - a.tuition
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

              <div className="grid gap-4">
                {filteredPrograms.map((program) => (
                  <Card key={program.id} className="border border-border hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-14 h-14 rounded-lg bg-secondary flex items-center justify-center text-2xl shrink-0">
                            {getCountryFlag(program.countryCode)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h3 className="font-semibold text-foreground">{program.university}</h3>
                                <p className="text-accent font-medium">{program.course}</p>
                              </div>
                              <Badge className={getMatchBadgeColor(program.matchPercentage)}>
                                {program.matchPercentage}% Match
                              </Badge>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {program.country}
                              </span>
                              <span className="flex items-center gap-1">
                                <GraduationCap className="h-4 w-4" />
                                {program.duration}
                              </span>
                              <span className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4" />
                                ${program.tuition.toLocaleString()}/year
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
                        <span className="font-medium text-foreground">{program.deadline}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredPrograms.length === 0 && (
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

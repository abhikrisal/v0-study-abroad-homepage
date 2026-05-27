"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Search, SlidersHorizontal, MapPin, DollarSign, Loader2, Globe, Award, Building, ExternalLink, Calendar } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase/client"

interface University {
  id: string
  name: string
  country: string
  country_code: string
  continent: string
  city: string
  type: string
  ranking_qs_2024: number | null
  established: number | null
  website: string | null
  tuition_usd_per_year: number
  acceptance_rate_pct: number | null
  language_of_instruction: string | null
  program_levels: string | null
  notable_programs: string | null
  description: string | null
}

const countries = ["All Countries", "United States", "United Kingdom", "Canada", "Australia", "Germany", "France", "Netherlands", "Singapore", "Japan", "South Korea", "China", "India", "Switzerland", "Ireland", "New Zealand", "Sweden", "Denmark", "Finland", "Belgium", "Spain", "Italy", "Malaysia", "Hong Kong", "Brazil", "Mexico", "Argentina", "Chile", "Austria", "Saudi Arabia", "Israel", "Taiwan", "Russia", "South Africa"]
const continents = ["All Continents", "North America", "Europe", "Asia", "Oceania", "South America", "Africa"]
const universityTypes = ["All Types", "Public", "Private"]

function getCountryFlag(countryCode: string) {
  const code = countryCode || "UN"
  const codePoints = code
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}

function getRankingBadgeColor(ranking: number | null) {
  if (!ranking) return "bg-muted text-muted-foreground"
  if (ranking <= 20) return "bg-green-500 text-white"
  if (ranking <= 50) return "bg-accent text-accent-foreground"
  if (ranking <= 100) return "bg-blue-500 text-white"
  return "bg-muted text-muted-foreground"
}

export default function ProgramsPage() {
  const [universities, setUniversities] = useState<University[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCountry, setSelectedCountry] = useState("All Countries")
  const [selectedContinent, setSelectedContinent] = useState("All Continents")
  const [selectedType, setSelectedType] = useState("All Types")
  const [budgetRange, setBudgetRange] = useState([0, 70000])
  const [sortBy, setSortBy] = useState("ranking")

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()

      console.log('[v0] Fetching universities...')
      const { data: universitiesData, error } = await supabase
        .from('universities')
        .select('*')
        .order('ranking_qs_2024', { ascending: true, nullsFirst: false })

      console.log('[v0] Universities fetched:', universitiesData?.length || 0, 'error:', error?.message)

      if (error) {
        console.error('Error fetching universities:', error)
      } else {
        setUniversities(universitiesData || [])
      }

      setIsLoading(false)
    }

    fetchData()
  }, [])

  const filteredUniversities = universities
    .filter(uni => {
      if (searchQuery && 
          !uni.name?.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !uni.city?.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !uni.notable_programs?.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }
      if (selectedCountry !== "All Countries" && uni.country !== selectedCountry) {
        return false
      }
      if (selectedContinent !== "All Continents" && uni.continent !== selectedContinent) {
        return false
      }
      if (selectedType !== "All Types" && uni.type !== selectedType) {
        return false
      }
      if (uni.tuition_usd_per_year < budgetRange[0] || uni.tuition_usd_per_year > budgetRange[1]) {
        return false
      }
      return true
    })
    .sort((a, b) => {
      if (sortBy === "ranking") {
        const aRank = a.ranking_qs_2024 ?? 999
        const bRank = b.ranking_qs_2024 ?? 999
        return aRank - bRank
      }
      if (sortBy === "tuition-low") return (a.tuition_usd_per_year || 0) - (b.tuition_usd_per_year || 0)
      if (sortBy === "tuition-high") return (b.tuition_usd_per_year || 0) - (a.tuition_usd_per_year || 0)
      if (sortBy === "name") return a.name.localeCompare(b.name)
      return 0
    })

  const FilterContent = () => (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="text-sm font-medium">Continent</Label>
        <Select value={selectedContinent} onValueChange={setSelectedContinent}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {continents.map((continent) => (
              <SelectItem key={continent} value={continent}>{continent}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">Country</Label>
        <Select value={selectedCountry} onValueChange={setSelectedCountry}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {countries.map((country) => (
              <SelectItem key={country} value={country}>{country}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">University Type</Label>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {universityTypes.map((type) => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">Annual Tuition (USD)</Label>
        <Slider
          value={budgetRange}
          onValueChange={setBudgetRange}
          max={70000}
          step={1000}
          className="mt-2"
        />
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>${budgetRange[0].toLocaleString()}</span>
          <span>${budgetRange[1].toLocaleString()}</span>
        </div>
      </div>

      <Button 
        variant="outline" 
        className="w-full"
        onClick={() => {
          setSelectedCountry("All Countries")
          setSelectedContinent("All Continents")
          setSelectedType("All Types")
          setBudgetRange([0, 70000])
          setSearchQuery("")
        }}
      >
        Reset Filters
      </Button>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-foreground mb-2">Find Universities</h1>
            <p className="text-muted-foreground">
              Explore {universities.length} top universities from around the world
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-72 shrink-0">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-4">Filters</h3>
                  <FilterContent />
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Search and Sort */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search universities, cities, or programs..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex gap-2">
                  {/* Mobile Filter Button */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="lg:hidden">
                        <SlidersHorizontal className="h-4 w-4 mr-2" />
                        Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                      <SheetHeader>
                        <SheetTitle>Filters</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6">
                        <FilterContent />
                      </div>
                    </SheetContent>
                  </Sheet>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ranking">Best Ranking</SelectItem>
                      <SelectItem value="tuition-low">Tuition: Low to High</SelectItem>
                      <SelectItem value="tuition-high">Tuition: High to Low</SelectItem>
                      <SelectItem value="name">Name A-Z</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Results Count */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">
                  {filteredUniversities.length} universities found
                </p>
              </div>

              {/* Universities Grid */}
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-accent" />
                </div>
              ) : filteredUniversities.length === 0 ? (
                <Card>
                  <CardContent className="py-20 text-center">
                    <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No universities found</h3>
                    <p className="text-muted-foreground">Try adjusting your filters or search query</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {filteredUniversities.map((uni) => (
                    <Card key={uni.id} className="hover:border-accent/50 transition-colors">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-start gap-4">
                          {/* University Info */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold text-lg text-foreground">{uni.name}</h3>
                                  {uni.ranking_qs_2024 && (
                                    <Badge className={getRankingBadgeColor(uni.ranking_qs_2024)}>
                                      #{uni.ranking_qs_2024}
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <span className="text-base">{getCountryFlag(uni.country_code)}</span>
                                    {uni.city}, {uni.country}
                                  </span>
                                  {uni.type && (
                                    <span className="flex items-center gap-1">
                                      <Building className="h-3 w-3" />
                                      {uni.type}
                                    </span>
                                  )}
                                  {uni.established && (
                                    <span className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      Est. {uni.established}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {uni.description && (
                              <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                                {uni.description}
                              </p>
                            )}

                            {uni.notable_programs && (
                              <div className="mt-3">
                                <p className="text-xs text-muted-foreground mb-1">Notable Programs:</p>
                                <div className="flex flex-wrap gap-1">
                                  {uni.notable_programs.split(', ').slice(0, 5).map((program) => (
                                    <Badge key={program} variant="secondary" className="text-xs">
                                      {program}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Stats and Actions */}
                          <div className="flex flex-row md:flex-col items-center md:items-end gap-4 md:gap-2 md:text-right">
                            <div>
                              <p className="text-2xl font-semibold text-foreground">
                                ${uni.tuition_usd_per_year?.toLocaleString() || 'N/A'}
                              </p>
                              <p className="text-xs text-muted-foreground">per year</p>
                            </div>
                            
                            {uni.acceptance_rate_pct && (
                              <div>
                                <p className="text-sm font-medium text-foreground">
                                  {uni.acceptance_rate_pct}%
                                </p>
                                <p className="text-xs text-muted-foreground">acceptance</p>
                              </div>
                            )}

                            {uni.language_of_instruction && (
                              <Badge variant="outline" className="text-xs">
                                {uni.language_of_instruction.split(', ')[0]}
                              </Badge>
                            )}

                            {uni.website && (
                              <Button variant="outline" size="sm" asChild>
                                <a href={uni.website} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-3 w-3 mr-1" />
                                  Website
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
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

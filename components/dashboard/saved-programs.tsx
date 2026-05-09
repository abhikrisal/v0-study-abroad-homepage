"use client"

import { useEffect, useState } from "react"
import { MapPin, BookOpen, Heart, ExternalLink, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { removeSavedProgram } from "@/lib/actions/programs"

interface SavedProgram {
  id: string
  match_percentage: number
  programs: {
    id: string
    name: string
    level: string
    tuition_fee: number
    currency: string
    deadline: string
    universities: {
      name: string
      country: string
    }
  }
}

function getMatchColor(percentage: number) {
  if (percentage >= 90) return "bg-accent text-accent-foreground"
  if (percentage >= 80) return "bg-chart-4/20 text-chart-4"
  return "bg-chart-1/20 text-chart-1"
}

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function SavedPrograms() {
  const [savedPrograms, setSavedPrograms] = useState<SavedProgram[]>([])
  const [loading, setLoading] = useState(true)
  const [removingId, setRemovingId] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSavedPrograms() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setLoading(false)
        return
      }

      const { data } = await supabase
        .from("saved_programs")
        .select(`
          id,
          match_percentage,
          programs (
            id,
            name,
            level,
            tuition_fee,
            currency,
            deadline,
            universities (
              name,
              country
            )
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(4)

      setSavedPrograms((data as SavedProgram[]) || [])
      setLoading(false)
    }

    fetchSavedPrograms()
  }, [])

  const handleRemove = async (savedProgramId: string) => {
    setRemovingId(savedProgramId)
    const result = await removeSavedProgram(savedProgramId)
    if (result.success) {
      setSavedPrograms(prev => prev.filter(sp => sp.id !== savedProgramId))
    }
    setRemovingId(null)
  }

  if (loading) {
    return (
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-lg">Saved Programs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (savedPrograms.length === 0) {
    return (
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-lg">Saved Programs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No saved programs yet</p>
            <p className="text-sm mt-1">Browse programs and save your favorites</p>
            <Button asChild className="mt-4">
              <a href="/programs">Browse Programs</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-lg">Saved Programs</CardTitle>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" asChild>
          <a href="/programs">View All</a>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          {savedPrograms.map((saved) => (
            <div
              key={saved.id}
              className="group relative rounded-lg border border-border bg-card p-4 transition-all hover:border-accent/50 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground truncate">
                    {saved.programs.universities.name}
                  </h3>
                  <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{saved.programs.universities.country}</span>
                  </div>
                </div>
                <Badge className={getMatchColor(saved.match_percentage || 80)}>
                  {saved.match_percentage || 80}% Match
                </Badge>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-sm text-foreground">
                <BookOpen className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <span className="truncate">{saved.programs.name}</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <span>Deadline: {saved.programs.deadline ? new Date(saved.programs.deadline).toLocaleDateString() : "TBA"}</span>
                <span>{formatCurrency(saved.programs.tuition_fee, saved.programs.currency)}/year</span>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Button size="sm" className="flex-1">
                  Apply Now
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="px-2.5"
                  onClick={() => handleRemove(saved.id)}
                  disabled={removingId === saved.id}
                >
                  {removingId === saved.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Heart className="h-4 w-4 fill-current text-red-500" />
                  )}
                  <span className="sr-only">Remove from saved</span>
                </Button>
                <Button size="sm" variant="outline" className="px-2.5" asChild>
                  <a href={`/programs?id=${saved.programs.id}`}>
                    <ExternalLink className="h-4 w-4" />
                    <span className="sr-only">View details</span>
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

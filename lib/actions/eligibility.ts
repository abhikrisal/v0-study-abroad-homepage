'use server'

import { createClient } from '@/lib/supabase/server'
import { 
  calculateFitScore, 
  matchStudentToUniversities, 
  type StudentProfile,
  type UniversityRequirements,
} from '@/lib/services/eligibility-matcher'

export async function getStudentProfile() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select(
      `*,
      academic_background(*),
      preferences(*)`
    )
    .eq('id', user.id)
    .single()

  return profile
}

export async function getUniversitiesForMatching() {
  const supabase = await createClient()

  const { data: universities } = await supabase
    .from('universities')
    .select('*')

  return universities || []
}

export async function checkEligibility(studentData: {
  gpa: number
  englishScore: number
  englishTestType: 'IELTS' | 'TOEFL'
  budget: number
  preferredCountries: string[]
  preferredFields: string[]
  degreeLevel: 'Bachelors' | 'Masters' | 'PhD'
}) {
  try {
    const supabase = await createClient()

    console.log('[v0] Starting eligibility check...')

    // Get all universities (new schema has no is_active column)
    const { data: universities, error: uniError } = await supabase
      .from('universities')
      .select('id, name, country, city, ranking_qs_2024, tuition_usd_per_year, continent')

    console.log('[v0] Universities fetched:', universities?.length || 0, 'error:', uniError?.message)

    if (uniError) {
      console.log('[v0] University fetch error:', uniError.message)
    }

    // Get programs for matching (programs may not exist yet)
    const { data: programs, error: progError } = await supabase
      .from('programs')
      .select('id, university_id, name, field_of_study, level, tuition_fee, deadline')

    console.log('[v0] Programs fetched:', programs?.length || 0, 'error:', progError?.message)

    if (progError) {
      console.log('[v0] Programs fetch error:', progError.message)
    }

    // Use fetched data or fallback sample data if nothing returned
    const uniList = (universities && universities.length > 0) ? universities : FALLBACK_UNIVERSITIES
    console.log('[v0] Using uniList with', uniList.length, 'universities')

    // Build university requirements from DB data
    const universityRequirements: UniversityRequirements[] = uniList.map(uni => {
      const uniPrograms = programs?.filter(p => p.university_id === uni.id) || []
      // Use tuition from new schema, fallback to programs average or default
      const avgTuition = (uni as any).tuition_usd_per_year || (uniPrograms.length > 0
        ? uniPrograms.reduce((sum, p) => sum + (p.tuition_fee || 30000), 0) / uniPrograms.length
        : getDefaultTuition(uni.country))
      const fields = uniPrograms.length > 0
        ? [...new Set(uniPrograms.map(p => p.field_of_study).filter(Boolean))]
        : studentData.preferredFields
      
      // Use ranking_qs_2024 from new schema
      const ranking = (uni as any).ranking_qs_2024 || (uni as any).ranking || 100

      return {
        id: uni.id,
        name: uni.name,
        country: uni.country,
        city: uni.city || '',
        minGPA: getMinGpaByRanking(ranking),
        minEnglishScore: getMinEnglishByCountry(uni.country),
        englishTestType: 'IELTS' as const,
        tuitionFee: avgTuition,
        selectivityRank: ranking,
        fields,
        degreeLevel: studentData.degreeLevel,
      }
    })

    // Run matching algorithm
    const matches = matchStudentToUniversities(studentData as StudentProfile, universityRequirements)

    const safeSchools = matches.filter(m => m.category === 'safe').slice(0, 6)
    const moderateSchools = matches.filter(m => m.category === 'moderate').slice(0, 6)
    const reachSchools = matches.filter(m => m.category === 'reach').slice(0, 6)

    return {
      safeSchools,
      moderateSchools,
      reachSchools,
      totalMatches: matches.length,
      summary: {
        safeCount: safeSchools.length,
        moderateCount: moderateSchools.length,
        reachCount: reachSchools.length,
      }
    }
  } catch (err) {
    console.log('[v0] checkEligibility error:', err)
    throw new Error('Unable to check eligibility. Please try again.')
  }
}

// Helper: estimate min GPA based on university ranking
function getMinGpaByRanking(ranking: number | null): number {
  if (!ranking) return 3.0
  if (ranking <= 20) return 3.8
  if (ranking <= 50) return 3.5
  if (ranking <= 100) return 3.2
  if (ranking <= 200) return 3.0
  return 2.7
}

// Helper: typical English score minimums by country
function getMinEnglishByCountry(country: string): number {
  const minimums: Record<string, number> = {
    'United Kingdom': 6.5,
    'Australia': 6.5,
    'Canada': 6.5,
    'United States': 6.0,
    'Germany': 6.0,
    'Netherlands': 6.0,
    'France': 6.0,
    'Switzerland': 6.5,
    'Ireland': 6.0,
    'New Zealand': 6.0,
  }
  return minimums[country] || 6.0
}

// Helper: typical tuition by country
function getDefaultTuition(country: string): number {
  const tuitions: Record<string, number> = {
    'United Kingdom': 25000,
    'Australia': 30000,
    'Canada': 22000,
    'United States': 40000,
    'Germany': 5000,
    'Netherlands': 15000,
    'France': 10000,
    'Switzerland': 20000,
    'Ireland': 18000,
    'New Zealand': 22000,
  }
  return tuitions[country] || 20000
}

// Fallback universities if DB is empty
const FALLBACK_UNIVERSITIES = [
  { id: '1', name: 'University of Toronto', country: 'Canada', city: 'Toronto', ranking: 25 },
  { id: '2', name: 'University of Melbourne', country: 'Australia', city: 'Melbourne', ranking: 33 },
  { id: '3', name: 'TU Munich', country: 'Germany', city: 'Munich', ranking: 50 },
  { id: '4', name: 'University of Edinburgh', country: 'United Kingdom', city: 'Edinburgh', ranking: 22 },
  { id: '5', name: 'ETH Zurich', country: 'Switzerland', city: 'Zurich', ranking: 9 },
  { id: '6', name: 'McGill University', country: 'Canada', city: 'Montreal', ranking: 46 },
  { id: '7', name: 'University of Sydney', country: 'Australia', city: 'Sydney', ranking: 42 },
  { id: '8', name: 'University College London', country: 'United Kingdom', city: 'London', ranking: 10 },
  { id: '9', name: 'Delft University of Technology', country: 'Netherlands', city: 'Delft', ranking: 60 },
  { id: '10', name: 'University of Auckland', country: 'New Zealand', city: 'Auckland', ranking: 85 },
  { id: '11', name: 'University of Waterloo', country: 'Canada', city: 'Waterloo', ranking: 150 },
  { id: '12', name: 'Monash University', country: 'Australia', city: 'Melbourne', ranking: 57 },
]

export async function saveProgramMatch(programId: string, matchPercentage: number, notes?: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const { data, error } = await supabase
    .from('saved_programs')
    .insert({
      user_id: user.id,
      program_id: programId,
      match_percentage: matchPercentage,
      notes: notes,
    })
    .select()

  if (error) {
    throw error
  }

  return data
}

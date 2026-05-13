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
    .select(
      `*,
      programs(*)`
    )
    .eq('is_active', true)

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
  const supabase = await createClient()

  // Get all active universities with programs
  const { data: universities } = await supabase
    .from('universities')
    .select(
      `id,
      name,
      country,
      city,
      is_active`
    )
    .eq('is_active', true)

  if (!universities) {
    throw new Error('Unable to fetch universities')
  }

  // Get programs for matching
  const { data: programs } = await supabase
    .from('programs')
    .select(
      `id,
      university_id,
      name,
      field_of_study,
      level,
      tuition_fee,
      min_gpa,
      min_english_score,
      english_test_type,
      deadline`
    )
    .eq('is_active', true)

  // Transform data for matching algorithm
  const universityRequirements: UniversityRequirements[] = universities.map(uni => {
    const uniPrograms = programs?.filter(p => p.university_id === uni.id) || []
    const avgMinGpa = uniPrograms.length > 0 
      ? uniPrograms.reduce((sum, p) => sum + (p.min_gpa || 0), 0) / uniPrograms.length
      : 3.0
    const avgMinEnglish = uniPrograms.length > 0
      ? uniPrograms.reduce((sum, p) => sum + (p.min_english_score || 6.5), 0) / uniPrograms.length
      : 6.5
    const avgTuition = uniPrograms.length > 0
      ? uniPrograms.reduce((sum, p) => sum + (p.tuition_fee || 0), 0) / uniPrograms.length
      : 30000
    const fields = [...new Set(uniPrograms.map(p => p.field_of_study))]

    return {
      id: uni.id,
      name: uni.name,
      country: uni.country,
      city: uni.city || '',
      minGPA: avgMinGpa,
      minEnglishScore: avgMinEnglish,
      englishTestType: 'IELTS',
      tuitionFee: avgTuition,
      selectivityRank: Math.floor(Math.random() * 150) + 1, // This should be stored in DB
      fields: fields,
      degreeLevel: studentData.degreeLevel,
    }
  })

  // Run matching algorithm
  const matches = matchStudentToUniversities(studentData as StudentProfile, universityRequirements)

  // Categorize results
  const safeSchools = matches.filter(m => m.category === 'safe').slice(0, 5)
  const moderateSchools = matches.filter(m => m.category === 'moderate').slice(0, 5)
  const reachSchools = matches.filter(m => m.category === 'reach').slice(0, 5)

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
}

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

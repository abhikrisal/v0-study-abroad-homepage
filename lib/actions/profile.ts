'use server'

import { createClient } from '@/lib/supabase/server'

export async function updateProfile(data: {
  first_name?: string
  last_name?: string
  phone?: string
  date_of_birth?: string
  nationality?: string
  current_country?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'You must be logged in' }
  }

  const { error } = await supabase
    .from('profiles')
    .update(data)
    .eq('id', user.id)

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function updateAcademicBackground(data: {
  highest_education?: string
  field_of_study?: string
  institution_name?: string
  graduation_year?: number
  gpa?: number
  gpa_scale?: number
  english_test_type?: string
  english_test_score?: number
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'You must be logged in' }
  }

  // Check if academic background exists
  const { data: existing } = await supabase
    .from('academic_background')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (existing) {
    const { error } = await supabase
      .from('academic_background')
      .update(data)
      .eq('user_id', user.id)

    if (error) {
      return { error: error.message }
    }
  } else {
    const { error } = await supabase
      .from('academic_background')
      .insert({
        user_id: user.id,
        ...data
      })

    if (error) {
      return { error: error.message }
    }
  }

  return { success: true }
}

export async function updatePreferences(data: {
  preferred_countries?: string[]
  preferred_fields?: string[]
  budget_min?: number
  budget_max?: number
  intake_year?: number
  intake_season?: string
  program_level?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'You must be logged in' }
  }

  // Check if preferences exist
  const { data: existing } = await supabase
    .from('preferences')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (existing) {
    const { error } = await supabase
      .from('preferences')
      .update(data)
      .eq('user_id', user.id)

    if (error) {
      return { error: error.message }
    }
  } else {
    const { error } = await supabase
      .from('preferences')
      .insert({
        user_id: user.id,
        ...data
      })

    if (error) {
      return { error: error.message }
    }
  }

  return { success: true }
}

export async function getAcademicBackground() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const { data } = await supabase
    .from('academic_background')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return data
}

export async function getPreferences() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const { data } = await supabase
    .from('preferences')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return data
}

export async function completeOnboarding(
  personalData: {
    first_name: string
    last_name: string
    phone?: string
    date_of_birth?: string
    nationality?: string
    current_country?: string
  },
  academicData: {
    highest_education: string
    field_of_study: string
    institution_name: string
    graduation_year: number
    gpa: number
    english_test_type: string
    english_test_score: number
  },
  preferencesData: {
    preferred_countries: string[]
    preferred_fields: string[]
    budget_min: number
    budget_max: number
    program_level: string
  }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'You must be logged in' }
  }

  // Update profile
  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      ...personalData,
      profile_completed: 100
    })
    .eq('id', user.id)

  if (profileError) {
    return { error: profileError.message }
  }

  // Insert academic background
  const { error: academicError } = await supabase
    .from('academic_background')
    .upsert({
      user_id: user.id,
      ...academicData
    })

  if (academicError) {
    return { error: academicError.message }
  }

  // Insert preferences
  const { error: preferencesError } = await supabase
    .from('preferences')
    .upsert({
      user_id: user.id,
      ...preferencesData
    })

  if (preferencesError) {
    return { error: preferencesError.message }
  }

  return { success: true }
}

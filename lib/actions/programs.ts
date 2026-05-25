'use server'

import { createClient } from '@/lib/supabase/server'

export async function getPrograms(filters?: {
  country?: string
  field?: string
  level?: string
  budgetMax?: number
  search?: string
}) {
  const supabase = await createClient()
  
  let query = supabase
    .from('programs')
    .select(`
      *,
      university:universities(*)
    `)
    .eq('is_active', true)

  if (filters?.country) {
    query = query.eq('university.country', filters.country)
  }
  if (filters?.field) {
    query = query.eq('field_of_study', filters.field)
  }
  if (filters?.level) {
    query = query.eq('level', filters.level)
  }
  if (filters?.budgetMax) {
    query = query.lte('tuition_fee', filters.budgetMax)
  }
  if (filters?.search) {
    query = query.or(`name.ilike.%${filters.search}%,university.name.ilike.%${filters.search}%`)
  }

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching programs:', error)
    return []
  }

  return data || []
}

export async function getProgramById(id: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('programs')
    .select(`
      *,
      university:universities(*)
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching program:', error)
    return null
  }

  return data
}

export async function saveProgram(programId: string, matchPercentage?: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'You must be logged in to save programs' }
  }

  const { error } = await supabase
    .from('saved_programs')
    .upsert({
      user_id: user.id,
      program_id: programId,
      match_percentage: matchPercentage || null
    })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function unsaveProgram(programId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'You must be logged in' }
  }

  const { error } = await supabase
    .from('saved_programs')
    .delete()
    .eq('user_id', user.id)
    .eq('program_id', programId)

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

// Alias for removeSavedProgram
export async function removeSavedProgram(savedProgramId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'You must be logged in' }
  }

  const { error } = await supabase
    .from('saved_programs')
    .delete()
    .eq('id', savedProgramId)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function getSavedPrograms() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return []

  const { data, error } = await supabase
    .from('saved_programs')
    .select(`
      *,
      program:programs(
        *,
        university:universities(*)
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching saved programs:', error)
    return []
  }

  return data || []
}

export async function getUniversities() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('universities')
    .select('*')
    .eq('is_active', true)
    .order('ranking', { ascending: true })

  if (error) {
    console.error('Error fetching universities:', error)
    return []
  }

  return data || []
}

export async function getSavedProgramsForDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return []

  const { data, error } = await supabase
    .from('saved_programs')
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
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(4)

  if (error) {
    console.error('Error fetching saved programs:', error)
    return []
  }

  return data || []
}

export async function getApplications() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return []

  const { data, error } = await supabase
    .from('applications')
    .select(`
      id,
      status,
      submitted_at,
      updated_at,
      programs (
        name,
        universities (
          name
        )
      )
    `)
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('Error fetching applications:', error)
    return []
  }

  return data || []
}

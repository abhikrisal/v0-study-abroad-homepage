'use server'

import { createClient } from '@/lib/supabase/server'

export async function createApplication(programId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'You must be logged in to apply' }
  }

  // Check if application already exists
  const { data: existing } = await supabase
    .from('applications')
    .select('id')
    .eq('user_id', user.id)
    .eq('program_id', programId)
    .single()

  if (existing) {
    return { error: 'You have already applied to this program' }
  }

  const { data, error } = await supabase
    .from('applications')
    .insert({
      user_id: user.id,
      program_id: programId,
      status: 'draft'
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  return { success: true, data }
}

export async function submitApplication(applicationId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'You must be logged in' }
  }

  const { error } = await supabase
    .from('applications')
    .update({
      status: 'submitted',
      submitted_at: new Date().toISOString()
    })
    .eq('id', applicationId)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function getApplications() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return []

  const { data, error } = await supabase
    .from('applications')
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
    console.error('Error fetching applications:', error)
    return []
  }

  return data || []
}

export async function withdrawApplication(applicationId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'You must be logged in' }
  }

  const { error } = await supabase
    .from('applications')
    .update({ status: 'withdrawn' })
    .eq('id', applicationId)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

// Admin functions
export async function getAllApplications() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('applications')
    .select(`
      *,
      program:programs(
        *,
        university:universities(*)
      ),
      user:profiles(*)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching all applications:', error)
    return []
  }

  return data || []
}

export async function updateApplicationStatus(applicationId: string, status: string, notes?: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('applications')
    .update({
      status,
      reviewer_notes: notes,
      reviewed_at: new Date().toISOString()
    })
    .eq('id', applicationId)

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

'use server'

import { createClient } from '@/lib/supabase/server'

export async function uploadDocument(
  documentType: string,
  fileName: string,
  fileUrl: string,
  fileSize: number,
  applicationId?: string
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'You must be logged in to upload documents' }
  }

  const { data, error } = await supabase
    .from('documents')
    .insert({
      user_id: user.id,
      application_id: applicationId || null,
      document_type: documentType,
      file_name: fileName,
      file_url: fileUrl,
      file_size: fileSize,
      status: 'pending'
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  return { success: true, data }
}

export async function getDocuments() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return []

  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('user_id', user.id)
    .order('uploaded_at', { ascending: false })

  if (error) {
    console.error('Error fetching documents:', error)
    return []
  }

  return data || []
}

export async function deleteDocument(documentId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'You must be logged in' }
  }

  const { error } = await supabase
    .from('documents')
    .delete()
    .eq('id', documentId)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

// Admin functions
export async function getAllDocuments() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('documents')
    .select(`
      *,
      user:profiles(*)
    `)
    .order('uploaded_at', { ascending: false })

  if (error) {
    console.error('Error fetching all documents:', error)
    return []
  }

  return data || []
}

export async function verifyDocument(documentId: string, status: 'verified' | 'rejected', rejectionReason?: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'You must be logged in' }
  }

  const { error } = await supabase
    .from('documents')
    .update({
      status,
      rejection_reason: status === 'rejected' ? rejectionReason : null,
      verified_at: new Date().toISOString(),
      verified_by: user.id
    })
    .eq('id', documentId)

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

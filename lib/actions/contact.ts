'use server'

import { createClient } from '@/lib/supabase/server'

export async function submitContactForm(data: {
  name: string
  email: string
  subject?: string
  message: string
}) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('contact_messages')
    .insert(data)

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function getContactMessages() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching contact messages:', error)
    return []
  }

  return data || []
}

export async function markMessageAsRead(messageId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('contact_messages')
    .update({ is_read: true })
    .eq('id', messageId)

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

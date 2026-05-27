'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signUp(data: {
  email: string
  password: string
  firstName: string
  lastName: string
}) {
  const supabase = await createClient()

  const redirectUrl = process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? 
    `${process.env.NEXT_PUBLIC_SITE_URL || 'https://v0-study-abroad-homepage.vercel.app'}/auth/callback`

  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      emailRedirectTo: redirectUrl,
      data: {
        first_name: data.firstName,
        last_name: data.lastName,
        role: 'student'
      }
    }
  })

  if (error) {
    return { error: error.message }
  }

  // Auto-sign in immediately after signup (email auto-confirmed via DB trigger)
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  })

  if (signInError) {
    return { success: true, message: 'Account created! Please log in.', autoLoggedIn: false }
  }

  return { success: true, message: 'Account created successfully!', autoLoggedIn: true }
}

export async function signIn(data: { email: string; password: string }) {
  const supabase = await createClient()

  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password
  })

  if (error) {
    if (error.message.includes('Invalid login credentials')) {
      return { error: 'Invalid email or password. Please try again.' }
    }
    if (error.message.includes('Email not confirmed')) {
      return { error: 'Please confirm your email before logging in. Check your inbox.' }
    }
    return { error: error.message }
  }

  if (authData.user && authData.session) {
    return { success: true }
  }

  return { error: 'Login failed. Please try again.' }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}

export async function getUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getSession() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export async function getProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return profile
}

export async function signUpWithGoogle() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? 
        `${process.env.NEXT_PUBLIC_SITE_URL || 'https://v0-study-abroad-homepage.vercel.app'}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      }
    }
  })

  if (error) {
    return { error: error.message }
  }

  return { data }
}

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type')
  const next = searchParams.get('next') ?? '/dashboard'

  const supabase = await createClient()

  // Handle PKCE code exchange (OAuth and email signup with PKCE)
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
    console.log('[v0] Code exchange error:', error.message)
  }

  // Handle email confirmation with token_hash (email link flow)
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as 'email' | 'signup' | 'recovery' | 'invite' | 'magiclink',
    })
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
    console.log('[v0] Token verification error:', error.message)
  }

  // If we have neither code nor token_hash, or if there was an error
  return NextResponse.redirect(`${origin}/auth/error`)
}

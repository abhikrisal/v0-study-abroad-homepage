import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { SavedPrograms } from "@/components/dashboard/saved-programs"
import { ApplicationTracker } from "@/components/dashboard/application-tracker"
import { DocumentUpload } from "@/components/dashboard/document-upload"
import { ProfileProgress } from "@/components/dashboard/profile-progress"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch profile data
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Fetch saved programs with program and university details
  const { data: savedPrograms } = await supabase
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

  // Fetch applications with program and university details
  const { data: applications } = await supabase
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

  // Fetch documents
  const { data: documents } = await supabase
    .from('documents')
    .select('*')
    .eq('user_id', user.id)
    .order('uploaded_at', { ascending: false })

  // Calculate stats
  const stats = {
    savedPrograms: savedPrograms?.length || 0,
    applications: applications?.length || 0,
    accepted: applications?.filter(a => a.status === 'accepted').length || 0,
    deadlines: applications?.filter(a => {
      const deadline = a.program?.deadline
      if (!deadline) return false
      const deadlineDate = new Date(deadline)
      const now = new Date()
      const diffDays = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      return diffDays > 0 && diffDays <= 30
    }).length || 0
  }

  const firstName = profile?.first_name || user.email?.split('@')[0] || 'there'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Welcome back, {firstName}</h1>
        <p className="mt-1 text-muted-foreground">
          {"Here's what's happening with your applications"}
        </p>
      </div>

      <StatsCards stats={stats} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <SavedPrograms programs={savedPrograms || []} />
          <ApplicationTracker applications={applications || []} />
        </div>
        <div className="space-y-6">
          <ProfileProgress profile={profile} />
          <DocumentUpload documents={documents || []} userId={user.id} />
        </div>
      </div>
    </div>
  )
}

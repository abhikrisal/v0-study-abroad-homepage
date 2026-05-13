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

  // Fetch counts for stats
  const { count: savedCount } = await supabase
    .from('saved_programs')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  const { data: applications } = await supabase
    .from('applications')
    .select('status, program_id, programs(deadline)')
    .eq('user_id', user.id)

  const { count: docsCount } = await supabase
    .from('documents')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  // Calculate stats
  const stats = {
    savedPrograms: savedCount || 0,
    applications: applications?.length || 0,
    accepted: applications?.filter(a => a.status === 'accepted').length || 0,
    deadlines: applications?.filter(a => {
      const program = a.programs as { deadline?: string } | null
      const deadline = program?.deadline
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
          <SavedPrograms />
          <ApplicationTracker />
        </div>
        <div className="space-y-6">
          <ProfileProgress profile={profile} />
          <DocumentUpload />
        </div>
      </div>
    </div>
  )
}

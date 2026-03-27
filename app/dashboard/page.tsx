import { StatsCards } from "@/components/dashboard/stats-cards"
import { SavedPrograms } from "@/components/dashboard/saved-programs"
import { ApplicationTracker } from "@/components/dashboard/application-tracker"
import { DocumentUpload } from "@/components/dashboard/document-upload"
import { ProfileProgress } from "@/components/dashboard/profile-progress"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Welcome back, Jane</h1>
        <p className="mt-1 text-muted-foreground">
          {"Here's what's happening with your applications"}
        </p>
      </div>

      <StatsCards />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <SavedPrograms />
          <ApplicationTracker />
        </div>
        <div className="space-y-6">
          <ProfileProgress />
          <DocumentUpload />
        </div>
      </div>
    </div>
  )
}

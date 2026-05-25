"use client"

import { useEffect, useState } from "react"
import { Clock, CheckCircle, Send, AlertCircle, ChevronRight, Loader2, FileText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getApplications } from "@/lib/actions/programs"

type ApplicationStatus = "submitted" | "in_review" | "accepted" | "rejected" | "draft"

interface Application {
  id: string
  status: ApplicationStatus
  submitted_at: string | null
  updated_at: string
  programs: {
    name: string
    universities: {
      name: string
    }
  }
}

const statusConfig = {
  submitted: {
    label: "Submitted",
    icon: Send,
    className: "bg-chart-2/15 text-chart-2 border-chart-2/30",
  },
  in_review: {
    label: "In Review",
    icon: Clock,
    className: "bg-chart-4/15 text-chart-4 border-chart-4/30",
  },
  accepted: {
    label: "Accepted",
    icon: CheckCircle,
    className: "bg-accent/15 text-accent border-accent/30",
  },
  rejected: {
    label: "Rejected",
    icon: AlertCircle,
    className: "bg-destructive/15 text-destructive border-destructive/30",
  },
  draft: {
    label: "Draft",
    icon: Clock,
    className: "bg-muted text-muted-foreground border-border",
  },
}

export function ApplicationTracker() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchApplications() {
      const data = await getApplications()
      setApplications(data as Application[])
      setLoading(false)
    }

    fetchApplications()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-lg">Application Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (applications.length === 0) {
    return (
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-lg">Application Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No applications yet</p>
            <p className="text-sm mt-1">Start applying to programs you&apos;ve saved</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-lg">Application Tracker</CardTitle>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-border">
          {applications.map((application) => {
            const status = statusConfig[application.status] || statusConfig.draft
            const StatusIcon = status.icon
            return (
              <div
                key={application.id}
                className="group flex items-center gap-4 py-4 first:pt-0 last:pb-0"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary">
                  <StatusIcon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-foreground truncate">
                      {application.programs.universities.name}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{application.programs.name}</p>
                  <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                    <span>
                      Submitted: {application.submitted_at 
                        ? new Date(application.submitted_at).toLocaleDateString() 
                        : "-"}
                    </span>
                    <span className="hidden sm:inline">
                      Updated: {new Date(application.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className={status.className}>
                    {status.label}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">View application details</span>
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

import { Clock, CheckCircle, Send, AlertCircle, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

type ApplicationStatus = "submitted" | "in_review" | "accepted" | "rejected" | "pending"

const applications = [
  {
    id: 1,
    university: "University of Melbourne",
    program: "Master of Data Science",
    status: "accepted" as ApplicationStatus,
    submittedDate: "Jan 15, 2026",
    lastUpdate: "Mar 10, 2026",
  },
  {
    id: 2,
    university: "University of Toronto",
    program: "MSc Computer Science",
    status: "in_review" as ApplicationStatus,
    submittedDate: "Feb 1, 2026",
    lastUpdate: "Feb 28, 2026",
  },
  {
    id: 3,
    university: "Technical University of Munich",
    program: "MSc Informatics",
    status: "submitted" as ApplicationStatus,
    submittedDate: "Mar 5, 2026",
    lastUpdate: "Mar 5, 2026",
  },
  {
    id: 4,
    university: "ETH Zurich",
    program: "MSc Data Science",
    status: "pending" as ApplicationStatus,
    submittedDate: "-",
    lastUpdate: "-",
  },
]

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
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-muted text-muted-foreground border-border",
  },
}

export function ApplicationTracker() {
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
            const status = statusConfig[application.status]
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
                      {application.university}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{application.program}</p>
                  <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                    <span>Submitted: {application.submittedDate}</span>
                    <span className="hidden sm:inline">Updated: {application.lastUpdate}</span>
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

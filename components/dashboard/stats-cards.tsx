import { GraduationCap, FileText, CheckCircle, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface StatsCardsProps {
  stats: {
    savedPrograms: number
    applications: number
    accepted: number
    deadlines: number
  }
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Saved Programs",
      value: stats.savedPrograms.toString(),
      change: stats.savedPrograms > 0 ? "Programs saved" : "None yet",
      icon: GraduationCap,
      iconBg: "bg-chart-2/15",
      iconColor: "text-chart-2",
    },
    {
      title: "Applications",
      value: stats.applications.toString(),
      change: stats.applications > 0 ? `${stats.applications} submitted` : "None yet",
      icon: FileText,
      iconBg: "bg-chart-4/15",
      iconColor: "text-chart-4",
    },
    {
      title: "Accepted",
      value: stats.accepted.toString(),
      change: stats.accepted > 0 ? "Congrats!" : "Pending",
      icon: CheckCircle,
      iconBg: "bg-accent/15",
      iconColor: "text-accent",
    },
    {
      title: "Deadlines Soon",
      value: stats.deadlines.toString(),
      change: stats.deadlines > 0 ? "Within 30 days" : "None upcoming",
      icon: Clock,
      iconBg: "bg-chart-1/15",
      iconColor: "text-chart-1",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((stat) => (
        <Card key={stat.title}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="mt-1 text-3xl font-semibold text-foreground">{stat.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{stat.change}</p>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-full ${stat.iconBg}`}>
                <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

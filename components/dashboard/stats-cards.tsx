import { GraduationCap, FileText, CheckCircle, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const stats = [
  {
    title: "Saved Programs",
    value: "12",
    change: "+3 this week",
    icon: GraduationCap,
    iconBg: "bg-chart-2/15",
    iconColor: "text-chart-2",
  },
  {
    title: "Applications",
    value: "4",
    change: "2 pending",
    icon: FileText,
    iconBg: "bg-chart-4/15",
    iconColor: "text-chart-4",
  },
  {
    title: "Accepted",
    value: "1",
    change: "Congrats!",
    icon: CheckCircle,
    iconBg: "bg-accent/15",
    iconColor: "text-accent",
  },
  {
    title: "Deadlines Soon",
    value: "3",
    change: "Next: Mar 15",
    icon: Clock,
    iconBg: "bg-chart-1/15",
    iconColor: "text-chart-1",
  },
]

export function StatsCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
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

"use client"

import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { Badge } from "@/components/ui/badge"

const usersOverTime = [
  { month: "Jan", users: 1200 },
  { month: "Feb", users: 1450 },
  { month: "Mar", users: 1680 },
  { month: "Apr", users: 1920 },
  { month: "May", users: 2150 },
  { month: "Jun", users: 2400 },
  { month: "Jul", users: 2650 },
  { month: "Aug", users: 2847 },
]

const searchedCountries = [
  { country: "USA", searches: 4250 },
  { country: "UK", searches: 3180 },
  { country: "Canada", searches: 2890 },
  { country: "Australia", searches: 2340 },
  { country: "Germany", searches: 1950 },
  { country: "Netherlands", searches: 1420 },
]

const fieldsOfStudy = [
  { name: "Computer Science", value: 32, color: "var(--chart-1)" },
  { name: "Business", value: 24, color: "var(--chart-2)" },
  { name: "Engineering", value: 18, color: "var(--chart-3)" },
  { name: "Medicine", value: 14, color: "var(--chart-4)" },
  { name: "Arts", value: 12, color: "var(--chart-5)" },
]

const chatbotQueries = [
  { week: "Week 1", queries: 320 },
  { week: "Week 2", queries: 410 },
  { week: "Week 3", queries: 380 },
  { week: "Week 4", queries: 520 },
  { week: "Week 5", queries: 480 },
  { week: "Week 6", queries: 610 },
  { week: "Week 7", queries: 570 },
  { week: "Week 8", queries: 690 },
]

const topUniversities = [
  { name: "MIT", matches: 856, rate: "94%" },
  { name: "Stanford University", matches: 742, rate: "92%" },
  { name: "University of Oxford", matches: 698, rate: "91%" },
  { name: "University of Cambridge", matches: 654, rate: "90%" },
  { name: "ETH Zurich", matches: 612, rate: "89%" },
]

const chartConfig = {
  users: {
    label: "Users",
    color: "var(--accent)",
  },
  searches: {
    label: "Searches",
    color: "var(--primary)",
  },
  queries: {
    label: "Queries",
    color: "var(--accent)",
  },
}

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Analytics</h1>
        <p className="text-muted-foreground">
          Platform insights and performance metrics.
        </p>
      </div>

      {/* Users Over Time */}
      <Card>
        <CardHeader>
          <CardTitle>Total Users Over Time</CardTitle>
          <CardDescription>Monthly user growth this year</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={usersOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="var(--accent)"
                  strokeWidth={2}
                  dot={{ fill: "var(--accent)", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Two Column Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Most Searched Countries */}
        <Card>
          <CardHeader>
            <CardTitle>Most Searched Countries</CardTitle>
            <CardDescription>Countries with highest search volume</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={searchedCountries} layout="vertical">
                  <XAxis type="number" axisLine={false} tickLine={false} />
                  <YAxis
                    dataKey="country"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    width={80}
                  />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="searches" fill="var(--primary)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Most Popular Fields */}
        <Card>
          <CardHeader>
            <CardTitle>Most Popular Fields of Study</CardTitle>
            <CardDescription>Distribution of student interests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4 md:flex-row">
              <div className="h-[220px] w-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={fieldsOfStudy}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {fieldsOfStudy.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-3 md:flex-col md:gap-2">
                {fieldsOfStudy.map((field) => (
                  <div key={field.name} className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: field.color }}
                    />
                    <span className="text-sm text-muted-foreground">
                      {field.name} ({field.value}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chatbot Queries */}
      <Card>
        <CardHeader>
          <CardTitle>AI Chatbot Query Volume</CardTitle>
          <CardDescription>Weekly chatbot interactions over the past 8 weeks</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chatbotQueries}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="week" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="queries"
                  stroke="var(--accent)"
                  strokeWidth={2}
                  dot={{ fill: "var(--accent)", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Top Performing Universities */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing University Matches</CardTitle>
          <CardDescription>Universities with highest match success rates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topUniversities.map((uni, index) => (
              <div
                key={uni.name}
                className="flex items-center justify-between rounded-lg border border-border p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-foreground">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{uni.name}</p>
                    <p className="text-sm text-muted-foreground">{uni.matches} matches</p>
                  </div>
                </div>
                <Badge className="bg-emerald-100 text-emerald-700">{uni.rate} success</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Users,
  FileText,
  Building2,
  FileCheck,
  Plus,
  Eye,
  ArrowUpRight,
} from "lucide-react"
import {
  Bar,
  BarChart,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

const stats = [
  {
    title: "Total Students",
    value: "2,847",
    change: "+12%",
    icon: Users,
  },
  {
    title: "Active Applications",
    value: "1,234",
    change: "+8%",
    icon: FileText,
  },
  {
    title: "Universities Listed",
    value: "156",
    change: "+3",
    icon: Building2,
  },
  {
    title: "Pending Reviews",
    value: "89",
    change: "-5",
    icon: FileCheck,
  },
]

const applicationsData = [
  { month: "Jan", applications: 186 },
  { month: "Feb", applications: 205 },
  { month: "Mar", applications: 237 },
  { month: "Apr", applications: 273 },
  { month: "May", applications: 209 },
  { month: "Jun", applications: 214 },
]

const countriesData = [
  { name: "USA", value: 35, color: "var(--chart-1)" },
  { name: "UK", value: 25, color: "var(--chart-2)" },
  { name: "Canada", value: 20, color: "var(--chart-3)" },
  { name: "Australia", value: 12, color: "var(--chart-4)" },
  { name: "Germany", value: 8, color: "var(--chart-5)" },
]

const recentActivity = [
  {
    id: 1,
    type: "application",
    message: "New application from Sarah Chen for MIT",
    time: "2 minutes ago",
    initials: "SC",
  },
  {
    id: 2,
    type: "document",
    message: "Document uploaded by James Wilson",
    time: "15 minutes ago",
    initials: "JW",
  },
  {
    id: 3,
    type: "university",
    message: "University of Toronto updated program list",
    time: "1 hour ago",
    initials: "UT",
  },
  {
    id: 4,
    type: "application",
    message: "Application accepted: Maria Garcia to Oxford",
    time: "2 hours ago",
    initials: "MG",
  },
  {
    id: 5,
    type: "student",
    message: "New student registration: Ahmed Hassan",
    time: "3 hours ago",
    initials: "AH",
  },
]

const chartConfig = {
  applications: {
    label: "Applications",
    color: "var(--accent)",
  },
}

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s what&apos;s happening with Edulynx.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/admin/universities/new">
              <Plus className="mr-2 h-4 w-4" />
              Add University
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/documents">
              <FileCheck className="mr-2 h-4 w-4" />
              Review Documents
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/applications">
              <Eye className="mr-2 h-4 w-4" />
              View Applications
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <Badge variant="secondary" className="text-xs font-medium">
                  {stat.change}
                </Badge>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Applications Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Applications Per Month</CardTitle>
            <CardDescription>Monthly application submissions this year</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={applicationsData}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="applications"
                    fill="var(--accent)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Countries Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Top Destination Countries</CardTitle>
            <CardDescription>Distribution of applications by country</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4 md:flex-row">
              <div className="h-[200px] w-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={countriesData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {countriesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-3 md:flex-col md:gap-2">
                {countriesData.map((country) => (
                  <div key={country.name} className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: country.color }}
                    />
                    <span className="text-sm text-muted-foreground">
                      {country.name} ({country.value}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions across the platform</CardDescription>
          </div>
          <Button variant="ghost" size="sm" className="text-accent">
            View All
            <ArrowUpRight className="ml-1 h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 rounded-lg p-3 transition-colors hover:bg-secondary"
              >
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {activity.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <p className="text-sm text-foreground">{activity.message}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

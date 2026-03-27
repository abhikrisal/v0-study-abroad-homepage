"use client"

import { useState } from "react"
import {
  Search,
  MoreHorizontal,
  Eye,
  Ban,
  Filter,
  ChevronDown,
  Mail,
  Calendar,
  FileText,
  X,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

const students = [
  {
    id: 1,
    name: "Sarah Chen",
    email: "sarah.chen@email.com",
    nationality: "China",
    profileStatus: "complete",
    applications: 4,
    joinedDate: "2024-01-15",
    avatar: "SC",
  },
  {
    id: 2,
    name: "James Wilson",
    email: "james.w@email.com",
    nationality: "USA",
    profileStatus: "incomplete",
    applications: 2,
    joinedDate: "2024-02-08",
    avatar: "JW",
  },
  {
    id: 3,
    name: "Maria Garcia",
    email: "m.garcia@email.com",
    nationality: "Spain",
    profileStatus: "complete",
    applications: 6,
    joinedDate: "2023-11-22",
    avatar: "MG",
  },
  {
    id: 4,
    name: "Ahmed Hassan",
    email: "ahmed.h@email.com",
    nationality: "Egypt",
    profileStatus: "pending",
    applications: 1,
    joinedDate: "2024-03-01",
    avatar: "AH",
  },
  {
    id: 5,
    name: "Yuki Tanaka",
    email: "yuki.tanaka@email.com",
    nationality: "Japan",
    profileStatus: "complete",
    applications: 3,
    joinedDate: "2024-01-28",
    avatar: "YT",
  },
  {
    id: 6,
    name: "Emma Johnson",
    email: "emma.j@email.com",
    nationality: "UK",
    profileStatus: "complete",
    applications: 5,
    joinedDate: "2023-12-10",
    avatar: "EJ",
  },
  {
    id: 7,
    name: "Raj Patel",
    email: "raj.patel@email.com",
    nationality: "India",
    profileStatus: "incomplete",
    applications: 2,
    joinedDate: "2024-02-20",
    avatar: "RP",
  },
  {
    id: 8,
    name: "Lisa Mueller",
    email: "l.mueller@email.com",
    nationality: "Germany",
    profileStatus: "suspended",
    applications: 0,
    joinedDate: "2024-01-05",
    avatar: "LM",
  },
]

const applicationHistory = [
  { university: "MIT", program: "Computer Science MS", status: "In Review", date: "2024-02-15" },
  { university: "Stanford", program: "AI & ML MS", status: "Submitted", date: "2024-02-20" },
  { university: "Oxford", program: "Data Science MS", status: "Accepted", date: "2024-01-10" },
  { university: "Cambridge", program: "Computer Science MS", status: "Rejected", date: "2024-01-05" },
]

const profileStatuses = ["All Status", "Complete", "Incomplete", "Pending", "Suspended"]

export default function StudentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("All Status")
  const [selectedStudent, setSelectedStudent] = useState<typeof students[0] | null>(null)

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus =
      selectedStatus === "All Status" ||
      student.profileStatus === selectedStatus.toLowerCase()
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      complete: "bg-emerald-100 text-emerald-700",
      incomplete: "bg-amber-100 text-amber-700",
      pending: "bg-blue-100 text-blue-700",
      suspended: "bg-red-100 text-red-700",
    }
    return styles[status] || "bg-gray-100 text-gray-600"
  }

  const getApplicationStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      "In Review": "bg-blue-100 text-blue-700",
      Submitted: "bg-amber-100 text-amber-700",
      Accepted: "bg-emerald-100 text-emerald-700",
      Rejected: "bg-red-100 text-red-700",
    }
    return styles[status] || "bg-gray-100 text-gray-600"
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Student Management
        </h1>
        <p className="text-muted-foreground">
          View and manage all registered students on the platform.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle>All Students ({students.length})</CardTitle>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 sm:w-[280px]"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="justify-between">
                    <Filter className="mr-2 h-4 w-4" />
                    {selectedStatus}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {profileStatuses.map((status) => (
                    <DropdownMenuItem
                      key={status}
                      onClick={() => setSelectedStatus(status)}
                    >
                      {status}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Nationality</TableHead>
                  <TableHead>Profile Status</TableHead>
                  <TableHead>Applications</TableHead>
                  <TableHead>Date Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                            {student.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">{student.name}</p>
                          <p className="text-sm text-muted-foreground">{student.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{student.nationality}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(student.profileStatus)}>
                        {student.profileStatus.charAt(0).toUpperCase() +
                          student.profileStatus.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{student.applications}</TableCell>
                    <TableCell>{student.joinedDate}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedStudent(student)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Ban className="mr-2 h-4 w-4" />
                            Suspend
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Student Profile Dialog */}
      <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Student Profile</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-6">
              {/* Profile Header */}
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                    {selectedStudent.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-foreground">
                    {selectedStudent.name}
                  </h3>
                  <div className="mt-1 flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {selectedStudent.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Joined {selectedStudent.joinedDate}
                    </span>
                  </div>
                  <div className="mt-2 flex gap-2">
                    <Badge className={getStatusBadge(selectedStudent.profileStatus)}>
                      {selectedStudent.profileStatus.charAt(0).toUpperCase() +
                        selectedStudent.profileStatus.slice(1)}
                    </Badge>
                    <Badge variant="outline">{selectedStudent.nationality}</Badge>
                  </div>
                </div>
              </div>

              {/* Profile Completion */}
              <div className="rounded-lg border border-border p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Profile Completion</span>
                  <span className="text-sm text-muted-foreground">75%</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>

              {/* Application History */}
              <div>
                <h4 className="flex items-center gap-2 mb-4 text-sm font-semibold text-foreground">
                  <FileText className="h-4 w-4" />
                  Application History ({selectedStudent.applications})
                </h4>
                <div className="space-y-3">
                  {applicationHistory.map((app, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border border-border p-3"
                    >
                      <div>
                        <p className="font-medium text-foreground">{app.university}</p>
                        <p className="text-sm text-muted-foreground">{app.program}</p>
                      </div>
                      <div className="text-right">
                        <Badge className={getApplicationStatusBadge(app.status)}>
                          {app.status}
                        </Badge>
                        <p className="mt-1 text-xs text-muted-foreground">{app.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedStudent(null)}>
                  Close
                </Button>
                <Button variant="destructive">
                  <Ban className="mr-2 h-4 w-4" />
                  Suspend Account
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

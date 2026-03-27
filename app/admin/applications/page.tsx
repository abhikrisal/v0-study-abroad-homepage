"use client"

import { useState } from "react"
import {
  Search,
  Filter,
  ChevronDown,
  MoreHorizontal,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  Send,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
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
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const applications = [
  {
    id: 1,
    studentName: "Sarah Chen",
    studentAvatar: "SC",
    university: "Massachusetts Institute of Technology",
    program: "Computer Science MS",
    submittedDate: "2024-03-15",
    status: "in-review",
  },
  {
    id: 2,
    studentName: "James Wilson",
    studentAvatar: "JW",
    university: "Stanford University",
    program: "AI & Machine Learning MS",
    submittedDate: "2024-03-14",
    status: "submitted",
  },
  {
    id: 3,
    studentName: "Maria Garcia",
    studentAvatar: "MG",
    university: "University of Oxford",
    program: "Data Science MS",
    submittedDate: "2024-03-10",
    status: "accepted",
  },
  {
    id: 4,
    studentName: "Ahmed Hassan",
    studentAvatar: "AH",
    university: "University of Toronto",
    program: "Business Analytics MS",
    submittedDate: "2024-03-08",
    status: "rejected",
  },
  {
    id: 5,
    studentName: "Yuki Tanaka",
    studentAvatar: "YT",
    university: "Imperial College London",
    program: "Software Engineering MS",
    submittedDate: "2024-03-12",
    status: "in-review",
  },
  {
    id: 6,
    studentName: "Emma Johnson",
    studentAvatar: "EJ",
    university: "University of Cambridge",
    program: "Computer Science PhD",
    submittedDate: "2024-03-05",
    status: "accepted",
  },
  {
    id: 7,
    studentName: "Raj Patel",
    studentAvatar: "RP",
    university: "ETH Zurich",
    program: "Robotics MS",
    submittedDate: "2024-03-11",
    status: "submitted",
  },
  {
    id: 8,
    studentName: "Lisa Mueller",
    studentAvatar: "LM",
    university: "Technical University of Munich",
    program: "Mechanical Engineering MS",
    submittedDate: "2024-03-09",
    status: "in-review",
  },
]

const statusOptions = ["All", "Submitted", "In Review", "Accepted", "Rejected"]

export default function ApplicationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [selectedRows, setSelectedRows] = useState<number[]>([])

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.university.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus =
      selectedStatus === "All" ||
      app.status === selectedStatus.toLowerCase().replace(" ", "-")
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { className: string; label: string; icon: typeof Clock }> = {
      submitted: { className: "bg-amber-100 text-amber-700", label: "Submitted", icon: Send },
      "in-review": { className: "bg-blue-100 text-blue-700", label: "In Review", icon: Clock },
      accepted: { className: "bg-emerald-100 text-emerald-700", label: "Accepted", icon: CheckCircle },
      rejected: { className: "bg-red-100 text-red-700", label: "Rejected", icon: XCircle },
    }
    const style = styles[status] || styles.submitted
    const Icon = style.icon
    return (
      <Badge className={style.className}>
        <Icon className="mr-1 h-3 w-3" />
        {style.label}
      </Badge>
    )
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(filteredApplications.map((app) => app.id))
    } else {
      setSelectedRows([])
    }
  }

  const handleSelectRow = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedRows([...selectedRows, id])
    } else {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id))
    }
  }

  const submittedCount = applications.filter((a) => a.status === "submitted").length
  const inReviewCount = applications.filter((a) => a.status === "in-review").length
  const acceptedCount = applications.filter((a) => a.status === "accepted").length
  const rejectedCount = applications.filter((a) => a.status === "rejected").length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Application Management
        </h1>
        <p className="text-muted-foreground">
          Track and manage all student applications across universities.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                <Send className="h-5 w-5 text-amber-700" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{submittedCount}</p>
                <p className="text-sm text-muted-foreground">Submitted</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <Clock className="h-5 w-5 text-blue-700" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{inReviewCount}</p>
                <p className="text-sm text-muted-foreground">In Review</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                <CheckCircle className="h-5 w-5 text-emerald-700" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{acceptedCount}</p>
                <p className="text-sm text-muted-foreground">Accepted</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                <XCircle className="h-5 w-5 text-red-700" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{rejectedCount}</p>
                <p className="text-sm text-muted-foreground">Rejected</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle>All Applications</CardTitle>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search student or university..."
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
                  {statusOptions.map((status) => (
                    <DropdownMenuItem key={status} onClick={() => setSelectedStatus(status)}>
                      {status}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Bulk Actions */}
          {selectedRows.length > 0 && (
            <div className="mb-4 flex items-center gap-4 rounded-lg bg-secondary p-3">
              <span className="text-sm text-foreground">
                {selectedRows.length} application(s) selected
              </span>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Bulk Update Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="submitted">Mark as Submitted</SelectItem>
                  <SelectItem value="in-review">Mark as In Review</SelectItem>
                  <SelectItem value="accepted">Mark as Accepted</SelectItem>
                  <SelectItem value="rejected">Mark as Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                Apply
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setSelectedRows([])}>
                Clear Selection
              </Button>
            </div>
          )}

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        selectedRows.length === filteredApplications.length &&
                        filteredApplications.length > 0
                      }
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>University</TableHead>
                  <TableHead>Program</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.includes(app.id)}
                        onCheckedChange={(checked) =>
                          handleSelectRow(app.id, checked as boolean)
                        }
                        aria-label={`Select ${app.studentName}`}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                            {app.studentAvatar}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-foreground">{app.studentName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">{app.university}</TableCell>
                    <TableCell>{app.program}</TableCell>
                    <TableCell>{app.submittedDate}</TableCell>
                    <TableCell>{getStatusBadge(app.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Clock className="mr-2 h-4 w-4" />
                            Mark In Review
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Mark Accepted
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <XCircle className="mr-2 h-4 w-4" />
                            Mark Rejected
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
    </div>
  )
}

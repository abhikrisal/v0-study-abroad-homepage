"use client"

import { useState } from "react"
import {
  Search,
  Filter,
  ChevronDown,
  Eye,
  Check,
  X,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

const documents = [
  {
    id: 1,
    studentName: "Sarah Chen",
    studentAvatar: "SC",
    documentType: "Transcript",
    uploadDate: "2024-03-15",
    status: "pending",
    fileUrl: "/documents/transcript-sc.pdf",
  },
  {
    id: 2,
    studentName: "James Wilson",
    studentAvatar: "JW",
    documentType: "Statement of Purpose",
    uploadDate: "2024-03-14",
    status: "pending",
    fileUrl: "/documents/sop-jw.pdf",
  },
  {
    id: 3,
    studentName: "Maria Garcia",
    studentAvatar: "MG",
    documentType: "Letter of Recommendation",
    uploadDate: "2024-03-14",
    status: "approved",
    fileUrl: "/documents/lor-mg.pdf",
  },
  {
    id: 4,
    studentName: "Ahmed Hassan",
    studentAvatar: "AH",
    documentType: "Transcript",
    uploadDate: "2024-03-13",
    status: "rejected",
    fileUrl: "/documents/transcript-ah.pdf",
  },
  {
    id: 5,
    studentName: "Yuki Tanaka",
    studentAvatar: "YT",
    documentType: "Statement of Purpose",
    uploadDate: "2024-03-12",
    status: "pending",
    fileUrl: "/documents/sop-yt.pdf",
  },
  {
    id: 6,
    studentName: "Emma Johnson",
    studentAvatar: "EJ",
    documentType: "Letter of Recommendation",
    uploadDate: "2024-03-12",
    status: "approved",
    fileUrl: "/documents/lor-ej.pdf",
  },
  {
    id: 7,
    studentName: "Raj Patel",
    studentAvatar: "RP",
    documentType: "Transcript",
    uploadDate: "2024-03-11",
    status: "pending",
    fileUrl: "/documents/transcript-rp.pdf",
  },
  {
    id: 8,
    studentName: "Lisa Mueller",
    studentAvatar: "LM",
    documentType: "Statement of Purpose",
    uploadDate: "2024-03-10",
    status: "approved",
    fileUrl: "/documents/sop-lm.pdf",
  },
]

const documentTypes = ["All Types", "Transcript", "Statement of Purpose", "Letter of Recommendation"]
const statuses = ["All Status", "Pending", "Approved", "Rejected"]

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("All Types")
  const [selectedStatus, setSelectedStatus] = useState("All Status")
  const [previewDocument, setPreviewDocument] = useState<typeof documents[0] | null>(null)
  const [reviewNotes, setReviewNotes] = useState("")

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.studentName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === "All Types" || doc.documentType === selectedType
    const matchesStatus =
      selectedStatus === "All Status" || doc.status === selectedStatus.toLowerCase()
    return matchesSearch && matchesType && matchesStatus
  })

  const pendingCount = documents.filter((d) => d.status === "pending").length
  const approvedCount = documents.filter((d) => d.status === "approved").length
  const rejectedCount = documents.filter((d) => d.status === "rejected").length

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { className: string; icon: typeof Clock }> = {
      pending: { className: "bg-amber-100 text-amber-700", icon: Clock },
      approved: { className: "bg-emerald-100 text-emerald-700", icon: CheckCircle },
      rejected: { className: "bg-red-100 text-red-700", icon: XCircle },
    }
    const style = styles[status] || styles.pending
    const Icon = style.icon
    return (
      <Badge className={style.className}>
        <Icon className="mr-1 h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const handleApprove = () => {
    // Handle approval logic
    setPreviewDocument(null)
    setReviewNotes("")
  }

  const handleReject = () => {
    // Handle rejection logic
    setPreviewDocument(null)
    setReviewNotes("")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Document Review
        </h1>
        <p className="text-muted-foreground">
          Review and verify student document submissions.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                <Clock className="h-5 w-5 text-amber-700" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{pendingCount}</p>
                <p className="text-sm text-muted-foreground">Pending Review</p>
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
                <p className="text-2xl font-bold text-foreground">{approvedCount}</p>
                <p className="text-sm text-muted-foreground">Approved</p>
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
            <CardTitle>All Documents</CardTitle>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by student name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 sm:w-[250px]"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="justify-between">
                    <Filter className="mr-2 h-4 w-4" />
                    {selectedType}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {documentTypes.map((type) => (
                    <DropdownMenuItem key={type} onClick={() => setSelectedType(type)}>
                      {type}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="justify-between">
                    {selectedStatus}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {statuses.map((status) => (
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
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Document Type</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                            {doc.studentAvatar}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-foreground">{doc.studentName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        {doc.documentType}
                      </div>
                    </TableCell>
                    <TableCell>{doc.uploadDate}</TableCell>
                    <TableCell>{getStatusBadge(doc.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setPreviewDocument(doc)}
                        >
                          <Eye className="mr-1 h-4 w-4" />
                          Review
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Document Preview Dialog */}
      <Dialog open={!!previewDocument} onOpenChange={() => setPreviewDocument(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Document Review</DialogTitle>
            <DialogDescription>
              Review the document and approve or reject with feedback.
            </DialogDescription>
          </DialogHeader>
          {previewDocument && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 rounded-lg border border-border p-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {previewDocument.studentAvatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground">{previewDocument.studentName}</p>
                  <p className="text-sm text-muted-foreground">
                    {previewDocument.documentType} - Uploaded {previewDocument.uploadDate}
                  </p>
                </div>
                {getStatusBadge(previewDocument.status)}
              </div>

              {/* Document Preview Area */}
              <div className="flex h-[300px] items-center justify-center rounded-lg border border-dashed border-border bg-secondary">
                <div className="text-center">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">Document Preview</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Open in New Tab
                  </Button>
                </div>
              </div>

              {/* Review Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Review Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add notes or feedback for the student..."
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setPreviewDocument(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={previewDocument?.status !== "pending"}
            >
              <X className="mr-2 h-4 w-4" />
              Reject
            </Button>
            <Button
              className="bg-emerald-600 text-white hover:bg-emerald-700"
              onClick={handleApprove}
              disabled={previewDocument?.status !== "pending"}
            >
              <Check className="mr-2 h-4 w-4" />
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

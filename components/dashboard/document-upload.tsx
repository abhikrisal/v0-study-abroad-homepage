"use client"

import { useState } from "react"
import {
  FileText,
  Upload,
  CheckCircle,
  AlertCircle,
  Clock,
  Download,
  Trash2,
  Plus,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

type DocumentStatus = "verified" | "pending" | "rejected" | "missing"

const documents = [
  {
    id: 1,
    name: "Academic Transcript",
    fileName: "transcript_2025.pdf",
    status: "verified" as DocumentStatus,
    uploadDate: "Feb 10, 2026",
    required: true,
  },
  {
    id: 2,
    name: "Statement of Purpose",
    fileName: "sop_final.pdf",
    status: "verified" as DocumentStatus,
    uploadDate: "Feb 12, 2026",
    required: true,
  },
  {
    id: 3,
    name: "Letter of Recommendation 1",
    fileName: "lor_professor_smith.pdf",
    status: "pending" as DocumentStatus,
    uploadDate: "Mar 1, 2026",
    required: true,
  },
  {
    id: 4,
    name: "Letter of Recommendation 2",
    fileName: null,
    status: "missing" as DocumentStatus,
    uploadDate: null,
    required: true,
  },
  {
    id: 5,
    name: "English Proficiency Test",
    fileName: "ielts_score.pdf",
    status: "verified" as DocumentStatus,
    uploadDate: "Jan 20, 2026",
    required: true,
  },
  {
    id: 6,
    name: "Portfolio",
    fileName: "portfolio_2025.pdf",
    status: "rejected" as DocumentStatus,
    uploadDate: "Feb 28, 2026",
    required: false,
  },
]

const statusConfig = {
  verified: {
    label: "Verified",
    icon: CheckCircle,
    className: "bg-accent/15 text-accent border-accent/30",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-chart-4/15 text-chart-4 border-chart-4/30",
  },
  rejected: {
    label: "Rejected",
    icon: AlertCircle,
    className: "bg-destructive/15 text-destructive border-destructive/30",
  },
  missing: {
    label: "Missing",
    icon: AlertCircle,
    className: "bg-muted text-muted-foreground border-border",
  },
}

export function DocumentUpload() {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const completedCount = documents.filter((d) => d.status === "verified").length
  const totalRequired = documents.filter((d) => d.required).length

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg">Documents</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            {completedCount} of {totalRequired} required documents verified
          </p>
        </div>
        <Button size="sm">
          <Plus className="mr-1.5 h-4 w-4" />
          Upload
        </Button>
      </CardHeader>
      <CardContent>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`mb-4 flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
            isDragging
              ? "border-accent bg-accent/5"
              : "border-border hover:border-muted-foreground/50"
          }`}
        >
          <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Drag and drop files here, or{" "}
            <button className="font-medium text-foreground underline underline-offset-2 hover:text-accent">
              browse
            </button>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">PDF, DOC, or JPG up to 10MB</p>
        </div>

        <div className="divide-y divide-border">
          {documents.map((doc) => {
            const status = statusConfig[doc.status]
            const StatusIcon = status.icon
            return (
              <div key={doc.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium text-foreground truncate">{doc.name}</h4>
                    {doc.required && (
                      <span className="text-xs text-destructive shrink-0">*</span>
                    )}
                  </div>
                  {doc.fileName ? (
                    <p className="text-xs text-muted-foreground truncate">{doc.fileName}</p>
                  ) : (
                    <p className="text-xs text-muted-foreground italic">No file uploaded</p>
                  )}
                </div>
                <Badge variant="outline" className={status.className}>
                  <StatusIcon className="mr-1 h-3 w-3" />
                  {status.label}
                </Badge>
                {doc.fileName && (
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Download</span>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                )}
                {!doc.fileName && (
                  <Button size="sm" variant="outline">
                    Upload
                  </Button>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

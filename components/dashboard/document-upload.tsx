"use client"

import { useState, useEffect, useCallback } from "react"
import {
  FileText,
  Upload,
  CheckCircle,
  AlertCircle,
  Clock,
  Download,
  Trash2,
  Plus,
  Loader2,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getDocuments, deleteDocument } from "@/lib/actions/documents"

type DocumentStatus = "verified" | "pending" | "rejected"

interface Document {
  id: string
  document_type: string
  file_name: string
  file_url: string
  file_size: number
  status: DocumentStatus
  rejection_reason: string | null
  uploaded_at: string
}

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
}

const documentTypeLabels: Record<string, string> = {
  passport: "Passport",
  transcript: "Academic Transcript",
  degree: "Degree Certificate",
  english_test: "English Proficiency Test",
  sop: "Statement of Purpose",
  lor: "Letter of Recommendation",
  cv: "CV/Resume",
  other: "Other Document",
}

export function DocumentUpload() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchDocuments = useCallback(async () => {
    const data = await getDocuments()
    setDocuments(data as Document[])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchDocuments()
  }, [fetchDocuments])

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
    // File handling will be implemented with proper upload
  }

  const handleDelete = async (documentId: string) => {
    setDeletingId(documentId)
    const result = await deleteDocument(documentId)
    if (result.success) {
      setDocuments(prev => prev.filter(d => d.id !== documentId))
    }
    setDeletingId(null)
  }

  const completedCount = documents.filter((d) => d.status === "verified").length

  if (loading) {
    return (
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-lg">Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg">Documents</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            {completedCount} of {documents.length} documents verified
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

        {documents.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            <FileText className="h-10 w-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No documents uploaded yet</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {documents.map((doc) => {
              const status = statusConfig[doc.status] || statusConfig.pending
              const StatusIcon = status.icon
              return (
                <div key={doc.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-medium text-foreground truncate">
                        {documentTypeLabels[doc.document_type] || doc.document_type}
                      </h4>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{doc.file_name}</p>
                    {doc.status === "rejected" && doc.rejection_reason && (
                      <p className="text-xs text-destructive mt-0.5">{doc.rejection_reason}</p>
                    )}
                  </div>
                  <Badge variant="outline" className={status.className}>
                    <StatusIcon className="mr-1 h-3 w-3" />
                    {status.label}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                      <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Download</span>
                      </a>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => handleDelete(doc.id)}
                      disabled={deletingId === doc.id}
                    >
                      {deletingId === doc.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

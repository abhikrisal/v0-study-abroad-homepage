"use client"

import { useState } from "react"
import {
  Users,
  Shield,
  MessageSquare,
  Mail,
  AlertTriangle,
  Plus,
  Pencil,
  Trash2,
  Save,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const adminUsers = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@edulynx.com",
    role: "Super Admin",
    avatar: "JS",
    lastActive: "2 minutes ago",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.j@edulynx.com",
    role: "Admin",
    avatar: "SJ",
    lastActive: "1 hour ago",
  },
  {
    id: 3,
    name: "Mike Chen",
    email: "mike.chen@edulynx.com",
    role: "Moderator",
    avatar: "MC",
    lastActive: "3 hours ago",
  },
]

const faqs = [
  { id: 1, question: "How do I apply to a university?", category: "Applications" },
  { id: 2, question: "What documents do I need?", category: "Documents" },
  { id: 3, question: "How does AI matching work?", category: "Features" },
  { id: 4, question: "Can I change my preferences?", category: "Profile" },
]

export default function SettingsPage() {
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState({
    newApplications: true,
    documentUploads: true,
    studentRegistrations: true,
    weeklyReports: false,
  })
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Admin Settings</h1>
        <p className="text-muted-foreground">
          Manage platform settings, admin accounts, and system configurations.
        </p>
      </div>

      <Tabs defaultValue="admins" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="admins" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Admin Accounts</span>
            <span className="sm:hidden">Admins</span>
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Platform Content</span>
            <span className="sm:hidden">Content</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
            <span className="sm:hidden">Notifs</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">System</span>
            <span className="sm:hidden">System</span>
          </TabsTrigger>
        </TabsList>

        {/* Admin Accounts Tab */}
        <TabsContent value="admins" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Admin Accounts</CardTitle>
                <CardDescription>Manage administrator access and roles</CardDescription>
              </div>
              <Dialog open={isAddAdminOpen} onOpenChange={setIsAddAdminOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Admin
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Admin</DialogTitle>
                    <DialogDescription>
                      Create a new administrator account with specified role and permissions.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" placeholder="Enter full name" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" placeholder="admin@edulynx.com" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="role">Role</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="super-admin">Super Admin</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="moderator">Moderator</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddAdminOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      className="bg-accent text-accent-foreground hover:bg-accent/90"
                      onClick={() => setIsAddAdminOpen(false)}
                    >
                      Add Admin
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Admin</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminUsers.map((admin) => (
                    <TableRow key={admin.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                              {admin.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground">{admin.name}</p>
                            <p className="text-sm text-muted-foreground">{admin.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            admin.role === "Super Admin"
                              ? "border-accent text-accent"
                              : admin.role === "Admin"
                                ? "border-primary text-primary"
                                : ""
                          }
                        >
                          {admin.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{admin.lastActive}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Platform Content Tab */}
        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>FAQs Management</CardTitle>
              <CardDescription>Update frequently asked questions displayed to students</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {faqs.map((faq) => (
                <div
                  key={faq.id}
                  className="flex items-center justify-between rounded-lg border border-border p-4"
                >
                  <div>
                    <p className="font-medium text-foreground">{faq.question}</p>
                    <Badge variant="secondary" className="mt-1">
                      {faq.category}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add FAQ
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Chatbot Responses</CardTitle>
              <CardDescription>Configure AI chatbot default responses and prompts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="welcome">Welcome Message</Label>
                <Textarea
                  id="welcome"
                  defaultValue="Hi! I'm Lynx, your study abroad assistant. How can I help you today?"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fallback">Fallback Response</Label>
                <Textarea
                  id="fallback"
                  defaultValue="I'm not sure I understand. Could you rephrase your question, or would you like to speak with a human advisor?"
                  rows={2}
                />
              </div>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>Configure which events trigger admin email notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>New Applications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications when students submit new applications
                  </p>
                </div>
                <Switch
                  checked={emailNotifications.newApplications}
                  onCheckedChange={(checked) =>
                    setEmailNotifications({ ...emailNotifications, newApplications: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Document Uploads</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when new documents are uploaded for review
                  </p>
                </div>
                <Switch
                  checked={emailNotifications.documentUploads}
                  onCheckedChange={(checked) =>
                    setEmailNotifications({ ...emailNotifications, documentUploads: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Student Registrations</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive alerts for new student sign-ups
                  </p>
                </div>
                <Switch
                  checked={emailNotifications.studentRegistrations}
                  onCheckedChange={(checked) =>
                    setEmailNotifications({ ...emailNotifications, studentRegistrations: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Weekly Reports</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive weekly summary reports via email
                  </p>
                </div>
                <Switch
                  checked={emailNotifications.weeklyReports}
                  onCheckedChange={(checked) =>
                    setEmailNotifications({ ...emailNotifications, weeklyReports: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Tab */}
        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Mode</CardTitle>
              <CardDescription>
                Enable maintenance mode to temporarily disable platform access for students
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${maintenanceMode ? "bg-amber-100" : "bg-secondary"}`}
                  >
                    <AlertTriangle
                      className={`h-5 w-5 ${maintenanceMode ? "text-amber-700" : "text-muted-foreground"}`}
                    />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Maintenance Mode</p>
                    <p className="text-sm text-muted-foreground">
                      {maintenanceMode
                        ? "Platform is currently in maintenance mode"
                        : "Platform is running normally"}
                    </p>
                  </div>
                </div>
                <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
              </div>
              {maintenanceMode && (
                <div className="mt-4 space-y-2">
                  <Label htmlFor="maintenance-message">Maintenance Message</Label>
                  <Textarea
                    id="maintenance-message"
                    placeholder="Enter a message to display to users during maintenance..."
                    defaultValue="We're currently performing scheduled maintenance. Please check back soon!"
                    rows={3}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
              <CardDescription>Current platform status and version information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-border p-4">
                  <p className="text-sm text-muted-foreground">Platform Version</p>
                  <p className="text-lg font-semibold text-foreground">v2.4.1</p>
                </div>
                <div className="rounded-lg border border-border p-4">
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="text-lg font-semibold text-foreground">March 15, 2024</p>
                </div>
                <div className="rounded-lg border border-border p-4">
                  <p className="text-sm text-muted-foreground">Database Status</p>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    <p className="text-lg font-semibold text-foreground">Healthy</p>
                  </div>
                </div>
                <div className="rounded-lg border border-border p-4">
                  <p className="text-sm text-muted-foreground">API Status</p>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    <p className="text-lg font-semibold text-foreground">Operational</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

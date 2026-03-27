"use client"

import { useState } from "react"
import {
  Search,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Filter,
  ChevronDown,
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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const universities = [
  {
    id: 1,
    name: "Massachusetts Institute of Technology",
    country: "USA",
    programs: 45,
    status: "active",
    tuition: "$55,000",
  },
  {
    id: 2,
    name: "University of Oxford",
    country: "UK",
    programs: 38,
    status: "active",
    tuition: "£38,000",
  },
  {
    id: 3,
    name: "University of Toronto",
    country: "Canada",
    programs: 52,
    status: "active",
    tuition: "CAD 45,000",
  },
  {
    id: 4,
    name: "Technical University of Munich",
    country: "Germany",
    programs: 28,
    status: "inactive",
    tuition: "€1,500",
  },
  {
    id: 5,
    name: "University of Melbourne",
    country: "Australia",
    programs: 41,
    status: "active",
    tuition: "AUD 42,000",
  },
  {
    id: 6,
    name: "Stanford University",
    country: "USA",
    programs: 50,
    status: "active",
    tuition: "$58,000",
  },
  {
    id: 7,
    name: "Imperial College London",
    country: "UK",
    programs: 35,
    status: "active",
    tuition: "£35,000",
  },
  {
    id: 8,
    name: "ETH Zurich",
    country: "Switzerland",
    programs: 22,
    status: "inactive",
    tuition: "CHF 1,500",
  },
]

const countries = ["All Countries", "USA", "UK", "Canada", "Germany", "Australia", "Switzerland"]
const statuses = ["All Status", "Active", "Inactive"]

export default function UniversitiesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCountry, setSelectedCountry] = useState("All Countries")
  const [selectedStatus, setSelectedStatus] = useState("All Status")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const filteredUniversities = universities.filter((uni) => {
    const matchesSearch = uni.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCountry = selectedCountry === "All Countries" || uni.country === selectedCountry
    const matchesStatus =
      selectedStatus === "All Status" ||
      uni.status === selectedStatus.toLowerCase()
    return matchesSearch && matchesCountry && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            University Management
          </h1>
          <p className="text-muted-foreground">
            Manage universities and their programs on the platform.
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Plus className="mr-2 h-4 w-4" />
              Add University
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New University</DialogTitle>
              <DialogDescription>
                Fill in the details to add a new university to the platform.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">University Name</Label>
                <Input id="name" placeholder="Enter university name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="country">Country</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usa">USA</SelectItem>
                      <SelectItem value="uk">UK</SelectItem>
                      <SelectItem value="canada">Canada</SelectItem>
                      <SelectItem value="germany">Germany</SelectItem>
                      <SelectItem value="australia">Australia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tuition">Tuition Fee (Annual)</Label>
                  <Input id="tuition" placeholder="e.g., $55,000" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="programs">Programs Offered</Label>
                <Textarea
                  id="programs"
                  placeholder="Enter programs separated by commas"
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="requirements">Eligibility Requirements</Label>
                <Textarea
                  id="requirements"
                  placeholder="Enter minimum GPA, IELTS/TOEFL scores, etc."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="intake">Intake Dates</Label>
                  <Input id="intake" placeholder="e.g., Fall 2024, Spring 2025" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select defaultValue="active">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                className="bg-accent text-accent-foreground hover:bg-accent/90"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Add University
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle>All Universities</CardTitle>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search universities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 sm:w-[250px]"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="justify-between">
                    <Filter className="mr-2 h-4 w-4" />
                    {selectedCountry}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {countries.map((country) => (
                    <DropdownMenuItem
                      key={country}
                      onClick={() => setSelectedCountry(country)}
                    >
                      {country}
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
                  <TableHead>University Name</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Programs</TableHead>
                  <TableHead>Tuition</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUniversities.map((uni) => (
                  <TableRow key={uni.id}>
                    <TableCell className="font-medium">{uni.name}</TableCell>
                    <TableCell>{uni.country}</TableCell>
                    <TableCell>{uni.programs} programs</TableCell>
                    <TableCell>{uni.tuition}</TableCell>
                    <TableCell>
                      <Badge
                        variant={uni.status === "active" ? "default" : "secondary"}
                        className={
                          uni.status === "active"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-gray-100 text-gray-600"
                        }
                      >
                        {uni.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
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
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
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

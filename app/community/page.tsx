"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageSquare, ThumbsUp, Search, Pin, TrendingUp, Clock, Filter } from "lucide-react"

const categories = ["All", "Visa & Immigration", "University Life", "Scholarships", "SOP & LOR", "Accommodation", "Part-time Work", "General"]

const posts = [
  {
    id: 1,
    author: "Priya S.",
    avatar: "P",
    avatarColor: "bg-blue-500",
    category: "Visa & Immigration",
    title: "Canada Study Permit approved in 6 weeks — here's what worked for me",
    excerpt: "I just got my Canadian study permit approved and wanted to share my experience. The SDS stream was a game changer. Make sure your financial docs are crystal clear...",
    likes: 142,
    replies: 38,
    time: "2 hours ago",
    pinned: true,
    country: "🇨🇦",
  },
  {
    id: 2,
    author: "Ahmed K.",
    avatar: "A",
    avatarColor: "bg-green-500",
    category: "Scholarships",
    title: "DAAD Scholarship tips — how I got fully funded for Germany",
    excerpt: "Getting the DAAD scholarship was one of the best decisions I made. Here's my complete timeline, what to write in your motivation letter, and mistakes to avoid...",
    likes: 98,
    replies: 25,
    time: "5 hours ago",
    pinned: false,
    country: "🇩🇪",
  },
  {
    id: 3,
    author: "Mei L.",
    avatar: "M",
    avatarColor: "bg-purple-500",
    category: "University Life",
    title: "First month in Melbourne — things no one tells you",
    excerpt: "From finding affordable housing near Monash to navigating the tram system, here are the things I wish someone had told me before I arrived in Australia...",
    likes: 76,
    replies: 19,
    time: "1 day ago",
    pinned: false,
    country: "🇦🇺",
  },
  {
    id: 4,
    author: "Rahul M.",
    avatar: "R",
    avatarColor: "bg-orange-500",
    category: "SOP & LOR",
    title: "Got into 4 UK universities — sharing my Statement of Purpose",
    excerpt: "After months of drafting and rewriting, I finally nailed my SOP. I want to break down the structure that worked for me and what admissions officers actually look for...",
    likes: 215,
    replies: 64,
    time: "2 days ago",
    pinned: false,
    country: "🇬🇧",
  },
  {
    id: 5,
    author: "Fatima O.",
    avatar: "F",
    avatarColor: "bg-pink-500",
    category: "Part-time Work",
    title: "Part-time jobs in Canada as an international student — complete guide",
    excerpt: "Working 20 hours on campus + off campus has helped me cover 40% of my living costs. Here's where to look, what pays well, and the SIN number process...",
    likes: 87,
    replies: 31,
    time: "3 days ago",
    pinned: false,
    country: "🇨🇦",
  },
  {
    id: 6,
    author: "Chen W.",
    avatar: "C",
    avatarColor: "bg-teal-500",
    category: "Accommodation",
    title: "Finding student housing in Germany — avoid these mistakes",
    excerpt: "Studentenwerk waitlists can take months. I learned the hard way. Here's how to find private housing, what to expect in costs, and the documents landlords require...",
    likes: 54,
    replies: 17,
    time: "4 days ago",
    pinned: false,
    country: "🇩🇪",
  },
]

const stats = [
  { value: "12,400+", label: "Community Members" },
  { value: "8,200+", label: "Questions Answered" },
  { value: "450+", label: "Success Stories" },
]

export default function CommunityPage() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [showNewPost, setShowNewPost] = useState(false)
  const [newPost, setNewPost] = useState({ title: "", category: "General", content: "" })
  const [likedPosts, setLikedPosts] = useState<number[]>([])

  const filtered = posts.filter((p) => {
    const matchesCategory = activeCategory === "All" || p.category === activeCategory
    const matchesSearch = searchQuery === "" || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleLike = (postId: number) => {
    setLikedPosts(prev => 
      prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="bg-primary pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent text-sm font-semibold mb-4">
              Student Community Forum
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-primary-foreground tracking-tight text-balance">
              Learn from Students Who&apos;ve Been There
            </h1>
            <p className="mt-4 text-lg text-primary-foreground/70">
              Browse real experiences from students studying abroad. Find answers about visas, scholarships, accommodation, and university life — or share your own journey to help others.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm text-primary-foreground/60">
              <span className="px-3 py-1 bg-primary-foreground/10 rounded-full">Read success stories</span>
              <span className="px-3 py-1 bg-primary-foreground/10 rounded-full">Get visa tips</span>
              <span className="px-3 py-1 bg-primary-foreground/10 rounded-full">Find scholarship advice</span>
              <span className="px-3 py-1 bg-primary-foreground/10 rounded-full">Ask questions</span>
            </div>
          </div>
          <div className="flex justify-center gap-10">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-bold text-accent">{s.value}</div>
                <div className="text-sm text-primary-foreground/60 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="py-10 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left sidebar */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="sticky top-24 space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Filter className="h-4 w-4" /> Categories
                  </h3>
                  <div className="flex flex-col gap-1">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                          activeCategory === cat
                            ? "bg-primary text-primary-foreground font-semibold"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-accent/10 border border-accent/20 rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-foreground mb-2">Share Your Experience</h4>
                  <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                    Help other students by sharing your study abroad journey.
                  </p>
                  <Button size="sm" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => setShowNewPost(true)}>
                    Post a Question
                  </Button>
                </div>
              </div>
            </aside>

            {/* Main feed */}
            <div className="flex-1 min-w-0">
              {/* Search and sort */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search discussions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button variant="outline" className="gap-2 flex-shrink-0">
                  <TrendingUp className="h-4 w-4" /> Trending
                </Button>
              </div>

              {/* New Post Form */}
              {showNewPost && (
                <Card className="border border-accent/30 mb-6">
                  <CardContent className="p-5 space-y-3">
                    <h3 className="font-semibold text-foreground">Create a New Post</h3>
                    <Input
                      placeholder="Post title..."
                      value={newPost.title}
                      onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    />
                    <select
                      value={newPost.category}
                      onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                      className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    >
                      {categories.filter(c => c !== "All").map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <Textarea
                      placeholder="Share your experience or ask your question..."
                      value={newPost.content}
                      onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                      rows={4}
                    />
                    <div className="flex gap-2 justify-end">
                      <Button variant="ghost" size="sm" onClick={() => setShowNewPost(false)}>Cancel</Button>
                      <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => setShowNewPost(false)}>
                        Post
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Posts */}
              <div className="space-y-4">
                {filtered.map((post) => (
                  <Card key={post.id} className={`border transition-shadow hover:shadow-md cursor-pointer ${post.pinned ? "border-accent/40" : "border-border"}`}>
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-9 w-9 flex-shrink-0">
                          <AvatarFallback className={`${post.avatarColor} text-white text-sm font-semibold`}>
                            {post.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            {post.pinned && (
                              <span className="flex items-center gap-1 text-xs text-accent font-semibold">
                                <Pin className="h-3 w-3" /> Pinned
                              </span>
                            )}
                            <Badge variant="secondary" className="text-xs">{post.category}</Badge>
                            <span className="text-sm">{post.country}</span>
                          </div>
                          <h3 className="font-semibold text-foreground text-sm leading-snug mb-1.5">
                            {post.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center gap-4 mt-3">
                            <span className="text-xs text-muted-foreground">{post.author}</span>
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" /> {post.time}
                            </span>
                            <button
                              onClick={() => handleLike(post.id)}
                              className={`flex items-center gap-1 text-xs transition-colors ${likedPosts.includes(post.id) ? "text-accent font-semibold" : "text-muted-foreground hover:text-foreground"}`}
                            >
                              <ThumbsUp className="h-3.5 w-3.5" />
                              {post.likes + (likedPosts.includes(post.id) ? 1 : 0)}
                            </button>
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MessageSquare className="h-3.5 w-3.5" /> {post.replies}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {filtered.length === 0 && (
                  <div className="text-center py-16 text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No posts found</p>
                    <p className="text-sm mt-1">Try a different search term or category</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

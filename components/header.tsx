"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Menu, X, User, LogOut, LayoutDashboard } from "lucide-react"
import { signOut, getUser } from "@/lib/actions/auth"
import type { User as SupabaseUser } from "@supabase/supabase-js"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getUser().then((user) => {
      setUser(user)
      setLoading(false)
    })
  }, [])

  const handleLogout = async () => {
    await signOut()
  }

  const getInitials = () => {
    if (!user) return 'U'
    const email = user.email || ''
    return email.charAt(0).toUpperCase()
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-md border-b border-primary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <span className="text-sm font-bold text-accent-foreground">E</span>
            </div>
            <span className="text-xl font-semibold tracking-tight text-primary-foreground">
              EduLynx
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">Home</Link>
            <Link href="/programs" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">Find Universities</Link>
            <Link href="/eligibility" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">Eligibility Check</Link>
            <Link href="/visa" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">Visa Guide</Link>
            <Link href="/community" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">Community</Link>
            <Link href="/contact" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">Contact</Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-primary-foreground/20 animate-pulse" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-primary-foreground/10">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-accent text-accent-foreground text-sm font-bold">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium text-sm">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90" asChild>
                  <Link href="/onboarding">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
            {isMenuOpen ? <X className="h-5 w-5 text-primary-foreground" /> : <Menu className="h-5 w-5 text-primary-foreground" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-primary border-t border-primary-foreground/10">
          <div className="px-4 py-4 flex flex-col gap-4">
            {[
              { href: "/", label: "Home" },
              { href: "/programs", label: "Find Universities" },
              { href: "/eligibility", label: "Eligibility Check" },
              { href: "/visa", label: "Visa Guide" },
              { href: "/community", label: "Community" },
              { href: "/contact", label: "Contact" },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors" onClick={() => setIsMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-2 border-t border-primary-foreground/10">
              {user ? (
                <>
                  <Button variant="ghost" size="sm" className="justify-start text-primary-foreground" asChild>
                    <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}><LayoutDashboard className="mr-2 h-4 w-4" />Dashboard</Link>
                  </Button>
                  <Button variant="ghost" size="sm" className="justify-start text-destructive" onClick={() => { handleLogout(); setIsMenuOpen(false) }}>
                    <LogOut className="mr-2 h-4 w-4" />Log out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" className="justify-start text-primary-foreground" asChild>
                    <Link href="/login" onClick={() => setIsMenuOpen(false)}>Login</Link>
                  </Button>
                  <Button size="sm" className="bg-accent text-accent-foreground" asChild>
                    <Link href="/onboarding" onClick={() => setIsMenuOpen(false)}>Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

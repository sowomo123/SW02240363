"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeftIcon, HomeIcon } from "lucide-react"
import { toast } from "react-hot-toast"

interface User {
  id: string
  email: string
  name?: string
}

export default function Header() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if user is logged in by checking localStorage or making an API call
    const checkAuth = () => {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
      setLoading(false)
    }
    
    checkAuth()
  }, [])

  const handleSignOut = async () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    setUser(null)
    router.push('/auth/signin')
    toast.success("Signed out successfully!")
  }

  const handleBack = () => {
    router.back()
  }

  // Show back button on certain pages
  const showBackButton = pathname !== "/" && !pathname.includes("/auth")

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-green-200 bg-green-50/95 backdrop-blur supports-[backdrop-filter]:bg-green-50/60">
      <div className="flex items-center space-x-4">
        {showBackButton && (
          <Button variant="ghost" size="sm" onClick={handleBack} className="hover:bg-green-100 text-green-700">
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back
          </Button>
        )}
        <Link href="/" className="text-xl font-bold flex items-center text-green-800 hover:text-green-900">
          <HomeIcon className="h-5 w-5 mr-2" />
          Home
        </Link>
      </div>
      <nav className="flex items-center space-x-4">
        
        {user && (
          <Link href="/bookmarks">
            <Button variant="ghost" size="sm" className="hover:bg-green-100 text-green-700">My Bookmarks</Button>
          </Link>
        )}
        {loading ? (
          <div className="w-8 h-8 rounded-full bg-green-200 animate-pulse" />
        ) : user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-green-100">
                <Avatar className="h-8 w-8 border-2 border-green-200">
                  <AvatarImage
                    src="/placeholder.svg?height=32&width=32&query=user avatar"
                    alt={user.name || "User"}
                  />
                  <AvatarFallback className="bg-green-100 text-green-700">
                    {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 border-green-200" align="end" forceMount>
              <div className="flex flex-col space-y-1 p-2">
                <p className="text-sm font-medium leading-none text-green-800">{user.name}</p>
                <p className="text-xs leading-none text-green-600">{user.email}</p>
              </div>
              <DropdownMenuItem onClick={handleSignOut} className="hover:bg-green-100 text-green-700">Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/auth/signin">
            <Button className="bg-green-600 hover:bg-green-700 text-white">Sign In</Button>
          </Link>
        )}
      </nav>
    </header>
  )
}

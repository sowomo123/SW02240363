"use client"

import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase-browser"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"

export default function Header() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push("/")
  }

  return (
    <header
      className="flex items-center justify-between p-4 border-b"
      style={{ backgroundColor: "#bae6fd" }}
    >
      <div className="flex-1 flex justify-center">
        <h1
          className="text-2xl font-bold italic"
          style={{ fontFamily: "Lora, serif" }}
        >
          Quick-Post
        </h1>
      </div>
      {user ? (
        <div className="flex items-center gap-4 absolute right-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/bookmarks")}
          >
            My Bookmarks
          </Button>
          <span className="text-sm hidden sm:block">{user.email}</span>
          <Button onClick={handleSignOut} variant="outline" size="sm">
            Sign Out
          </Button>
        </div>
      ) : (
        <div className="absolute right-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/signin")}
            style={{ backgroundColor: "#4ade80", color: "#000", borderColor: "#4ade80" }}
          >
            Sign In
          </Button>
        </div>
      )}
    </header>
  )
}

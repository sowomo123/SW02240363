"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase-browser"
import type { User } from "@supabase/supabase-js"
import AuthForm from "@/components/auth-form"
import Header from "@/components/header"

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleAuthCode = async () => {
      const code = searchParams.get('code')
      
      if (code) {
        console.log("Handling auth code on client...")
        try {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code)
          if (error) {
            console.error("Client auth error:", error)
            router.replace('/auth/auth-error')
            return
          } else {
            console.log("Client auth successful")
            setUser(data.user)
            // Remove code from URL
            router.replace('/')
            return
          }
        } catch (err) {
          console.error("Client auth exception:", err)
          router.replace('/auth/auth-error')
          return
        }
      }

      // If no code, get current user
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
      } catch (error) {
        console.error("Error getting user:", error)
      } finally {
        setLoading(false)
      }
    }

    handleAuthCode()
  }, [searchParams, router])

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
      if (!loading) setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [loading])

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {loading ? (
          <div className="flex justify-center items-center min-h-screen">
            <p>Loading...</p>
          </div>
        ) : !user ? (
          <div className="flex justify-center items-center h-[calc(100vh-100px)]">
            <AuthForm />
          </div>
        ) : (
          <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Welcome to Quick-Post</h1>
            <p className="mb-4">Hello, {user.email}! You are now logged in.</p>
          </div>
        )}
      </main>
    </div>
  )
}
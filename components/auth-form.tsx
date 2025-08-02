"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase-browser"

export default function AuthForm() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setMessage("")
    setError("")

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
    } else {
      setMessage("Check your email for a magic link to sign in!")
    }
    setLoading(false)
  }

  return (
    <Card
      className="mx-10 my-10 max-w-md p-6"
      style={{ backgroundColor: "#b1ed9aff", color: "#000" }} 
    >
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl" style={{ color: "#000" }}>Sign in </CardTitle>
        <CardDescription style={{ color: "#000" }}>
          Enter your email below to receive a magic link
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email" style={{ color: "#000" }}>Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="yourname@gamil.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              style={{ color: "#000", backgroundColor: "#fff" }}
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
            style={{ color: "#000", backgroundColor: "#fff" }}
          >
            {loading ? "Sending..." : "Send Magic Link"}
          </Button>
          {message && <p className="text-sm text-green-500 text-center" style={{ color: "#000" }}>{message}</p>}
          {error && <p className="text-sm text-red-500 text-center" style={{ color: "#000" }}>{error}</p>}
        </form>
      </CardContent>
    </Card>
  )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { toast } from "react-hot-toast"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Send magic link using your custom auth API
      const response = await fetch('/api/auth/nextauth', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          action: "send-magic-link",
        }),
      })

      const data = await response.json()

      if (data.success) {
        setEmailSent(true)
        toast.success("Magic link sent! Check your email.")
      } else {
        toast.error(data.error || "Failed to send magic link")
      }
    } catch (error) {
      console.error("Magic link error:", error)
      toast.error("An error occurred while sending the magic link")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center bg-background py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>
            {emailSent 
              ? "We've sent you a magic link! Check your email and click the link to sign in."
              : "Enter your email to receive a magic link"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!emailSent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Sending Magic Link..." : "Send Magic Link"}
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="text-center p-6">
                <div className="mx-auto mb-4 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm text-muted-foreground">
                  Magic link sent to <strong>{email}</strong>
                </p>
              </div>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => {
                  setEmailSent(false)
                  setEmail("")
                }}
              >
                Send Another Link
              </Button>
            </div>
          )}
          
          {!emailSent && (
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/auth/signup" className="text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

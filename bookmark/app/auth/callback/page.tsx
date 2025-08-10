"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { toast } from "react-hot-toast"

export default function AuthCallbackPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleAuth = async () => {
      try {
        // Get token and email from URL parameters (Supabase magic link format)
        const token = searchParams.get('token_hash') || searchParams.get('access_token')
        const email = searchParams.get('email')
        const type = searchParams.get('type')

        if (!token) {
          setError('No authentication token found')
          setStatus('error')
          return
        }

        // If it's a magic link, verify it
        if (type === 'magiclink' && email) {
          const response = await fetch('/api/auth/nextauth', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'verify-magic-link',
              email: email,
              token: token,
            }),
          })

          const data = await response.json()

          if (data.success && data.user) {
            // Store user data in localStorage
            localStorage.setItem('user', JSON.stringify(data.user))
            localStorage.setItem('token', token)
            
            setStatus('success')
            toast.success('Successfully signed in!')
            
            // Redirect after a short delay
            setTimeout(() => {
              router.push('/articles')
            }, 2000)
          } else {
            setError(data.error || 'Authentication failed')
            setStatus('error')
          }
        } else {
          // Handle other auth types or direct token usage
          localStorage.setItem('token', token)
          if (email) {
            localStorage.setItem('user', JSON.stringify({ email }))
          }
          
          setStatus('success')
          toast.success('Successfully signed in!')
          
          setTimeout(() => {
            router.push('/articles')
          }, 2000)
        }
      } catch (error) {
        console.error('Auth callback error:', error)
        setError('An unexpected error occurred')
        setStatus('error')
      }
    }

    handleAuth()
  }, [searchParams, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Signing you in...</CardTitle>
            <CardDescription>
              Please wait while we authenticate your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-green-600">Success!</CardTitle>
            <CardDescription>
              You have been successfully signed in.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="mx-auto mb-4 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm text-gray-600">
              Redirecting you to the articles page...
            </p>
            <Link href="/articles">
              <Button className="w-full">
                Continue to Articles
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-red-600">Authentication Error</CardTitle>
          <CardDescription>
            {error || 'Failed to sign in. Please try again.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <Link href="/auth/signin">
            <Button className="w-full">
              Try Again
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full">
              Back to Home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

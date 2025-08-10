// Simple auth API route for magic link and credentials
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, token, action } = body

    // Handle magic link verification
    if (action === 'verify-magic-link' && email && token) {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-magic-link`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, token }),
      })

      if (response.ok) {
        const data = await response.json()
        return NextResponse.json({ success: true, user: data.user })
      } else {
        return NextResponse.json({ success: false, error: 'Invalid magic link' }, { status: 400 })
      }
    }

    // Handle credentials login
    if (action === 'credentials' && email && password) {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const data = await response.json()
        return NextResponse.json({ success: true, user: data.user })
      } else {
        return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 400 })
      }
    }

    // Handle magic link request
    if (action === 'send-magic-link' && email) {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/magic-link`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        return NextResponse.json({ success: true, message: 'Magic link sent' })
      } else {
        return NextResponse.json({ success: false, error: 'Failed to send magic link' }, { status: 400 })
      }
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 })

  } catch (error) {
    console.error('Auth API error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Auth API endpoint' })
}

import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const error = searchParams.get("error")

  console.log("Callback called with:", { code: !!code, error })

  if (error) {
    console.error("Auth error:", error)
    return NextResponse.redirect(`${origin}/auth/auth-error`)
  }

  if (code) {
    // Redirect to home page with the code, let client handle it
    return NextResponse.redirect(`${origin}/?code=${code}`)
  }

  return NextResponse.redirect(`${origin}/auth/auth-error`)
}

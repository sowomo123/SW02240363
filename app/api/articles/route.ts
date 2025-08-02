import { NextResponse } from "next/server"

export async function GET() {
  try {
    const response = await fetch("https://dev.to/api/articles?per_page=24", {
      headers: {
        "Content-Type": "application/json",
      },
      // Cache for 1 hour
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      console.error(`Dev.to API error: ${response.status} ${response.statusText}`)
      return NextResponse.json({ error: "Failed to fetch articles from Dev.to" }, { status: response.status })
    }

    const articles = await response.json()
    return NextResponse.json(articles)
  } catch (error) {
    console.error("Error fetching articles:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

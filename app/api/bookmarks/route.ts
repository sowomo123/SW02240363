import { createServerClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data, error } = await supabase.from("bookmarks").select("*").eq("user_id", user.id)

  if (error) {
    console.error("Error fetching bookmarks:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { article_id, article_title, article_url, article_image_url } = await request.json()

  if (!article_id || !article_title || !article_url) {
    return NextResponse.json({ error: "Missing required article data" }, { status: 400 })
  }

  const { data, error } = await supabase
    .from("bookmarks")
    .insert({
      user_id: user.id,
      article_id,
      article_title,
      article_url,
      article_image_url,
    })
    .select()

  if (error) {
    console.error("Error saving bookmark:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data[0], { status: 201 })
}

export async function DELETE(request: Request) {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { article_id } = await request.json()

  if (!article_id) {
    return NextResponse.json({ error: "Missing article_id" }, { status: 400 })
  }

  const { error } = await supabase.from("bookmarks").delete().eq("user_id", user.id).eq("article_id", article_id)

  if (error) {
    console.error("Error deleting bookmark:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: "Bookmark deleted successfully" }, { status: 200 })
}

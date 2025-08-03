"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase-browser"
import type { User } from "@supabase/supabase-js"
import Header from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Trash2 } from "lucide-react"
import { toast } from "sonner"

interface Bookmark {
  id: string
  article_id: string
  article_title: string
  article_url: string
  article_image_url?: string
  created_at: string
}

export default function BookmarksPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [bookmarksLoading, setBookmarksLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
        
        if (!user) {
          router.push("/") // Redirect to sign in if not authenticated
        }
      } catch (error) {
        console.error("Error getting user:", error)
        router.push("/")
      } finally {
        setLoading(false)
      }
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        router.push("/")
      } else {
        setUser(session.user)
      }
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (user) {
        try {
          const res = await fetch("/api/bookmarks")
          if (res.ok) {
            const data = await res.json()
            setBookmarks(data)
          } else if (res.status === 401) {
            router.push("/")
          }
        } catch (error) {
          console.error("Error fetching bookmarks:", error)
          toast.error("Failed to load bookmarks")
        } finally {
          setBookmarksLoading(false)
        }
      }
    }

    fetchBookmarks()
  }, [user, router])

  const removeBookmark = async (articleId: string) => {
    try {
      const res = await fetch(`/api/bookmarks/${articleId}`, {
        method: "DELETE",
      })

      if (res.ok) {
        setBookmarks(bookmarks.filter(bookmark => bookmark.article_id !== articleId))
        toast.success("Bookmark removed")
      } else {
        toast.error("Failed to remove bookmark")
      }
    } catch (error) {
      console.error("Error removing bookmark:", error)
      toast.error("Failed to remove bookmark")
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight mb-6">My Bookmarks</h1>
          
          {bookmarksLoading ? (
            <p>Loading bookmarks...</p>
          ) : bookmarks.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No bookmarks yet</CardTitle>
                <CardDescription>
                  Start browsing articles and bookmark the ones you like!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => router.push("/")} variant="outline">
                  Browse Articles
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {bookmarks.map((bookmark) => (
                <Card key={bookmark.id} className="flex flex-col">
                  {bookmark.article_image_url && (
                    <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                      <img
                        src={bookmark.article_image_url}
                        alt={bookmark.article_title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader className="flex-1">
                    <CardTitle className="line-clamp-2 text-lg">
                      {bookmark.article_title}
                    </CardTitle>
                    <CardDescription>
                      Saved on {new Date(bookmark.created_at).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(bookmark.article_url, "_blank")}
                      className="flex-1"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Read Article
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeBookmark(bookmark.article_id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
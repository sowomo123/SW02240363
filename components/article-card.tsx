"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bookmark, BookmarkCheck } from "lucide-react"
import { supabase } from "@/lib/supabase-browser"
import { useState } from "react"
import Link from "next/link"

interface ArticleCardProps {
  article: {
    id: number | string
    title: string
    description?: string
    url: string
    social_image?: string
    user?: {
      name: string
    }
  }
  isBookmarked: boolean
  onBookmarkToggle: (article: any, isBookmarked: boolean) => void
}

export default function ArticleCard({ article, isBookmarked, onBookmarkToggle }: ArticleCardProps) {
  const [bookmarkStatus, setBookmarkStatus] = useState(isBookmarked)
  const [loading, setLoading] = useState(false)

  const handleBookmark = async () => {
    setLoading(true)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      alert("Please sign in to bookmark articles.")
      setLoading(false)
      return
    }

    try {
      if (bookmarkStatus) {
        // Remove bookmark
        const { error } = await supabase
          .from("bookmarks")
          .delete()
          .eq("user_id", user.id)
          .eq("article_id", article.id.toString())

        if (error) throw error
        setBookmarkStatus(false)
        onBookmarkToggle(article, false)
      } else {
        // Add bookmark
        const { error } = await supabase.from("bookmarks").insert({
          user_id: user.id,
          article_id: article.id.toString(),
          article_title: article.title,
          article_url: article.url,
          article_image_url: article.social_image || null,
        })

        if (error) throw error
        setBookmarkStatus(true)
        onBookmarkToggle(article, true)
      }
    } catch (error: any) {
      console.error("Error bookmarking:", error.message)
      alert("Failed to update bookmark. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="flex flex-col h-full">
      {article.social_image && (
        <img
          src={article.social_image || "/placeholder.svg"}
          alt={article.title}
          width={400}
          height={200}
          className="aspect-video w-full rounded-t-lg object-cover"
        />
      )}
      <CardHeader>
        <CardTitle className="text-lg line-clamp-2">{article.title}</CardTitle>
        {article.user?.name && (
          <CardDescription className="text-sm text-muted-foreground">By {article.user.name}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {article.description || "No description available."}
        </p>
      </CardContent>
      <CardFooter className="flex items-center justify-between pt-4">
        <Button variant="outline" size="sm" asChild>
          <Link href={article.url} target="_blank" rel="noopener noreferrer">
            Read More
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBookmark}
          disabled={loading}
          aria-label={bookmarkStatus ? "Remove from bookmarks" : "Add to bookmarks"}
        >
          {bookmarkStatus ? <BookmarkCheck className="w-5 h-5 fill-primary" /> : <Bookmark className="w-5 h-5" />}
        </Button>
      </CardFooter>
    </Card>
  )
}

"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookmarkIcon } from "lucide-react"
import Link from "next/link"
import { toast } from "react-hot-toast"
import { useState, useEffect } from "react"

interface User {
  id: string
  email: string
  name?: string
}

interface ArticleCardProps {
  article: {
    id: number
    title: string
    url: string
    description?: string
    cover_image?: string
    user?: {
      name: string
    }
  }
  isBookmarked?: boolean
  onBookmarkToggle?: (articleId: number, isBookmarked: boolean) => void
}

export default function ArticleCard({
  article,
  isBookmarked: initialIsBookmarked = false,
  onBookmarkToggle,
}: ArticleCardProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const handleBookmark = async () => {
    if (!user) {
      toast.error("Please sign in to bookmark articles.")
      return
    }

    setIsLoading(true)
    try {
      if (isBookmarked) {
        // Remove bookmark
        const res = await fetch(`/api/bookmarks/${article.id}`, {
          method: "DELETE",
        })

        if (res.ok) {
          setIsBookmarked(false)
          toast.success("Bookmark removed!")
          onBookmarkToggle?.(article.id, false)
        } else {
          const errorData = await res.json()
          throw new Error(errorData.message || "Failed to remove bookmark")
        }
      } else {
        // Add bookmark
        const res = await fetch("/api/bookmarks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            articleId: article.id,
            title: article.title,
            url: article.url,
            imageUrl: article.cover_image,
          }),
        })

        if (res.ok) {
          setIsBookmarked(true)
          toast.success("Article bookmarked!")
          onBookmarkToggle?.(article.id, true)
        } else {
          const errorData = await res.json()
          throw new Error(errorData.message || "Failed to add bookmark")
        }
      }
    } catch (error: any) {
      console.error("Bookmark action failed:", error)
      toast.error(error.message || "An error occurred.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="flex flex-col h-full">
      {article.cover_image && (
        <img
          alt={article.title}
          className="w-full h-48 object-cover rounded-t-lg"
          src={article.cover_image || "/placeholder.svg"}
          width={600}
          height={200}
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
      <CardFooter className="flex justify-between items-center pt-4">
        <Link href={article.url} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="sm">
            Read More
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBookmark}
          disabled={isLoading || !user}
          className={isBookmarked ? "text-primary" : ""}
        >
          <BookmarkIcon className={isBookmarked ? "fill-current" : ""} />
          <span className="sr-only">{isBookmarked ? "Remove bookmark" : "Add bookmark"}</span>
        </Button>
      </CardFooter>
    </Card>
  )
}

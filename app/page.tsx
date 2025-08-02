import { createServerClient } from "@/lib/supabase-server"
import AuthForm from "@/components/auth-form"
import Header from "@/components/header"
import ArticleCard from "@/components/article-card"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface Article {
  id: number
  title: string
  description?: string
  url: string
  social_image?: string
  user?: {
    name: string
  }
}

interface Bookmark {
  article_id: string
  article_title: string
  article_url: string
  article_image_url?: string
}

async function fetchArticles(): Promise<Article[]> {
  try {
    const res = await fetch("https://dev.to/api/articles?per_page=24", {
      next: { revalidate: 3600 }, // Revalidate every hour
    })
    if (!res.ok) {
      console.error("Failed to fetch articles:", res.status, res.statusText)
      return []
    }
    return res.json()
  } catch (error) {
    console.error("Error fetching articles:", error)
    return []
  }
}

async function fetchUserBookmarks(userId: string): Promise<Bookmark[]> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from("bookmarks")
    .select("article_id, article_title, article_url, article_image_url")
    .eq("user_id", userId)

  if (error) {
    console.error("Error fetching bookmarks:", error)
    return []
  }
  return data || []
}

export default async function HomePage() {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const articles = await fetchArticles()
  const userBookmarks = user ? await fetchUserBookmarks(user.id) : []

  const bookmarkedArticleIds = new Set(userBookmarks.map((b) => b.article_id))

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-4 md:p-6">
        {!user ? (
          <div className="flex justify-center items-center h-[calc(100vh-100px)]">
            <AuthForm />
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Latest Articles</h2>
            <Suspense
              fallback={
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton key={i} className="h-[300px] w-full rounded-lg" />
                  ))}
                </div>
              }
            >
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {articles.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    isBookmarked={bookmarkedArticleIds.has(article.id.toString())}
                    onBookmarkToggle={async (toggledArticle, isBookmarked) => {
                      "use server"
                      // This is a placeholder for revalidation or direct DB update if needed
                      // For now, the client-side ArticleCard handles the immediate state.
                      // A full re-fetch of bookmarks on toggle might be too heavy.
                      // Consider using Server Actions for more robust bookmarking.
                      console.log(`Article ${toggledArticle.id} bookmark status changed to ${isBookmarked}`)
                    }}
                  />
                ))}
              </div>
            </Suspense>
          </div>
        )}
      </main>
    </div>
  )
}

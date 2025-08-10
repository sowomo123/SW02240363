"use client"

import { useEffect, useState } from "react"
import ArticleCard from "@/components/article-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SearchIcon, RefreshCwIcon, HomeIcon } from "lucide-react"
import Link from "next/link"

interface Article {
  id: number
  title: string
  description: string
  url: string
  cover_image?: string
  published_at: string
  user: {
    name: string
    username: string
    profile_image: string
  }
  tags: string[]
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  const fetchArticles = async (search?: string) => {
    try {
      setIsLoading(true)
      const url = search 
        ? `http://localhost:3001/api/articles/search/${encodeURIComponent(search)}`
        : "http://localhost:3001/api/articles"
      
      const response = await fetch(url)
      
      if (response.ok) {
        const data = await response.json()
        // Handle both the nested structure from backend and direct array
        const articlesArray = data.articles || data
        setArticles(articlesArray)
      } else {
        console.error("Failed to fetch articles:", response.statusText)
        // Fallback to empty array if API fails
        setArticles([])
      }
    } catch (error) {
      console.error("Error fetching articles:", error)
      // Fallback to empty array if API fails
      setArticles([])
    } finally {
      setIsLoading(false)
      setIsSearching(false)
    }
  }

  useEffect(() => {
    fetchArticles()
  }, [])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      setIsSearching(true)
      await fetchArticles(searchTerm.trim())
    }
  }

  const handleRefresh = () => {
    setSearchTerm("")
    fetchArticles()
  }

  if (isLoading) {
    return (
      <div className="bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground flex items-center">
              <HomeIcon className="w-4 h-4 mr-1" />
              Home
            </Link>
            <span>/</span>
            <span className="text-foreground">Articles</span>
          </nav>

          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Latest Articles from Dev.to</h1>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted h-48 rounded-lg mb-4"></div>
                <div className="bg-muted h-4 rounded mb-2"></div>
                <div className="bg-muted h-4 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground flex items-center">
            <HomeIcon className="w-4 h-4 mr-1" />
            Home
          </Link>
          <span>/</span>
          <span className="text-foreground">Articles</span>
        </nav>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Latest Articles from Dev.to</h1>
            <p className="text-muted-foreground mt-2">Discover and bookmark amazing articles from the developer community</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCwIcon className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2 max-w-md">
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={isSearching || !searchTerm.trim()}>
              <SearchIcon className="w-4 h-4 mr-2" />
              {isSearching ? "Searching..." : "Search"}
            </Button>
          </div>
        </form>

        {/* Articles Grid */}
        {articles.length === 0 && !isLoading ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              {searchTerm ? "No articles found for your search." : "No articles available at the moment."}
            </p>
            <Button
              variant="outline"
              onClick={handleRefresh}
              className="mt-4"
            >
              Try Again
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard 
                key={article.id} 
                article={{
                  id: article.id,
                  title: article.title,
                  url: article.url,
                  description: article.description,
                  cover_image: article.cover_image,
                  user: article.user
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

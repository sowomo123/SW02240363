"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="bg-sky-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4 text-black">Welcome</h1>
          <p className="text-xl text-black mb-8">
            Click the button below to start managing your bookmarks
          </p>
          
          <div className="max-w-md mx-auto">
            <Card className="bg-sky-50 border-sky-200">
              <CardHeader>
                <CardTitle className="text-black">Browse Articles</CardTitle>
                <CardDescription className="text-black">
                  Discover content from Dev.to and other sources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/articles">
                  <Button variant="outline" className="w-full border-sky-300 text-black hover:bg-sky-100">Browse Articles</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
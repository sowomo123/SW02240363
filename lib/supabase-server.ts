import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export function createServerClient() {
  const cookieStore = cookies()
  
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: {
        getItem: (key: string) => {
          return cookieStore.get(key)?.value ?? null
        },
        setItem: (key: string, value: string) => {
          cookieStore.set(key, value)
        },
        removeItem: (key: string) => {
          cookieStore.delete(key)
        },
      },
    },
  })
}
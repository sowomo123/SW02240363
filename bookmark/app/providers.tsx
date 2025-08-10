"use client"

import { Toaster } from "react-hot-toast"
import { ReactNode } from "react"

interface ProvidersProps {
  children: ReactNode
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <>
      {children}
      <Toaster position="top-right" />
    </>
  )
}

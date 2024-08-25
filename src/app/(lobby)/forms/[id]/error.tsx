"use client"

import { useEffect } from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"

interface ErrorPageProps {
  error: Error
}

export default function ErrorPage({ error }: ErrorPageProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex size-full flex-col items-center justify-center gap-4">
      <h2 className="text-4xl text-destructive">Something went wrong</h2>
      <Button asChild>
        <Link href={"/"}>Go back to home</Link>
      </Button>
    </div>
  )
}

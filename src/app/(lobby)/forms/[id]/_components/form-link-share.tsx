"use client"

import Link from "next/link"
import { ShareIcon } from "lucide-react"
import { toast } from "sonner"

import { siteConfig } from "@/config/site"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface FormLinkShareProps {
  formId: string
}

export function FormLinkShare({ formId }: FormLinkShareProps) {
  const shareLink = `${siteConfig.url}/submit/${formId}`
  return (
    <div className="flex flex-grow items-center gap-4">
      <Input value={shareLink} readOnly />
      <Button
        className="w-64"
        onClick={() => {
          navigator.clipboard.writeText(shareLink)
          toast.success("Link copied to clipboard")
        }}
      >
        <ShareIcon className="mr-2 size-4" />
        Copy
      </Button>
    </div>
  )
}

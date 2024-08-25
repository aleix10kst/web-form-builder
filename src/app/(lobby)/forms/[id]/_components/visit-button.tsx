import Link from "next/link"

import { siteConfig } from "@/config/site"
import { Button } from "@/components/ui/button"

interface VisitButtonProps {
  formId: string
}

export function VisitButton({ formId }: VisitButtonProps) {
  const href = `${siteConfig.url}/submit/${formId}`
  return (
    <Button asChild>
      <Link href={href} target="_blank">
        Visit
      </Link>
    </Button>
  )
}

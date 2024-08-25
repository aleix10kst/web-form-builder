import { LoaderCircleIcon } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex size-full items-center justify-center">
      <LoaderCircleIcon className="size-12 animate-spin" />
    </div>
  )
}

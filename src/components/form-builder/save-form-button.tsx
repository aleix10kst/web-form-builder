import { useTransition } from "react"
import { LoaderIcon, SaveIcon } from "lucide-react"
import { toast } from "sonner"

import { updateForm } from "@/lib/actions/form"
import { showErrorToast } from "@/lib/handle-error"

import { Button } from "../ui/button"
import { useDesigner } from "./hooks/use-designer"

interface SaveFormButtonProps {
  formId: string
}

export function SaveFormButton({ formId }: SaveFormButtonProps) {
  const { elements } = useDesigner()
  const [loading, startTransition] = useTransition()

  async function updateFormContent() {
    try {
      const jsonElements = JSON.stringify(elements)
      await updateForm(formId, jsonElements)
      toast.success("Your form has been saved!")
    } catch (err) {
      showErrorToast(err)
    }
  }

  return (
    <Button
      variant="outline"
      className="gap-2"
      disabled={loading}
      onClick={() => {
        startTransition(updateFormContent)
      }}
    >
      Save
      <SaveIcon className="size-4" />
      {loading ? <LoaderIcon className="ml-2 size-4 animate-spin" /> : null}
    </Button>
  )
}

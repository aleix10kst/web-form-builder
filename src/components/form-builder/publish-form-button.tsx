import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { LoaderIcon, UploadIcon } from "lucide-react"
import { toast } from "sonner"

import { publishForm } from "@/lib/actions/form"
import { showErrorToast } from "@/lib/handle-error"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog"
import { Button } from "../ui/button"

interface PublishFormButtonProps {
  formId: string
}

export function PublishFormButton({ formId }: PublishFormButtonProps) {
  const [isLoading, startTransition] = useTransition()
  const router = useRouter()

  async function onSubmit() {
    try {
      await publishForm(formId)
      toast.success("Form published successfully")
      router.refresh()
    } catch (err) {
      showErrorToast(err)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 bg-gradient-to-r from-indigo-400 to-cyan-400 text-white"
        >
          Publish
          <UploadIcon className="size-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. After pulishing you will not be able
            to edit this form.
            <br />
            <br />
            <span className="font-medium">
              By publishing this form you will make it available to the public
              and you will be able to collect submissions.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isLoading}
            onClick={(e) => {
              e.preventDefault()
              startTransition(onSubmit)
            }}
          >
            Proceed{" "}
            {isLoading ? (
              <LoaderIcon className="ml-2 size-4 animate-spin" />
            ) : null}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

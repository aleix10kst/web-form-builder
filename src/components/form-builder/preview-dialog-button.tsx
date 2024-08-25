import { Eye } from "lucide-react"

import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { FormElements } from "./form-elements"
import { useDesigner } from "./hooks/use-designer"

interface PreviewDialogButtonProps {}

export function PreviewDialogButton({}: PreviewDialogButtonProps) {
  const { elements } = useDesigner()

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          Preview <Eye className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="flex h-screen max-h-screen w-screen max-w-full flex-grow flex-col">
        <DialogHeader>
          <DialogTitle>Form Preview</DialogTitle>
          <DialogDescription>
            This is how your form will look like to your users
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-grow flex-col items-center justify-center overflow-y-auto bg-accent p-4">
          <div className="flex size-full max-w-[620px] flex-grow flex-col gap-4 overflow-y-auto rounded-2xl bg-background p-8">
            {elements.map((element, index) => {
              const FormComponent = FormElements[element.type].formComponent
              return (
                <FormComponent key={element.id} elementInstance={element} />
              )
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

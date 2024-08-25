import { useDraggable } from "@dnd-kit/core"

import { cn } from "@/lib/utils"

import { Button } from "../ui/button"
import { FormElement } from "./form-elements"

interface SidebarButtonElementProps {
  formElement: FormElement
}

export function SidebarButtonElement({
  formElement,
}: SidebarButtonElementProps) {
  const { label, icon: Icon } = formElement.designerBtnElement
  const draggable = useDraggable({
    id: `designer-button-${formElement.type}`,
    data: {
      type: formElement.type,
      isDesignerBtnElement: true,
    },
  })
  return (
    <Button
      ref={draggable.setNodeRef}
      {...draggable.listeners}
      {...draggable.attributes}
      variant="outline"
      className={cn("flex size-[120px] cursor-grab flex-col", {
        "ring-2 ring-primary": draggable.isDragging,
      })}
    >
      <Icon className="size-8 cursor-grab text-primary" />
      <p className="text-xs">{label}</p>
    </Button>
  )
}

export function SidebarButtonElementOverlay({
  formElement,
}: SidebarButtonElementProps) {
  const { label, icon: Icon } = formElement.designerBtnElement

  return (
    <Button
      variant="outline"
      className={cn("flex size-[120px] cursor-grab flex-col")}
    >
      <Icon className="size-8 cursor-grab text-primary" />
      <p className="text-xs">{label}</p>
    </Button>
  )
}

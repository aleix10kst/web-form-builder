import { useState } from "react"
import { Active, DragOverlay, useDndMonitor } from "@dnd-kit/core"

import { ElementsType, FormElements } from "./form-elements"
import { useDesigner } from "./hooks/use-designer"
import { SidebarButtonElementOverlay } from "./sidebar-button-element"

export function DragOverlayWrapper() {
  const { elements } = useDesigner()
  const [draggedItem, setDraggedItem] = useState<Active | null>(null)
  useDndMonitor({
    onDragStart: (event) => setDraggedItem(event.active),
    onDragCancel: () => setDraggedItem(null),
    onDragEnd: () => setDraggedItem(null),
  })

  if (!draggedItem) {
    return null
  }

  let node = <div>No draggable items</div>
  const isSidebarBtnElement = draggedItem?.data?.current?.isDesignerBtnElement

  if (isSidebarBtnElement) {
    const type = draggedItem?.data?.current?.type as ElementsType
    node = (
      <SidebarButtonElementOverlay formElement={FormElements[type] as any} />
    )
  }

  const isDesignerElement = draggedItem?.data?.current?.isDesignerElement
  if (isDesignerElement) {
    const elementId = draggedItem?.data?.current?.elementId
    const element = elements.find((el) => el.id === elementId)
    if (!element) {
      node = <div>Element not found</div>
    } else {
      const DesignerElementComponent =
        FormElements[element.type].designerComponent

      node = (
        <div className="pointer-events-none flex h-[120px] w-full rounded-md border bg-accent px-4 py-2 opacity-80">
          <DesignerElementComponent elementInstance={element} />
        </div>
      )
    }
  }

  return <DragOverlay>{node}</DragOverlay>
}

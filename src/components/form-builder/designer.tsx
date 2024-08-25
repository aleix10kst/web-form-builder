import { useState } from "react"
import {
  DragEndEvent,
  useDndMonitor,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core"
import { TrashIcon } from "lucide-react"

import { generateId } from "@/lib/id"
import { cn } from "@/lib/utils"

import { Button } from "../ui/button"
import { DesignerSidebar } from "./designer-sidebar"
import {
  ElementsType,
  FormElementInstance,
  FormElements,
} from "./form-elements"
import { useDesigner } from "./hooks/use-designer"

export function Designer() {
  const {
    elements,
    addElement,
    removeElement,
    selectedElement,
    setSelectedElement,
  } = useDesigner()

  const droppable = useDroppable({
    id: "designer-drop-area",
    data: {
      isDesignerDropArea: true,
    },
  })

  useDndMonitor({
    onDragEnd: (event: DragEndEvent) => {
      const { active, over } = event
      if (!active || !over) {
        return
      }

      const isDesignerButtonElement = active.data?.current?.isDesignerBtnElement
      const isDroppingOverDesignerDropArea =
        over.data?.current?.isDesignerDropArea

      const droppingSidebarButtonOverDesignerDropArea =
        isDesignerButtonElement && isDroppingOverDesignerDropArea

      if (droppingSidebarButtonOverDesignerDropArea) {
        const type = active.data?.current?.type
        const newElement =
          FormElements[type as ElementsType].construct(generateId())
        addElement(elements.length, newElement)
        return
      }

      const isDroppingOverDesignerElementTopHalf =
        over.data?.current?.isTopHalfDesignerElement

      const isDroppingOverDesignerElementBottomHalf =
        over.data?.current?.isBottomHalfDesignerElement

      const isDroppingOverDesignerElement =
        isDroppingOverDesignerElementTopHalf ||
        isDroppingOverDesignerElementBottomHalf

      const droppingSidebarButtonOverDesignerElement =
        isDesignerButtonElement && isDroppingOverDesignerElement

      if (droppingSidebarButtonOverDesignerElement) {
        const type = active.data?.current?.type
        const newElement =
          FormElements[type as ElementsType].construct(generateId())
        const elementId = over.data?.current?.elementId
        const elementIndex = elements.findIndex(
          (element) => element.id === elementId
        )
        if (elementIndex === -1) {
          throw new Error("Element not found")
        }

        const indexForNewElement = isDroppingOverDesignerElementTopHalf
          ? elementIndex
          : elementIndex + 1
        addElement(indexForNewElement, newElement)
        return
      }

      const draggingDesignerElementOverDesignerElement =
        active.data?.current?.isDesignerElement && isDroppingOverDesignerElement

      if (draggingDesignerElementOverDesignerElement) {
        const activeId = active.data?.current?.elementId
        const overId = over.data?.current?.elementId

        const activeElementIndex = elements.findIndex(
          (element) => element.id === activeId
        )
        const overElementIndex = elements.findIndex(
          (element) => element.id === overId
        )

        if (activeElementIndex === -1 || overElementIndex === -1) {
          throw new Error("Element not found")
        }

        const activeElement = { ...elements[activeElementIndex] }
        removeElement(activeId)

        const indexForNewElement = isDroppingOverDesignerElementTopHalf
          ? overElementIndex
          : overElementIndex + 1

        addElement(indexForNewElement, activeElement)
        return
      }
    },
  })

  return (
    <div className="flex h-full w-full">
      <div
        className="w-full p-4"
        onClick={() => {
          if (selectedElement) {
            setSelectedElement(null)
          }
        }}
      >
        <div
          ref={droppable.setNodeRef}
          className={cn(
            "m-auto flex h-full max-w-[920px] flex-1 flex-grow flex-col items-center justify-start overflow-y-auto rounded-xl bg-background",
            {
              "ring-4 ring-inset ring-primary": droppable.isOver,
            }
          )}
        >
          {elements.length === 0 &&
            (droppable.isOver ? (
              <div className="w-full p-4">
                <div className="h-[120px] rounded-md bg-primary/20"></div>
              </div>
            ) : (
              <p className="flex flex-grow items-center text-3xl font-bold text-muted-foreground">
                Drop here
              </p>
            ))}

          {elements.length ? (
            <div className="flex w-full flex-col gap-2 p-4">
              {elements.map((element) => (
                <DesignerElementWrapper key={element.id} element={element} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
      <DesignerSidebar />
    </div>
  )
}

interface DesignerElementWrapperProps {
  element: FormElementInstance
}

function DesignerElementWrapper({ element }: DesignerElementWrapperProps) {
  const { removeElement, selectedElement, setSelectedElement } = useDesigner()
  const [mouseIsOver, setMouseIsOver] = useState(false)
  const topHalf = useDroppable({
    id: `${element.id}-top`,
    data: {
      type: element.type,
      elementId: element.id,
      isTopHalfDesignerElement: true,
    },
  })

  const bottomHalf = useDroppable({
    id: `${element.id}-bottom`,
    data: {
      type: element.type,
      elementId: element.id,
      isBottomHalfDesignerElement: true,
    },
  })

  const draggable = useDraggable({
    id: `${element.id}-drag-handler`,
    data: {
      type: element.type,
      elementId: element.id,
      isDesignerElement: true,
    },
  })

  if (draggable.isDragging) {
    return null
  }

  const DesignerElement = FormElements[element.type].designerComponent

  return (
    <div
      ref={draggable.setNodeRef}
      {...draggable.listeners}
      {...draggable.attributes}
      className="relative flex h-[120px] flex-col rounded-md text-foreground ring-1 ring-inset ring-accent hover:cursor-pointer"
      onMouseEnter={() => setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}
      onClick={(e) => {
        e.stopPropagation()
        setSelectedElement(element)
      }}
    >
      <div
        ref={topHalf.setNodeRef}
        className="absolute h-1/2 w-full rounded-t-md"
      ></div>
      <div
        ref={bottomHalf.setNodeRef}
        className="absolute bottom-0 h-1/2 w-full rounded-b-md"
      ></div>
      {mouseIsOver ? (
        <>
          <div className="absolute right-0 h-full">
            <Button
              className="flex h-full justify-center rounded-md rounded-l-none border bg-red-500"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation()
                removeElement(element.id)
              }}
            >
              <TrashIcon className="size-6" />
            </Button>
          </div>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse">
            <p className="text-sm text-muted-foreground">
              Click for properties or drag to move
            </p>
          </div>
        </>
      ) : null}
      {topHalf.isOver && (
        <div className="absolute top-0 h-[4px] w-full rounded-md rounded-b-none bg-primary"></div>
      )}
      <div
        className={cn(
          "pointer-events-none flex h-[120px] w-full items-center rounded-md bg-accent/40 px-4 py-2",
          {
            "opacity-0": mouseIsOver,
            "opacity-100": !mouseIsOver,
          }
        )}
      >
        <DesignerElement elementInstance={element} />
      </div>
      {bottomHalf.isOver && (
        <div className="absolute bottom-0 h-[4px] w-full rounded-md rounded-t-none bg-primary"></div>
      )}
    </div>
  )
}

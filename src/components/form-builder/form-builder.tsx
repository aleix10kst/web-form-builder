"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Form } from "@/db/schema"
import { env } from "@/env"
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { ArrowRightIcon } from "@radix-ui/react-icons"
import { balloons } from "balloons-js"
import { ArrowBigLeftIcon, ArrowLeftCircle, ArrowLeftIcon } from "lucide-react"
import { toast } from "sonner"

import { siteConfig } from "@/config/site"

import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { DesignerContextProvider } from "./context/designer-context"
import { Designer } from "./designer"
import { DragOverlayWrapper } from "./drag-overlay-wrapper"
import { useDesigner } from "./hooks/use-designer"
import { PreviewDialogButton } from "./preview-dialog-button"
import { PublishFormButton } from "./publish-form-button"
import { SaveFormButton } from "./save-form-button"

interface FormBuilderProps {
  form: Form
}

export function FormBuilder({ form }: FormBuilderProps) {
  const { setElements, setSelectedElement } = useDesigner()
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  })

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 300,
      tolerance: 5,
    },
  })

  const sensors = useSensors(mouseSensor, touchSensor)

  useEffect(() => {
    const content = form.content
    if (!content) {
      return
    }
    const elements = JSON.parse(content)
    setElements(elements as any)
    setSelectedElement(null)
  }, [form])

  useEffect(() => {
    if (!form.published) {
      return
    }
    balloons()
  }, [form.published])

  if (form.published) {
    const shareUrl = `${siteConfig.url}/submit/${form.shareUrl}`
    return (
      <>
        <div className="flex size-full flex-col items-center justify-center">
          <div className="max-w-md">
            <h1 className="font-primary mb-10 border-b pb-2 text-center text-4xl font-bold">
              Form published
            </h1>
            <h2 className="text-center text-lg font-medium">Share this form</h2>
            <h3 className="border-b pb-10 text-xl text-muted-foreground">
              Anyone with the link can view and submit the form
            </h3>
            <div className="my-4 flex w-full flex-col items-center gap-4 border-b pb-4">
              <Input className="w-full" value={shareUrl} readOnly />
              <Button
                className="w-full"
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl)
                  toast.success("Link copied to clipboard")
                }}
              >
                Copy link
              </Button>
            </div>
            <div className="flex justify-between">
              <Button variant="link" asChild>
                <Link href="/">
                  <ArrowLeftIcon className="mr-2 size-4" />
                  Go back home
                </Link>
              </Button>
              <Button variant="link" asChild>
                <Link href={`/forms/${form.id}`}>
                  Form details
                  <ArrowRightIcon className="ml-2 size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <DndContext sensors={sensors}>
      <main className="flex w-full flex-col">
        <nav className="flex items-center justify-between gap-3 border-b-2 p-4">
          <h2 className="truncate font-medium">
            <span className="mr-2 text-muted-foreground">Form:</span>
            {form.name}
          </h2>
          <div className="flex items-center gap-2">
            <PreviewDialogButton />
            {form.published ? (
              <Button>Unpublish</Button>
            ) : (
              <>
                <SaveFormButton formId={form.id} />
                <PublishFormButton formId={form.id} />
              </>
            )}
          </div>
        </nav>
        <div className="relative flex h-[200px] w-full flex-grow place-items-center justify-center overflow-y-auto bg-accent bg-[url(/circuit-board.svg)] dark:bg-[url(/circuit-board-dark.svg)]">
          <Designer />
        </div>
      </main>
      <DragOverlayWrapper />
    </DndContext>
  )
}

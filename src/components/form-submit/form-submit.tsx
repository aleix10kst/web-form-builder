"use client"

import { useCallback, useRef, useState, useTransition } from "react"
import { LoaderIcon, MousePointerClickIcon } from "lucide-react"
import { toast } from "sonner"

import { submitForm } from "@/lib/actions/form"
import { showErrorToast } from "@/lib/handle-error"

import {
  FormElementInstance,
  FormElements,
} from "../form-builder/form-elements"
import { Button } from "../ui/button"

interface FormSubmitProps {
  formUrl: string
  content: FormElementInstance[]
}

export function FormSubmit({ formUrl, content }: FormSubmitProps) {
  const formValues = useRef<Record<string, string>>({})
  const formErrors = useRef<Record<string, boolean>>({})
  const [renderKey, setRenderKey] = useState(new Date().getTime())

  const [submitted, setSubmitted] = useState(false)
  const [pending, startTransition] = useTransition()

  const validateForm = useCallback(() => {
    formErrors.current = {}

    content.forEach((element) => {
      const value = formValues.current[element.id]
      const isFieldValid = FormElements[element.type].validate(element, value)

      if (!isFieldValid) {
        formErrors.current[element.id] = true
      }
    })
    return Object.keys(formErrors.current).length > 0
  }, [content])

  const onValueChange = useCallback((key: string, value: string) => {
    formValues.current[key] = value
  }, [])

  async function onSubmit() {
    const isFormValid = validateForm()

    if (!isFormValid) {
      setRenderKey(new Date().getTime())
      showErrorToast("Please fill in all required fields")
    }

    try {
      const jsonContent = JSON.stringify(formValues.current)
      await submitForm(formUrl, jsonContent)
      setSubmitted(true)
      toast.success("Form submitted successfully")
    } catch (error) {
      setSubmitted(false)
      showErrorToast("Failed to submit form")
    }
  }

  if (submitted) {
    return (
      <div className="flex size-full items-center justify-center p-8">
        <div className="flex w-full max-w-screen-md flex-col gap-4 overflow-y-auto rounded border bg-background p-8 shadow-xl shadow-blue-700">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Form submitted successfully</h1>
            <p className="mt-4">
              Thank you for submitting the form. You can close this page now.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex size-full items-center justify-center p-8">
      <div
        className="flex w-full max-w-screen-md flex-col gap-4 overflow-y-auto rounded border bg-background p-8 shadow-xl shadow-blue-700"
        key={renderKey}
      >
        {content.map((element) => {
          const FormElement = FormElements[element.type].formComponent
          return (
            <FormElement
              key={element.id}
              elementInstance={element}
              onValueChange={onValueChange}
              isInvalid={formErrors.current[element.id]}
              defaultValue={formValues.current[element.id]}
            />
          )
        })}
        <div className="mt-8 w-full">
          <Button
            className="w-full"
            disabled={pending}
            onClick={() => onSubmit()}
          >
            Submit
            <MousePointerClickIcon className="ml-2" />
            {pending ? (
              <LoaderIcon className="ml-2 size-4 animate-spin" />
            ) : null}
          </Button>
        </div>
      </div>
    </div>
  )
}

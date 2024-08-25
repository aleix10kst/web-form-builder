import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { CheckIcon } from "@radix-ui/react-icons"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

import {
  ElementsType,
  FormElement,
  FormElementInstance,
  OnValueChangeFunction,
} from "../form-elements"
import { useDesigner } from "../hooks/use-designer"

const type: ElementsType = "CheckboxField"

const extraAttributes = {
  label: "Checkbox",
  helperText: "Helper text",
  required: false,
}

type CustomInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes
}

export const CheckboxFieldFormElement = {
  type,
  construct: (id) => ({
    id,
    type,
    extraAttributes,
  }),
  designerBtnElement: {
    icon: CheckIcon,
    label: "Checkbox",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  validate: (formElement: FormElementInstance, currentValue: string) => {
    const element = formElement as CustomInstance
    const { required } = element.extraAttributes
    if (required && !currentValue) {
      return Boolean(currentValue)
    }
    return true
  },
} satisfies FormElement

function DesignerComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance
}) {
  const element = elementInstance as CustomInstance
  const { label, required, helperText } = element.extraAttributes
  return (
    <div className="items-top flex space-x-2">
      <Checkbox id="designer-checkbox" disabled />
      <div className="grid gap-1.5 leading-none">
        <Label htmlFor="designer-checkbox">
          {label} {required ? "*" : null}
        </Label>
        {helperText && (
          <p className="text-[0.8rem] text-muted-foreground">{helperText}</p>
        )}
      </div>
    </div>
  )
}

function FormComponent({
  elementInstance,
  onValueChange,
  isInvalid,
  defaultValue,
}: {
  elementInstance: FormElementInstance
  onValueChange?: OnValueChangeFunction
  isInvalid?: boolean
  defaultValue?: string
}) {
  const element = elementInstance as CustomInstance
  const { label, required, helperText } = element.extraAttributes

  const [value, setValue] = useState<boolean>(Boolean(defaultValue) || false)
  const [error, setError] = useState(false)

  useEffect(() => {
    setError(isInvalid === true)
  }, [isInvalid])

  return (
    <div className="items-top flex space-x-2">
      <Checkbox
        id={`checkbox-${element.id}`}
        checked={value}
        className={cn({ "border-red-500": error })}
        onCheckedChange={(checked) => {
          setValue(checked as boolean)
          if (onValueChange) {
            const isValid = CheckboxFieldFormElement.validate(
              element,
              checked as boolean
            )
            setError(!isValid)
            if (!isValid) return
            onValueChange(element.id, checked)
          }
        }}
      />
      <div className="grid gap-1.5 leading-none">
        <Label
          htmlFor={`checkbox-${element.id}`}
          className={cn({ "text-red-500": error })}
        >
          {label} {required ? "*" : null}
        </Label>
        {helperText && (
          <p
            className={cn("text-[0.8rem] text-muted-foreground", {
              "text-red-500": error,
            })}
          >
            {helperText}
          </p>
        )}
      </div>
    </div>
  )
}

function PropertiesComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance
}) {
  const element = elementInstance as CustomInstance
  const { updateElement } = useDesigner()
  const form = useForm<CheckboxFieldSchema>({
    resolver: zodResolver(checkboxFieldSchema),
    defaultValues: {
      label: element.extraAttributes.label,
      helperText: element.extraAttributes.helperText,
      required: element.extraAttributes.required,
    },
  })

  useEffect(() => {
    form.reset(element.extraAttributes)
  }, [form, element])

  function onSubmit(data: CheckboxFieldSchema) {
    updateElement(element.id, { ...element, extraAttributes: { ...data } })
  }

  return (
    <Form {...form}>
      <form className="space-y-2" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name="label"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription>Label for the checkbox</FormDescription>
            </FormItem>
          )}
        />
        <FormField
          name="helperText"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Helper text</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription>Helper text for the checkbox</FormDescription>
            </FormItem>
          )}
        />
        <FormField
          name="required"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Required</FormLabel>
                <FormDescription></FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button>Save</Button>
      </form>
    </Form>
  )
}

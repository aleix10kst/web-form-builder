import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { TextIcon } from "@radix-ui/react-icons"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import {
  textAreaFieldSchema,
  TextAreaFieldSchema,
  TextFieldSchema,
} from "@/lib/validations/form-fields"
import { Button } from "@/components/ui/button"
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
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

import {
  ElementsType,
  FormElement,
  FormElementInstance,
  OnValueChangeFunction,
} from "../form-elements"
import { useDesigner } from "../hooks/use-designer"

const type: ElementsType = "TextAreaField"

const extraAttributes = {
  label: "Text area",
  helperText: "Helper text",
  required: false,
  placeholder: "Value here",
  rows: 3,
}

type CustomInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes
}

export const TextAreaFormElement = {
  type,
  construct: (id) => ({
    id,
    type,
    extraAttributes,
  }),
  designerBtnElement: {
    icon: TextIcon,
    label: "TextArea Field",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  validate: (formElement: FormElementInstance, currentValue: string) => {
    const element = formElement as CustomInstance
    const { required } = element.extraAttributes
    if (required && !currentValue) {
      return false
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
  const { label, required, placeholder, helperText } = element.extraAttributes
  return (
    <div className="flex w-full flex-col gap-2">
      <Label>
        {label} {required ? "*" : null}
      </Label>
      <Textarea readOnly disabled placeholder={placeholder} />
      {helperText ? (
        <p className="text-[0.8rem] text-muted-foreground">{helperText}</p>
      ) : null}
    </div>
  )
}

function FormComponent({
  elementInstance,
  onValueChange,
  isInvalid,
  defaultValue = "",
}: {
  elementInstance: FormElementInstance
  onValueChange?: OnValueChangeFunction
  isInvalid?: boolean
  defaultValue?: string
}) {
  const element = elementInstance as CustomInstance
  const { label, required, placeholder, helperText, rows } =
    element.extraAttributes

  const [value, setValue] = useState<string>(defaultValue)
  const [error, setError] = useState(false)

  useEffect(() => {
    setError(isInvalid === true)
  }, [isInvalid])

  return (
    <div className="flex w-full flex-col gap-2">
      <Label className={cn({ "text-red-500": error })}>
        {label} {required ? "*" : null}
      </Label>
      <Textarea
        className={cn({ "border-red-500": error })}
        placeholder={placeholder}
        rows={rows}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => {
          if (onValueChange) {
            const isValid = TextAreaFormElement.validate(element, value)
            setError(!isValid)
            if (!isValid) {
              return
            }
            onValueChange(element.id, value)
          }
        }}
      />
      {helperText ? (
        <p
          className={cn("text-[0.8rem] text-muted-foreground", {
            "text-red-500": error,
          })}
        >
          {helperText}
        </p>
      ) : null}
    </div>
  )
}

export function PropertiesComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance
}) {
  const element = elementInstance as CustomInstance
  const { updateElement, setSelectedElement } = useDesigner()
  const form = useForm<TextAreaFieldSchema>({
    resolver: zodResolver(textAreaFieldSchema),
    defaultValues: {
      label: element.extraAttributes.label,
      placeholder: element.extraAttributes.placeholder,
      helperText: element.extraAttributes.helperText,
      required: element.extraAttributes.required,
      rows: element.extraAttributes.rows,
    },
  })

  useEffect(() => {
    form.reset(element.extraAttributes)
  }, [form, element])

  function onSubmit(data: TextFieldSchema) {
    updateElement(element.id, { ...element, extraAttributes: { ...data } })
    toast.success("TextArea field updated successfully")
    setSelectedElement(null)
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
              <FormDescription>Label for the text field</FormDescription>
            </FormItem>
          )}
        />
        <FormField
          name="placeholder"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Placeholder</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription>Placeholder for the text field</FormDescription>
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
              <FormDescription>Helper text for the text field</FormDescription>
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
        <FormField
          name="rows"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rows: {form.watch("rows")}</FormLabel>
              <FormControl>
                <Slider
                  defaultValue={[field.value]}
                  min={1}
                  max={10}
                  step={1}
                  onValueChange={(value) => field.onChange(value[0])}
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

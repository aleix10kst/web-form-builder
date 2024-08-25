import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import { CrossIcon, PlusIcon, ShieldCloseIcon, XCircleIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { cn } from "@/lib/utils"
import {
  SelectFieldSchema,
  selectFieldSchema,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"

import {
  ElementsType,
  FormElement,
  FormElementInstance,
  OnValueChangeFunction,
} from "../form-elements"
import { useDesigner } from "../hooks/use-designer"

const type: ElementsType = "SelectField"

const extraAttributes = {
  label: "Select field",
  helperText: "Helper text",
  required: false,
  placeholder: "Select an option",
  options: ["Option 1", "Option 2", "Option 3"],
}

type CustomInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes
}

export const SelectFieldFormElement = {
  type,
  construct: (id) => ({
    id,
    type,
    extraAttributes,
  }),
  designerBtnElement: {
    icon: CaretSortIcon,
    label: "Select",
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
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
      </Select>
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
  const { label, required, placeholder, helperText, options } =
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
      <Select
        value={value}
        onValueChange={(newValue) => {
          setValue(newValue)
          if (onValueChange) {
            const isValid = SelectFieldFormElement.validate(element, newValue)
            setError(!isValid)
            if (!isValid) {
              return
            }
            onValueChange(element.id, newValue)
          }
        }}
      >
        <SelectTrigger className={cn({ "border-red-500": error })}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
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

function PropertiesComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance
}) {
  const element = elementInstance as CustomInstance
  const { updateElement, setSelectedElement } = useDesigner()
  const form = useForm<SelectFieldSchema>({
    resolver: zodResolver(selectFieldSchema),
    defaultValues: {
      label: element.extraAttributes.label,
      helperText: element.extraAttributes.helperText,
      required: element.extraAttributes.required,
      placeholder: element.extraAttributes.placeholder,
      options: element.extraAttributes.options,
    },
  })

  useEffect(() => {
    form.reset(element.extraAttributes)
  }, [form, element])

  function onSubmit(data: SelectFieldSchema) {
    updateElement(element.id, { ...element, extraAttributes: { ...data } })
    toast.success("Select field updated")
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
              <FormDescription>Label for the select field</FormDescription>
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
              <FormDescription>
                Placeholder for the select field
              </FormDescription>
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
              <FormDescription>
                Helper text for the select field
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          name="options"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Options</FormLabel>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={(e) => {
                    e.preventDefault()
                    form.setValue("options", field.value.concat("New option"))
                  }}
                >
                  {" "}
                  <PlusIcon />
                  Add
                </Button>
              </div>
              <div className="flex flex-col gap-2">
                {form.watch("options").map((option, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-1"
                  >
                    <Input
                      placeholder=""
                      value={option}
                      onChange={(e) => {
                        field.value[index] = e.target.value
                        field.onChange(field.value)
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.preventDefault()
                        const newOptions = field.value.filter(
                          (_, i) => i !== index
                        )
                        field.onChange(newOptions)
                      }}
                    >
                      <XCircleIcon />
                    </Button>
                  </div>
                ))}
              </div>

              <FormMessage />
              <FormDescription>Comma-separated list of options</FormDescription>
            </FormItem>
          )}
        />
        <Separator />
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
        <Button className="w-full">Save</Button>
      </form>
    </Form>
  )
}

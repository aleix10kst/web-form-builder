import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { TextIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useForm } from "react-hook-form"

import { cn } from "@/lib/utils"
import {
  dateFieldSchema,
  DateFieldSchema,
  textFieldSchema,
  TextFieldSchema,
} from "@/lib/validations/form-fields"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"

import {
  ElementsType,
  FormElement,
  FormElementInstance,
  OnValueChangeFunction,
} from "../form-elements"
import { useDesigner } from "../hooks/use-designer"

const type: ElementsType = "DateField"

const extraAttributes = {
  label: "Date field",
  helperText: "Pick a date",
  required: false,
}

type CustomInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes
}

export const DateFieldFormElement = {
  type,
  construct: (id) => ({
    id,
    type,
    extraAttributes,
  }),
  designerBtnElement: {
    icon: CalendarIcon,
    label: "Date Field",
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
  const { label, required, helperText } = element.extraAttributes
  return (
    <div className="flex w-full flex-col gap-2">
      <Label>
        {label} {required ? "*" : null}
      </Label>
      <Button
        variant="outline"
        className="w-full justify-start text-left font-normal"
      >
        <CalendarIcon className="mr-2 h-4 w-4" /> <span>Pick a date</span>
      </Button>
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
  defaultValue,
}: {
  elementInstance: FormElementInstance
  onValueChange?: OnValueChangeFunction
  isInvalid?: boolean
  defaultValue?: string
}) {
  const element = elementInstance as CustomInstance
  const { label, required, helperText } = element.extraAttributes

  const [date, setDate] = useState<Date | undefined>(
    defaultValue ? new Date(defaultValue) : undefined
  )
  const [error, setError] = useState(false)

  useEffect(() => {
    setError(isInvalid === true)
  }, [isInvalid])

  return (
    <div className="flex w-full flex-col gap-2">
      <Label className={cn({ "text-red-500": error })}>
        {label} {required ? "*" : null}
      </Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn("w-full justify-start text-left font-normal", {
              "text-muted-foreground": !date,
              "border-red-500": error,
            })}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />{" "}
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(date: Date) => {
              setDate(date)

              if (!onValueChange) {
                return
              }
              const value = date.toUTCString() ?? ""
              const isValid = DateFieldFormElement.validate(element, value)
              setError(!isValid)
              onValueChange(element.id, value)
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
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
  const { updateElement } = useDesigner()
  const form = useForm<DateFieldSchema>({
    resolver: zodResolver(dateFieldSchema),
    defaultValues: {
      label: element.extraAttributes.label,
      helperText: element.extraAttributes.helperText,
      required: element.extraAttributes.required,
    },
  })

  useEffect(() => {
    form.reset(element.extraAttributes)
  }, [form, element])

  function onSubmit(data: DateFieldSchema) {
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
              <FormDescription>Label for the text field</FormDescription>
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
        <Button>Save</Button>
      </form>
    </Form>
  )
}

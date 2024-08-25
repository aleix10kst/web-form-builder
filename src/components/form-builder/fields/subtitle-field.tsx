import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { TextIcon } from "@radix-ui/react-icons"
import { Heading1, Heading2, HeadingIcon } from "lucide-react"
import { useForm } from "react-hook-form"

import { cn } from "@/lib/utils"
import {
  textFieldSchema,
  TextFieldSchema,
  TitleFieldSchema,
  titleFieldSchema,
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
import { Switch } from "@/components/ui/switch"

import {
  ElementsType,
  FormElement,
  FormElementInstance,
  OnValueChangeFunction,
} from "../form-elements"
import { useDesigner } from "../hooks/use-designer"

const type: ElementsType = "SubtitleField"

const extraAttributes = {
  title: "Subtitle field",
}

type CustomInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes
}

export const SubtitleFieldFormElement = {
  type,
  construct: (id) => ({
    id,
    type,
    extraAttributes,
  }),
  designerBtnElement: {
    icon: Heading2,
    label: "Subtitle Field",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  validate: () => true,
} satisfies FormElement

function DesignerComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance
}) {
  const element = elementInstance as CustomInstance
  const { title } = element.extraAttributes
  return (
    <div className="flex w-full flex-col gap-2">
      <Label className="text-muted-foreground">Subtitle field</Label>
      <p className="text-xl">{title}</p>
    </div>
  )
}

function FormComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance
}) {
  const element = elementInstance as CustomInstance
  const { title } = element.extraAttributes

  return <p className="text-lg">{title}</p>
}

export function PropertiesComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance
}) {
  const element = elementInstance as CustomInstance
  const { updateElement } = useDesigner()
  const form = useForm<TitleFieldSchema>({
    resolver: zodResolver(titleFieldSchema),
    defaultValues: {
      title: element.extraAttributes.title,
    },
  })

  useEffect(() => {
    form.reset(element.extraAttributes)
  }, [form, element])

  function onSubmit(data: TitleFieldSchema) {
    updateElement(element.id, { ...element, extraAttributes: { ...data } })
  }

  return (
    <Form {...form}>
      <form className="space-y-2" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name="title"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subtitle</FormLabel>
              <FormControl>
                <Input {...field} />
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

import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { TextIcon } from "@radix-ui/react-icons"
import { useForm } from "react-hook-form"

import {
  paragraphFieldSchema,
  ParagraphFieldSchema,
  textFieldSchema,
} from "@/lib/validations/form-fields"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import {
  ElementsType,
  FormElement,
  FormElementInstance,
} from "../form-elements"
import { useDesigner } from "../hooks/use-designer"

const type: ElementsType = "ParagraphField"

const extraAttributes = {
  text: "Paragraph field",
}

type CustomInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes
}

export const ParagraphFieldFormElement = {
  type,
  construct: (id) => ({
    id,
    type,
    extraAttributes,
  }),
  designerBtnElement: {
    icon: TextIcon,
    label: "Paragraph Field",
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
  const { text } = element.extraAttributes
  return (
    <div className="flex w-full flex-col gap-2">
      <Label className="text-muted-foreground">Paragraph field</Label>
      <p className="text-xl">{text}</p>
    </div>
  )
}

function FormComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance
}) {
  const element = elementInstance as CustomInstance
  const { text } = element.extraAttributes

  return <p>{text}</p>
}

export function PropertiesComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance
}) {
  const element = elementInstance as CustomInstance
  const { updateElement } = useDesigner()
  const form = useForm<ParagraphFieldSchema>({
    resolver: zodResolver(paragraphFieldSchema),
    defaultValues: {
      text: element.extraAttributes.text,
    },
  })

  useEffect(() => {
    form.reset(element.extraAttributes)
  }, [form, element])

  function onSubmit(data: ParagraphFieldSchema) {
    updateElement(element.id, { ...element, extraAttributes: { ...data } })
  }

  return (
    <Form {...form}>
      <form className="space-y-2" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name="text"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Paragraph</FormLabel>
              <FormControl>
                <Textarea {...field} />
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

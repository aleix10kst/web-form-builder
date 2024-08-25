import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Heading1Icon } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import {
  TitleFieldSchema,
  titleFieldSchema,
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

import {
  ElementsType,
  FormElement,
  FormElementInstance,
} from "../form-elements"
import { useDesigner } from "../hooks/use-designer"

const type: ElementsType = "TitleField"

const extraAttributes = {
  title: "Title field",
}

type CustomInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes
}

export const TitleFieldFormElement = {
  type,
  construct: (id) => ({
    id,
    type,
    extraAttributes,
  }),
  designerBtnElement: {
    icon: Heading1Icon,
    label: "Title Field",
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
      <Label className="text-muted-foreground">Title field</Label>
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

  return <p className="text-xl">{title}</p>
}

export function PropertiesComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance
}) {
  const element = elementInstance as CustomInstance
  const { updateElement, setSelectedElement } = useDesigner()
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
    toast.success("Title field updated successfully")
    setSelectedElement(null)
  }

  return (
    <Form {...form}>
      <form className="space-y-2" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name="title"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
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

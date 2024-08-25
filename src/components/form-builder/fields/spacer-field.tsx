import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Heading1Icon, SeparatorHorizontalIcon } from "lucide-react"
import { useForm } from "react-hook-form"

import {
  SpacerFieldSchema,
  spacerFieldSchema,
  TitleFieldSchema,
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
import { Slider } from "@/components/ui/slider"

import {
  ElementsType,
  FormElement,
  FormElementInstance,
} from "../form-elements"
import { useDesigner } from "../hooks/use-designer"

const type: ElementsType = "SpacerField"

const extraAttributes = {
  height: 20,
}

type CustomInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes
}

export const SpacerFieldFormElement = {
  type,
  construct: (id) => ({
    id,
    type,
    extraAttributes,
  }),
  designerBtnElement: {
    icon: SeparatorHorizontalIcon,
    label: "Spacer Field",
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
  const { height } = element.extraAttributes
  return (
    <div className="flex w-full flex-col items-center gap-2">
      <Label className="text-muted-foreground">Spacer field: {height}px</Label>
      <SeparatorHorizontalIcon className="size-8" />
    </div>
  )
}

function FormComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance
}) {
  const element = elementInstance as CustomInstance
  const { height } = element.extraAttributes

  return <div style={{ height, width: "100%" }} />
}

export function PropertiesComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance
}) {
  const element = elementInstance as CustomInstance
  const { updateElement } = useDesigner()
  const form = useForm<SpacerFieldSchema>({
    resolver: zodResolver(spacerFieldSchema),
    defaultValues: {
      height: element.extraAttributes.height,
    },
  })

  useEffect(() => {
    form.reset(element.extraAttributes)
  }, [form, element])

  function onSubmit(data: SpacerFieldSchema) {
    updateElement(element.id, { ...element, extraAttributes: { ...data } })
  }

  return (
    <Form {...form}>
      <form className="space-y-2" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name="height"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Height (px): {form.watch("height")}</FormLabel>
              <FormControl className="pt-2">
                <Slider
                  defaultValue={[field.value]}
                  min={5}
                  max={200}
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

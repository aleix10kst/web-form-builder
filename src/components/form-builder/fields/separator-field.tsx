import { SeparatorHorizontalIcon } from "lucide-react"

import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

import { ElementsType, FormElement } from "../form-elements"

const type: ElementsType = "SeparatorField"

export const SeparatorFieldFormElement = {
  type,
  construct: (id) => ({
    id,
    type,
  }),
  designerBtnElement: {
    icon: SeparatorHorizontalIcon,
    label: "Separator Field",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  validate: () => true,
} satisfies FormElement

function DesignerComponent() {
  return (
    <div className="flex w-full flex-col gap-2">
      <Label className="text-muted-foreground">Separator field</Label>
      <Separator />
    </div>
  )
}

function FormComponent() {
  return <Separator />
}

export function PropertiesComponent() {
  return <p>No properties for this element</p>
}

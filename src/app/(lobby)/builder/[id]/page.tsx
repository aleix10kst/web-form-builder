import { getFormById } from "@/lib/queries/form"
import { DesignerContextProvider } from "@/components/form-builder/context/designer-context"
import { FormBuilder } from "@/components/form-builder/form-builder"

interface BuilderPageProps {
  params: { id: string }
}

export default async function BuilderPage({ params }: BuilderPageProps) {
  const { id } = params

  const form = await getFormById(id)

  if (!form) {
    throw new Error("Form not found")
  }
  return (
    <DesignerContextProvider>
      <FormBuilder form={form} />
    </DesignerContextProvider>
  )
}

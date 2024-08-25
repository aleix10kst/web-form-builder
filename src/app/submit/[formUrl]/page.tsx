import { getFormBySharableId } from "@/lib/queries/form"
import { FormElementInstance } from "@/components/form-builder/form-elements"
import { FormSubmit } from "@/components/form-submit/form-submit"

interface SubmitFormPageProps {
  params: {
    formUrl: string
  }
}

export default async function SubmitFormPage({ params }: SubmitFormPageProps) {
  const form = await getFormBySharableId(params.formUrl)

  if (!form) {
    throw new Error("Form not found")
  }

  const { content } = form

  if (!content) {
    throw new Error("Form content not found")
  }

  return (
    <FormSubmit
      formUrl={params.formUrl}
      content={JSON.parse(content) as FormElementInstance[]}
    />
  )
}

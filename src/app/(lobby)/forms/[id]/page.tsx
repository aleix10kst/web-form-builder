import { ReactNode } from "react"
import { format, formatDistance } from "date-fns"
import {
  ArrowDown,
  EyeIcon,
  FormInputIcon,
  MousePointerClickIcon,
} from "lucide-react"

import { getFormById, getFormWithSubmissions } from "@/lib/queries/form"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ElementsType,
  FormElementInstance,
} from "@/components/form-builder/form-elements"
import { StatsCard } from "@/components/stats-card"

import { FormLinkShare } from "./_components/form-link-share"
import { VisitButton } from "./_components/visit-button"

interface BuilderPageProps {
  params: { id: string }
}

export default async function FormPage({ params }: BuilderPageProps) {
  const { id } = params

  const form = await getFormById(id)

  if (!form) {
    throw new Error("Form not found")
  }

  const { visits, submissions } = form

  const submissionRate = visits ? (submissions / visits) * 100 : 0
  const bounceRate = visits ? ((visits - submissions) / visits) * 100 : 0

  return (
    <>
      <div className="border-b border-muted py-10">
        <div className="container flex justify-between">
          <h1 className="truncate text-4xl font-bold">{form.name}</h1>
          <VisitButton formId={form.shareUrl} />
        </div>
      </div>{" "}
      <div className="border-b border-muted py-4">
        <div className="container flex items-center justify-between gap-2">
          <FormLinkShare formId={form.shareUrl} />
        </div>
      </div>
      <div className="container grid w-full grid-cols-1 gap-4 pt-8 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total visits"
          helperText="All time form visits"
          value={visits.toString() ?? ""}
          loading={false}
          icon={<EyeIcon className="text-blue-600" />}
          className="shadow-md shadow-blue-600"
        />
        <StatsCard
          title="Total Submissions"
          helperText="All time form submissions"
          value={submissions.toString() ?? ""}
          loading={false}
          icon={<FormInputIcon className="text-yellow-600" />}
          className="shadow-md shadow-yellow-600"
        />
        <StatsCard
          title="Submission rate"
          helperText="Visits that result in form submission"
          value={submissionRate.toString() ?? ""}
          loading={false}
          icon={<MousePointerClickIcon className="text-green-600" />}
          className="shadow-md shadow-green-600"
        />
        <StatsCard
          title="Bounce rate"
          helperText="Visits that leave without interacting"
          value={bounceRate.toString() ?? ""}
          loading={false}
          icon={<ArrowDown className="text-red-600" />}
          className="shadow-md shadow-red-600"
        />
      </div>
      <div className="container pt-10">
        <SubmissionsTable formId={form.id} />
      </div>
    </>
  )
}

type Row = Record<string, string> & { submittedAt: string }

export async function SubmissionsTable({ formId }: { formId: string }) {
  const form = await getFormWithSubmissions(formId)

  if (!form) {
    throw new Error("Form not found")
  }

  const formElements = JSON.parse(form.content) as FormElementInstance[]
  const columns: {
    id: string
    label: string
    required: boolean
    type: ElementsType
  }[] = []

  formElements.forEach((element) => {
    switch (element.type) {
      case "TextField":
      case "NumberField":
      case "TextAreaField":
      case "DateField":
      case "SelectField":
      case "CheckboxField":
        columns.push({
          id: element.id,
          label: element.extraAttributes?.label,
          required: element.extraAttributes?.required,
          type: element.type,
        })
        break
      default:
        break
    }
  })

  const rows: Row[] = []
  form.formSubmissions.forEach((submission) => {
    const content = JSON.parse(submission.content) as Record<string, string>
    rows.push({
      ...content,
      submittedAt: new Date(submission.createdAt).toLocaleString(),
    })
  })

  return (
    <>
      <h1 className="my-4 text-2xl font-bold">Submissions</h1>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.id} className="uppercase">
                  {column.label}
                </TableHead>
              ))}
              <TableHead className="text-right uppercase text-muted-foreground">
                Submitted at
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <RowCell
                    key={column.id}
                    type={column.type}
                    value={row[column.id]}
                  />
                ))}
                <TableCell className="text-right text-muted-foreground">
                  {formatDistance(row.submittedAt, new Date(), {
                    addSuffix: true,
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}

function RowCell({ type, value }: { type: ElementsType; value: string }) {
  let node: ReactNode = value

  switch (type) {
    case "CheckboxField":
      node = <Checkbox checked={value === "true"} disabled />
      break
    case "DateField":
      node = value ? (
        <Badge variant="outline">{format(new Date(value), "dd/MM/yyyy")}</Badge>
      ) : (
        value
      )
      break
    default:
      break
  }
  return <TableCell>{node}</TableCell>
}

import { ComponentProps, ReactNode, Suspense } from "react"
import Link from "next/link"
import { Form } from "@/db/schema"
import { ArrowRightIcon, CursorArrowIcon } from "@radix-ui/react-icons"
import { formatDistance } from "date-fns"
import {
  ArrowDown,
  EyeIcon,
  FormInputIcon,
  MousePointerClickIcon,
  PencilIcon,
  TextCursorInput,
  ViewIcon,
} from "lucide-react"

import { getForms, getFormStats } from "@/lib/queries/form"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { CreateFormButton } from "@/components/create-form-button"
import { StatsCard } from "@/components/stats-card"

export default function Home() {
  return (
    <div className="container pt-4">
      <Suspense fallback={<StatsCards loading />}>
        <CardStatsWrapper />
      </Suspense>
      <Separator className="my-6" />
      <h2 className="col-span-2 text-4xl font-bold">Your forms</h2>
      <Separator className="my-6" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <CreateFormButton />
        <Suspense
          fallback={[1, 2, 3, 4].map((value) => (
            <FormCardSkeleton key={value} />
          ))}
        >
          <FormCards />
        </Suspense>
      </div>
    </div>
  )
}

export async function CardStatsWrapper() {
  const stats = await getFormStats()
  return <StatsCards data={stats} loading={false} />
}

interface StatsCardsProps {
  data?: Awaited<ReturnType<typeof getFormStats>>
  loading: boolean
}

export function StatsCards({ data, loading }: StatsCardsProps) {
  return (
    <div className="grid w-full grid-cols-1 gap-4 pt-8 sm:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total visits"
        helperText="All time form visits"
        value={data?.visits.toString() ?? ""}
        loading={loading}
        icon={<EyeIcon className="text-blue-600" />}
        className="shadow-md shadow-blue-600"
      />
      <StatsCard
        title="Total Submissions"
        helperText="All time form submissions"
        value={data?.submissions.toString() ?? ""}
        loading={loading}
        icon={<FormInputIcon className="text-yellow-600" />}
        className="shadow-md shadow-yellow-600"
      />
      <StatsCard
        title="Submission rate"
        helperText="Visits that result in form submission"
        value={data?.submissionRate.toString() ?? ""}
        loading={loading}
        icon={<MousePointerClickIcon className="text-green-600" />}
        className="shadow-md shadow-green-600"
      />
      <StatsCard
        title="Bounce rate"
        helperText="Visits that leave without interacting"
        value={data?.submissions.toString() ?? ""}
        loading={loading}
        icon={<ArrowDown className="text-red-600" />}
        className="shadow-md shadow-red-600"
      />
    </div>
  )
}

function FormCardSkeleton() {
  return (
    <Skeleton className="h-[190px] w-full border-2 border-primary/20"></Skeleton>
  )
}

async function FormCards() {
  const forms = await getForms()

  return (
    <>
      {forms.map((form) => (
        <FormCard key={form.id} form={form} />
      ))}
    </>
  )
}

interface FormCardProps {
  form: Form
}

function FormCard({ form }: FormCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          <span className="truncate font-bold">{form.name}</span>
          {form.published ? (
            <Badge>Published</Badge>
          ) : (
            <Badge variant="destructive">Draft</Badge>
          )}
        </CardTitle>
        <CardDescription className="flex items-center justify-between text-sm text-muted-foreground">
          {formatDistance(form.createdAt, new Date(), { addSuffix: true })}
          {!form.published ? (
            <span className="flex items-center gap-2">
              <ViewIcon className="text-muted-foreground" />
              <span>{form.visits?.toLocaleString()}</span>
              <FormInputIcon className="text-muted-foreground" />
              <span>{form.submissions?.toLocaleString()}</span>
            </span>
          ) : null}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[20px] truncate text-sm text-muted-foreground">
        {form.description ?? "No description"}
      </CardContent>
      <CardFooter>
        {form.published ? (
          <Button className="text-md mt-2 w-full gap-4" asChild>
            <Link href={`/forms/${form.id}`}>
              View submissions <ArrowRightIcon />
            </Link>
          </Button>
        ) : (
          <Button
            className="text-md mt-2 w-full gap-4"
            variant="secondary"
            asChild
          >
            <Link href={`/builder/${form.id}`}>
              Edit form <PencilIcon />
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

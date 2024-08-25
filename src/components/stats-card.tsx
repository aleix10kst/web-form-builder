import { ComponentProps, ReactNode } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Skeleton } from "./ui/skeleton"

interface StatsCardProps extends ComponentProps<"div"> {
  title: string
  helperText: string
  icon: ReactNode
  value: string
  loading: boolean
}

export function StatsCard({
  title,
  icon,
  helperText,
  value,
  loading,
  ...props
}: StatsCardProps) {
  return (
    <Card {...props}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="textg-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {loading ? (
            <Skeleton>
              <span className="opacity-0">0</span>
            </Skeleton>
          ) : (
            value
          )}
        </div>
        <p className="pt-1 text-xs text-muted-foreground">{helperText}</p>
      </CardContent>
    </Card>
  )
}

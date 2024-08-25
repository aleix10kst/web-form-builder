import { PropsWithChildren } from "react"

export default async function BuilderLayout({ children }: PropsWithChildren) {
  return (
    <div className="mx-auto flex w-full flex-grow flex-col">{children}</div>
  )
}

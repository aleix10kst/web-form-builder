import { PropsWithChildren } from "react"

export default async function BuilderLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex h-full h-screen max-h-screen min-h-screen min-w-full flex-col bg-background">
      <main className="flex w-full flex-grow">{children}</main>
    </div>
  )
}

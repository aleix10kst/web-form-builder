import { SiteFooter } from "@/components/layouts/site-footer"
import { SiteHeader } from "@/components/layouts/site-header"

type LobbyLayoutProps = {
  children: React.ReactNode
}

export default async function LobbyLayout({ children }: LobbyLayoutProps) {
  return (
    <div className="flex h-full max-h-screen min-h-screen min-w-full flex-col bg-background">
      <SiteHeader />
      <main className="flex w-full flex-grow">{children}</main>
    </div>
  )
}

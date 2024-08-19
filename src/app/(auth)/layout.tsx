import { PropsWithChildren } from "react"
import Image from "next/image"

export default async function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className="relative grid min-h-screen grid-cols-1 overflow-hidden p-16 lg:grid-cols-2">
      <div className="relative order-2 aspect-video size-full lg:order-1">
        <Image
          src="/images/auth-layout.webp"
          alt="A skateboarder dropping into a bowl"
          fill
          className="absolute inset-0 rounded-3xl object-cover"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute bottom-4 right-4 z-20 line-clamp-1 rounded-md bg-muted px-3 py-1.5 text-sm text-muted-foreground">
          Photo by{" "}
          <a
            href="https://unsplash.com/@sashamatic?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
            className="underline transition-colors hover:text-foreground"
          >
            Sasha Matic
          </a>{" "}
          on{" "}
          <a
            href="https://unsplash.com/photos/an-aerial-view-of-a-road-next-to-a-body-of-water-Ie7yEetEIeE?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
            className="underline transition-colors hover:text-foreground"
          >
            Unsplash
          </a>
        </div>
      </div>

      <main className="absolute right-1/2 top-1/2 order-1 flex w-full -translate-x-1/2 -translate-y-1/2 items-center lg:static lg:right-0 lg:top-0 lg:order-2 lg:flex lg:translate-x-0 lg:translate-y-0">
        {children}
      </main>
    </div>
  )
}

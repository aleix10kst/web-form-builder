"use client"

import { useState } from "react"

import { showErrorToast } from "@/lib/handle-error"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

type OAuthProviders = "google" | "github" | "twitter" | "facebook"

const oatuhProviders = [
  { name: "Google", strategy: "google", icon: "google" },
  { name: "Facebook", strategy: "facebook", icon: "facebook" },
  { name: "Twitter", strategy: "twitter", icon: "x" },
] satisfies {
  name: string
  icon: keyof typeof Icons
  strategy: OAuthProviders
}[]

export function OAuthSignIn() {
  const [loading, setLoading] = useState<OAuthProviders | null>(null)

  function oauthSignIn(provider: OAuthProviders) {
    try {
      setLoading(provider)
      console.log("Mocked OAuth Sign In", provider)
    } catch (err) {
      setLoading(null)
      showErrorToast(err)
    }
  }

  return (
    <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
      {oatuhProviders.map((provider) => {
        const Icon = Icons[provider.icon]

        return (
          <Button
            key={provider.strategy}
            variant="outline"
            className="w-full bg-background"
            onClick={() => oauthSignIn(provider.strategy)}
            disabled={loading !== null}
          >
            {loading === provider.strategy ? (
              <Icons.spinner
                className="mr-2 size-4 animate-spin"
                aria-hidden="true"
              />
            ) : (
              <Icon className="mr-2 size-4" aria-hidden="true" />
            )}
            {provider.name}
            <span className="sr-only">{provider.name}</span>
          </Button>
        )
      })}
    </div>
  )
}

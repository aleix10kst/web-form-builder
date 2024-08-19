import { Metadata } from "next"
import Link from "next/link"

import { siteConfig } from "@/config/site"
import { Shell } from "@/components/shell"

import { OAuthSignIn } from "../_components/oauth-signin"
import { SignInForm } from "../_components/signin-form"

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: "Sign in",
  description: "Sign in to your account",
}

export default async function SignInPage() {
  return (
    <Shell className="max-w-lg">
      <div className="mb-4 text-center">
        <h1 className="text-3xl font-semibold md:text-4xl">
          Welcome to {siteConfig.name}
        </h1>
      </div>
      <div className="grid gap-4">
        <OAuthSignIn />
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <SignInForm />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm text-muted-foreground">
          <span className="mr-1 hidden sm:inline-block">
            Don&apos;t have an account?
          </span>
          <Link
            aria-label="Sign up"
            href="/signup"
            className="text-primary underline-offset-4 transition-colors hover:underline"
          >
            Sign up
          </Link>
        </div>
        <Link
          aria-label="Reset password"
          href="/signin/reset-password"
          className="text-sm text-primary underline-offset-4 transition-colors hover:underline"
        >
          Reset password
        </Link>
      </div>
    </Shell>
  )
}

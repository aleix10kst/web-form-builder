import { NextRequest, NextResponse } from "next/server"
import { env } from "@/env"
import { SignJWT } from "jose"
import { nanoid } from "nanoid"

export const runtime = "edge"
export const revalidate = 0

export async function GET(request: NextRequest) {
  const ip = request.ip ?? "127.0.0.1"
  const userAgent = request.headers.get("user-agent") ?? "unknown"
  const isIOS = /iPad|iPhone|iPod/.test(userAgent)

  const token = await new SignJWT({ ip, isIOS })
    .setProtectedHeader({ alg: "HS256" })
    .setJti(nanoid())
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(new TextEncoder().encode(env.API_SECRET))

  return NextResponse.json({ token }, { status: 200 })
}

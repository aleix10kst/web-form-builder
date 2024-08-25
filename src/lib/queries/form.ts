"use server"

import { db } from "@/db"
import { forms } from "@/db/schema"
import { and, count, eq, sql } from "drizzle-orm"

import { getCachedUser } from "./user"

class UserNotFoundError extends Error {}

export async function getFormStats() {
  const user = await getCachedUser()

  if (!user) {
    throw new UserNotFoundError("User not found")
  }

  const stats = await db
    .select({
      visits: count(forms.visits),
      submissions: count(forms.submissions),
    })
    .from(forms)
    .where(eq(forms.userId, user.id))
    .then((rows) => rows[0])

  const visits = stats.visits
  const submissions = stats.submissions

  const submissionRate = visits ? (submissions / visits) * 100 : 0
  const bounceRate = visits ? ((visits - submissions) / visits) * 100 : 0

  return {
    visits,
    submissions,
    submissionRate,
    bounceRate,
  }
}

export async function getForms() {
  const user = await getCachedUser()

  if (!user) {
    throw new UserNotFoundError("User not found")
  }

  const result = await db.query.forms.findMany({
    where: eq(forms.userId, user.id),
    orderBy: (forms, { desc }) => [desc(forms.createdAt)],
  })

  return result
}

export async function getFormById(formId: string) {
  const user = await getCachedUser()

  if (!user) {
    throw new UserNotFoundError("User not found")
  }

  const form = await db.query.forms.findFirst({
    where: eq(forms.id, formId),
  })

  return form
}

export async function getFormBySharableId(shareUrl: string) {
  const form = await db
    .update(forms)
    .set({ visits: sql`${forms.visits} + 1` })
    .where(eq(forms.shareUrl, shareUrl))
    .returning()
    .then((rows) => rows[0])
  return form
}

export async function getFormWithSubmissions(formId: string) {
  const user = await getCachedUser()

  if (!user) {
    throw new UserNotFoundError("User not found")
  }

  const form = await db.query.forms.findFirst({
    with: { formSubmissions: true },
    where: and(eq(forms.id, formId), eq(forms.userId, user.id)),
  })

  return form
}

"use server"

import "server-only"

import { db } from "@/db"
import { forms, formSubmissions } from "@/db/schema"
import { and, eq, sql } from "drizzle-orm"

import { getCachedUser } from "../queries/user"
import { createFormSchema, CreateFormSchema } from "../validations/form"

export async function createForm(rawInput: CreateFormSchema) {
  const input = createFormSchema.safeParse(rawInput)

  if (!input.success) {
    throw new Error("Invalid input")
  }

  const user = await getCachedUser()

  if (!user) {
    throw new Error("User not found")
  }

  const { name, description } = input.data

  const form = await db
    .insert(forms)
    .values({ name, description, userId: user.id })
    .returning({ id: forms.id })
    .then((rows) => rows[0])

  return form.id
}

export async function updateForm(formId: string, content: string) {
  const user = await getCachedUser()

  if (!user) {
    throw new Error("User not found")
  }

  const response = await db
    .update(forms)
    .set({ content })
    .where(and((eq(forms.id, user.id), eq(forms.id, formId))))

  return response
}

export async function publishForm(formId: string) {
  const user = await getCachedUser()

  if (!user) {
    throw new Error("User not found")
  }

  const response = await db
    .update(forms)
    .set({ published: true })
    .where(and((eq(forms.id, user.id), eq(forms.id, formId))))

  return response
}

export async function submitForm(formUrl: string, jsonContent: string) {
  await db.transaction(async (trx) => {
    const response = await trx
      .update(forms)
      .set({ submissions: sql`${forms.visits} + 1` })
      .where(and(eq(forms.shareUrl, formUrl), eq(forms.published, true)))
      .returning({ id: forms.id })
      .then((rows) => rows[0])

    if (!response) {
      trx.rollback()
      return
    }

    await trx
      .insert(formSubmissions)
      .values({ formId: response.id, content: jsonContent })
  })
}

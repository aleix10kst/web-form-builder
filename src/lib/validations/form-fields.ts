import { z } from "zod"

export const titleFieldSchema = z.object({
  title: z.string().min(4),
})

export const paragraphFieldSchema = z.object({
  text: z.string().min(4),
})

export const spacerFieldSchema = z.object({
  height: z.number().int().positive(),
})

export const textFieldSchema = z.object({
  label: z.string().min(4),
  placeholder: z.string().max(200),
  helperText: z.string().max(200),
  required: z.boolean().default(false),
})

export const textAreaFieldSchema = textFieldSchema.extend({
  rows: z.number().int().positive().min(1).default(3),
})

export const dateFieldSchema = textFieldSchema.omit({ placeholder: true })

export const selectFieldSchema = textFieldSchema.extend({
  options: z.array(z.string()).default([]),
})

export const checkboxFieldSchema = textFieldSchema.omit({ placeholder: true })

export type TitleFieldSchema = z.infer<typeof titleFieldSchema>
export type ParagraphFieldSchema = z.infer<typeof paragraphFieldSchema>
export type SpacerFieldSchema = z.infer<typeof spacerFieldSchema>

export type TextFieldSchema = z.infer<typeof textFieldSchema>
export type TextAreaFieldSchema = z.infer<typeof textAreaFieldSchema>
export type DateFieldSchema = z.infer<typeof dateFieldSchema>
export type SelectFieldSchema = z.infer<typeof selectFieldSchema>
export type CheckboxFieldSchema = z.infer<typeof checkboxFieldSchema>

import { relations } from "drizzle-orm"
import {
  boolean,
  integer,
  pgTable,
  text,
  unique,
  varchar,
} from "drizzle-orm/pg-core"

import { generateId } from "@/lib/id"

import { lifecycleDates } from "./utils"

export const forms = pgTable(
  "forms",
  {
    id: varchar("id", { length: 30 })
      .$defaultFn(() => generateId())
      .primaryKey(),
    userId: varchar("user_id", { length: 50 }),
    published: boolean("published").default(false),
    name: text("name"),
    description: text("description"),
    content: text("content").notNull().default(""),

    visits: integer("visits").notNull().default(0),
    submissions: integer("submissions").notNull().default(0),

    shareUrl: text("share_url")
      .notNull()
      .$defaultFn(() => generateId()),
    ...lifecycleDates,
  },
  (table) => ({
    uniqueUserAndFormName: unique().on(table.userId, table.name),
  })
)

export const formRelations = relations(forms, ({ many }) => ({
  formSubmissions: many(formSubmissions),
}))

export type Form = typeof forms.$inferSelect
export type CreateForm = typeof forms.$inferInsert

export const formSubmissions = pgTable("form_submissions", {
  id: varchar("id", { length: 30 })
    .$defaultFn(() => generateId())
    .primaryKey(),
  formId: varchar("form_id", { length: 30 }),
  content: text("content").notNull().default(""),
  ...lifecycleDates,
})

export const formSubmissionRelations = relations(
  formSubmissions,
  ({ one }) => ({
    form: one(forms, {
      fields: [formSubmissions.formId],
      references: [forms.id],
    }),
  })
)

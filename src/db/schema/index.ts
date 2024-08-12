import { pgTable, varchar } from "drizzle-orm/pg-core"

import { generateId } from "@/lib/id"

export const products = pgTable("products", {
  id: varchar("id,", { length: 30 })
    .$defaultFn(() => generateId())
    .primaryKey(),
})

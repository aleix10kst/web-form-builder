import "server-only"

import { cache } from "react"
import { currentUser } from "@clerk/nextjs/server"

export const getCachedUser = cache(currentUser)

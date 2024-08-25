"use client"

import { use } from "react"

import { DesignerContext } from "../context/designer-context"

export function useDesigner() {
  const context = use(DesignerContext)

  if (!context) {
    throw new Error("useDesigner must be used within a DesignerContext")
  }

  return context
}

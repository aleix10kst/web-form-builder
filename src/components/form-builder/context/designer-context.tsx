"use client"

import {
  createContext,
  Dispatch,
  PropsWithChildren,
  ReactNode,
  SetStateAction,
  useState,
} from "react"

import { FormElementInstance } from "../form-elements"

type DesignerContextType = {
  elements: FormElementInstance[]
  addElement: (index: number, element: FormElementInstance) => void
  updateElement: (id: string, element: FormElementInstance) => void
  removeElement: (id: string) => void
  selectedElement: FormElementInstance | null
  setSelectedElement: Dispatch<SetStateAction<FormElementInstance | null>>
  setElements: Dispatch<SetStateAction<FormElementInstance[]>>
}

export const DesignerContext = createContext<DesignerContextType | null>(null)

export function DesignerContextProvider({ children }: PropsWithChildren) {
  const [elements, setElements] = useState<FormElementInstance[]>([])
  const [selectedElement, setSelectedElement] =
    useState<FormElementInstance | null>(null)

  const addElement = (index: number, element: FormElementInstance) => {
    setElements((prev) => {
      const copy = [...prev]
      copy.splice(index, 0, element)
      return copy
    })
  }

  function updateElement(id: string, element: FormElementInstance) {
    setElements((prev) => {
      const copy = [...prev]
      const index = copy.findIndex((element) => element.id === id)
      copy[index] = element
      return copy
    })
  }

  const removeElement = (id: string) => {
    setElements((prev) => {
      const copy = [...prev]
      const index = copy.findIndex((element) => element.id === id)
      copy.splice(index, 1)
      return copy
    })
  }

  return (
    <DesignerContext.Provider
      value={{
        elements,
        addElement,
        updateElement,
        removeElement,
        selectedElement,
        setSelectedElement,
        setElements,
      }}
    >
      {children}
    </DesignerContext.Provider>
  )
}

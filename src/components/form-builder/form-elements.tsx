import { ElementType, FC, ReactElement } from "react"

import { CheckboxFieldFormElement } from "./fields/checkbox-field"
import { DateFieldFormElement } from "./fields/date-field"
import { NumberFieldFormElement } from "./fields/number-field"
import { ParagraphFieldFormElement } from "./fields/paragraph-field"
import { SelectFieldFormElement } from "./fields/select-field"
import { SeparatorFieldFormElement } from "./fields/separator-field"
import { SpacerFieldFormElement } from "./fields/spacer-field"
import { SubtitleFieldFormElement } from "./fields/subtitle-field"
import { TextFieldFormElement } from "./fields/text-field"
import { TextAreaFormElement } from "./fields/textarea-field"
import { TitleFieldFormElement } from "./fields/title-field"

export type ElementsType =
  | "TextField"
  | "NumberField"
  | "TextAreaField"
  | "DateField"
  | "SelectField"
  | "CheckboxField"
  | "TitleField"
  | "SubtitleField"
  | "ParagraphField"
  | "SeparatorField"
  | "SpacerField"

export type OnValueChangeFunction = (key: string, value: string) => void

export type FormElement = {
  type: ElementsType
  construct: (id: string) => FormElementInstance
  designerBtnElement: {
    icon: ElementType
    label: string
  }
  designerComponent: FC<{ elementInstance: FormElementInstance }>
  formComponent: FC<{
    elementInstance: FormElementInstance
    onValueChange?: OnValueChangeFunction
    isInvalid?: boolean
    defaultValue?: string
  }>
  propertiesComponent: FC<{ elementInstance: FormElementInstance }>
  validate: (
    elementInstance: FormElementInstance,
    currentValue: string
  ) => boolean
}

export type FormElementInstance = {
  id: string
  type: ElementsType
  extraAttributes?: Record<string, any>
}

type FormElementsType = {
  [key in ElementsType]: FormElement
}

export const FormElements = {
  TextField: TextFieldFormElement,
  NumberField: NumberFieldFormElement,
  TextAreaField: TextAreaFormElement,
  DateField: DateFieldFormElement,
  SelectField: SelectFieldFormElement,
  CheckboxField: CheckboxFieldFormElement,
  TitleField: TitleFieldFormElement,
  SubtitleField: SubtitleFieldFormElement,
  ParagraphField: ParagraphFieldFormElement,
  SeparatorField: SeparatorFieldFormElement,
  SpacerField: SpacerFieldFormElement,
} satisfies FormElementsType

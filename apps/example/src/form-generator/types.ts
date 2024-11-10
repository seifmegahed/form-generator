import type { z } from "zod";

export const enum FieldType {
  Text = "text",
  Number = "number",
  Select = "select",
  Textarea = "textarea",
  Checkbox = "checkbox",
  DatePicker = "date-picker",
}

type GenericFieldType = {
  name: string;
  label: string;
  schema: z.ZodTypeAny;
  hidden?: boolean;
  className?: string;
  description?: string;
};

export type TextFieldType = GenericFieldType & {
  type: FieldType.Text;
  default: string;
};

export type NumberFieldType = GenericFieldType & {
  type: FieldType.Number;
  default: number;
};

export type SelectFieldType = GenericFieldType & {
  type: FieldType.Select;
  default: string | number | undefined;
  options:
    | readonly string[]
    | readonly { value: string | number; label: string }[];
};

export type TextareaFieldType = GenericFieldType & {
  type: FieldType.Textarea;
  default: string;
};

export type CheckboxFieldType = GenericFieldType & {
  type: FieldType.Checkbox;
  default: boolean;
};

export type DatePickerFieldType = GenericFieldType & {
  type: FieldType.DatePicker;
  default: Date;
  allowFuture?: boolean;
};

export type FieldDataType =
  | TextFieldType
  | NumberFieldType
  | SelectFieldType
  | TextareaFieldType
  | CheckboxFieldType
  | DatePickerFieldType;

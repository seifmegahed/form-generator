import type { UseFormReturn } from "react-hook-form";
import type { z } from "zod";

export type defaultValueTypes = (string | number | boolean | Date) | undefined;

export enum FieldType {
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
  schema: z.ZodType;
  hidden?: boolean;
  className?: string;
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

export interface FormGeneratorProps<
  T extends readonly FieldDataType[],
  FormSchema extends { [K in T[number]["name"]]: z.infer<T[number]["schema"]> },
> {
  form: UseFormReturn<FormSchema>;
}

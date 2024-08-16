import type { UseFormReturn } from "react-hook-form";
import type { z } from "zod";

export type defaultValueTypes = (string | number | boolean | Date) | undefined;

export enum FieldType {
  Text = "text",
  Number = "number",
  Select = "select",
  Textarea = "textarea",
  Checkbox = "checkbox",
}

export type FieldDataType = {
  name: string;
  label: string;
  type: FieldType;
  default: defaultValueTypes;
  options?:
    | readonly string[]
    | readonly { value: string | number; label: string }[];
  allowFuture?: boolean;
  hidden?: boolean;
  schema: z.ZodType;
  className?: string;
};

export interface FormGeneratorProps<
T extends readonly FieldDataType[],
FormSchema extends { [K in T[number]["name"]]: z.infer<T[number]["schema"]> }
> {
form: UseFormReturn<FormSchema>;
}
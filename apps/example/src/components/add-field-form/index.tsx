import { z } from "zod";
import type { FieldDataType } from "@/form-generator";
import { emptyToUndefined, FieldType, FormGenerator } from "@/form-generator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { emptyToNull } from "@/form-generator/utils";

const schemas = (required: boolean, type: FieldType) => {
  console.log(required, type);
  switch (type) {
    case FieldType.Text:
      return required
        ? z.preprocess(emptyToUndefined, z.string())
        : z.preprocess(emptyToNull, z.string().nullable());
    case FieldType.Number:
      return required
        ? z.preprocess(emptyToUndefined, z.number())
        : z.preprocess(emptyToNull, z.number().nullable());
    case FieldType.Select:
      return required ? z.string() : z.string().nullable();
    case FieldType.Textarea:
      return required
        ? z.preprocess(emptyToUndefined, z.string())
        : z.preprocess(emptyToNull, z.string().nullable());
    case FieldType.Checkbox:
      return z.boolean();
    case FieldType.DatePicker:
      return required ? z.date() : z.date().nullable();
    default:
      return z.preprocess(emptyToNull, z.string().nullable());
  }
};

const getDefaultValue = (
  type: FieldType,
  defaultValue: string | number | null,
) => {
  switch (type) {
    case FieldType.Text:
      return defaultValue ? (defaultValue as string) : "";
    case FieldType.Number:
      return typeof defaultValue === "number" ? defaultValue : 0;
    case FieldType.Select:
      return undefined;
    case FieldType.Textarea:
      return defaultValue ? (defaultValue as string) : "";
    case FieldType.Checkbox:
      return false;
    case FieldType.DatePicker:
      return new Date();
    default:
      return "";
  }
};

const formFields = [
  {
    name: "name",
    label: "Name",
    type: FieldType.Text,
    description:
      "Name of the field in the form, must be unique. This name will be the key of the field in the form data",
    className: "md:col-span-2",
    default: "",
    required: true,
    schema: z.preprocess(emptyToUndefined, z.string()),
  },
  {
    name: "Label",
    label: "Label",
    type: FieldType.Text,
    description: "Label of the field",
    className: "md:col-span-2",
    default: "",
    required: true,
    schema: z.preprocess(emptyToUndefined, z.string()),
  },
  {
    name: "required",
    label: "Required",
    type: FieldType.Checkbox,
    className: "md:col-span-2",
    default: false,
    required: true,
    schema: z.boolean(),
  },
  {
    name: "span",
    label: "Span",
    type: FieldType.Number,
    className: "md:col-span-2",
    default: 2,
    required: true,
    description: "Number of columns the field should span",
    schema: z.preprocess(
      emptyToUndefined,
      z.preprocess(
        (val) => Number(val),
        z
          .number({ invalid_type_error: "Span must be a number" })
          .min(1, { message: "Span must be between 1 and 4" })
          .max(4, { message: "Span must be between 1 and 4" }),
      ),
    ),
  },
  {
    name: "type",
    label: "Type",
    type: FieldType.Select,
    className: "md:col-span-2",
    default: undefined,
    options: [
      { label: "Text", value: FieldType.Text },
      { label: "Number", value: FieldType.Number },
      { label: "Select", value: FieldType.Select },
      { label: "Textarea", value: FieldType.Textarea },
      { label: "Checkbox", value: FieldType.Checkbox },
      { label: "Date Picker", value: FieldType.DatePicker },
    ] as const,
    required: true,
    schema: z.string(),
    description: "Choose the type of the field",
  },
  {
    name: "default",
    label: "Default",
    type: FieldType.Text,
    className: "md:col-span-2",
    default: "",
    description:
      "Default value of the field. Leave empty if you don't want to set a default value.",
    schema: z.preprocess(emptyToNull, z.string().nullable()),
    required: false,
  },
  {
    name: "description",
    label: "Description",
    type: FieldType.Textarea,
    className: "md:col-span-4",
    description:
      "Description of the field. This will be shown below the field like this text.",
    default: "",
    required: false,
    schema: z.preprocess(emptyToNull, z.string().nullable()),
  },
  {
    name: "options",
    label: "Options",
    type: FieldType.Textarea,
    required: false,
    className: "md:col-span-4",
    default: "",
    schema: z.preprocess(emptyToNull, z.string().nullable()),
    description: "Options delimited by comma",
  },
] as const;

function AddFieldForm({
  onSubmit,
}: {
  onSubmit: (field: FieldDataType) => void;
}) {
  const formData = new FormGenerator(formFields);

  const schema = z.object(formData.schema).superRefine((data, ctx) => {
    const type = data.type as FieldType;
    if (type === FieldType.Select && !data.options) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Select field must have options",
        path: ["options"],
      });
      return false;
    }
    if (
      type === FieldType.Number &&
      data.default &&
      isNaN(parseFloat(data.default))
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Default value must be a number",
        path: ["default"],
      });
      return false;
    }
  });

  type schemaDataType = z.infer<typeof schema>;

  const form = useForm<schemaDataType>({
    resolver: zodResolver(schema),
    defaultValues: formData.defaultValues,
  });

  const handleSubmit = (data: schemaDataType) => {
    const field: FieldDataType =
      (data.type as FieldType) === FieldType.Select
        ? ({
            name: data.name,
            label: data.Label,
            className: `md:col-span-${data.span}`,
            type: FieldType.Select,
            default: getDefaultValue(FieldType.Select, data.default),
            schema: schemas(data.required, FieldType.Select),
            options:
              data?.options?.split(",").map((option) => option.trim()) ?? [],
            description: data.description,
            required: data.required,
          } as FieldDataType)
        : ({
            name: data.name,
            label: data.Label,
            className: `md:col-span-${data.span}`,
            type: data.type as FieldType,
            default: getDefaultValue(data.type as FieldType, data.default),
            schema: schemas(data.required, data.type as FieldType),
            description: data.description,
            required: data.required,
          } as FieldDataType);
    onSubmit(field);
  };

  return (
    <form
      className="flex w-full flex-col gap-5 px-5 py-8"
      onSubmit={form.handleSubmit(handleSubmit)}
    >
      <h1 className="text-2xl font-bold">Add Field to the Form</h1>
      <div className="grid w-full gap-x-3 md:grid-cols-4">
        {formData.fields(form)}
      </div>
      <div className="flex justify-end">
        <Button type="submit" className="w-60">
          SAVE
        </Button>
      </div>
    </form>
  );
}

export default AddFieldForm;

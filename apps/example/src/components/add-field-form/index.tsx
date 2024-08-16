import { z } from "zod";
import type { FieldDataType } from "../form-generator";
import { emptyToUndefined, FieldType, FormGenerator } from "../form-generator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";

const schemas = (required: boolean, type: FieldType) => {
  console.log(required, type);
  switch (type) {
    case FieldType.Text:
      return required
        ? z.preprocess(emptyToUndefined, z.string())
        : z.string().optional();
    case FieldType.Number:
      return required
        ? z.preprocess(emptyToUndefined, z.number())
        : z.number().optional();
    case FieldType.Select:
      return required ? z.string() : z.string().optional();
    case FieldType.Textarea:
      return required
        ? z.preprocess(emptyToUndefined, z.string())
        : z.string().optional();
    case FieldType.Checkbox:
      return z.boolean();
    case FieldType.DatePicker:
      return required
        ? z.date()
        : z.date().optional()
    default:
      return z.string().optional();
  }
};

const getDefaultValue = (type: FieldType, defaultValue: string | number) => {
  switch (type) {
    case FieldType.Text:
      return defaultValue ? defaultValue : "";
    case FieldType.Number:
      return typeof defaultValue === "number" ? defaultValue : 0;
    case FieldType.Select:
      return undefined;
    case FieldType.Textarea:
      return defaultValue ? defaultValue : "";
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
    className: "md:col-span-2",
    default: "",
    schema: z.preprocess(emptyToUndefined, z.string()),
  },
  {
    name: "Label",
    label: "Label",
    type: FieldType.Text,
    className: "md:col-span-2",
    default: "",
    schema: z.preprocess(emptyToUndefined, z.string()),
  },
  {
    name: "required",
    label: "Required",
    type: FieldType.Checkbox,
    className: "md:col-span-2",
    default: false,
    schema: z.boolean(),
  },
  {
    name: "span",
    label: "Span",
    type: FieldType.Number,
    className: "md:col-span-2",
    default: 2,
    schema: z.preprocess(
      emptyToUndefined,
      z.preprocess(
        (val) => Number(val),
        z.number({ invalid_type_error: "Span must be a number" }),
      ),
    ),
  },
  {
    name: "type",
    label: "Type",
    type: FieldType.Select,
    className: "md:col-span-2",
    default: undefined,
    options: Object.values(FieldType).map((type) => ({
      label: type.toUpperCase(),
      value: type,
    })),
    schema: z.string(),
  },
  {
    name: "default",
    label: "Default",
    type: FieldType.Text,
    className: "md:col-span-2",
    default: "",
    schema: z.string(),
  },
  {
    name: "options",
    label: "Options",
    type: FieldType.Textarea,
    className: "md:col-span-4",
    default: "Options delimited by comma",
    schema: z.preprocess(emptyToUndefined, z.string()),
  },
] as const;

function AddFieldForm({
  onSubmit,
}: {
  onSubmit: (field: FieldDataType) => void;
}) {
  const formData = new FormGenerator<typeof formFields>(formFields);

  const schema = z.object(formData.schema).refine((data) => {
    if ((data.type as FieldType) === FieldType.Select && data.options) {
      return data.options.length > 0;
    }
    return true;
  });

  type schemaDataType = z.infer<typeof schema>;

  const form = useForm<schemaDataType>({
    resolver: zodResolver(schema),
    defaultValues: formData.defaultValues,
  });

  const handleSubmit = (data: schemaDataType) => {
    const field: FieldDataType = {
      name: data.name,
      label: data.Label,
      className: `md:col-span-${data.span}`,
      type: data.type as FieldType,
      default: getDefaultValue(data.type as FieldType, data.default),
      options:
        (data.type as FieldType) === FieldType.Select
          ? data.options.split(",").map((option) => option.trim())
          : undefined,
      schema: schemas(data.required, data.type as FieldType),
    };
    onSubmit(field);
  };

  return (
    <form
      className="flex w-full flex-col gap-5 px-5 py-8"
      onSubmit={form.handleSubmit(handleSubmit)}
    >
      <div className="grid w-full gap-x-3 md:grid-cols-4">
        {formData.fields<typeof formFields, schemaDataType>({
          form,
        })}
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

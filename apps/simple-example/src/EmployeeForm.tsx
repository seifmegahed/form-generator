import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  FormGenerator,
  emptyToUndefined,
  FieldType,
} from "@/components/form-generator";
import { Button } from "@/components/ui/button";

const formFields = [
  {
    name: "name",
    label: "Name",
    type: FieldType.Text,
    default: "",
    schema: z.preprocess(emptyToUndefined, z.string()),
  },
  {
    name: "department",
    label: "Department",
    type: FieldType.Select,
    default: undefined,
    schema: z.string(),
    options: ["IT", "Sales", "Marketing", "Finance"],
  },
  {
    name: "salary",
    label: "Salary",
    type: FieldType.Number,
    default: 0,
    schema: z.preprocess(
      emptyToUndefined,
      z.preprocess((value) => Number(value), z.number())
    ),
  },
  {
    name: "isActive",
    label: "Is Active",
    type: FieldType.Checkbox,
    default: true,
    schema: z.boolean(),
  },
  {
    name: "dateOfEmployment",
    label: "Date of Employment",
    type: FieldType.DatePicker,
    default: new Date(),
    schema: z.date(),
  },
  {
    name: "notes",
    label: "Notes",
    type: FieldType.Textarea,
    default: "",
    schema: z.string(),
  },
] as const;

function EmployeeForm() {
  const formGenerator = new FormGenerator<typeof formFields>(formFields);
  const schema = z.object(formGenerator.schema);
  type FormSchemaType = z.infer<typeof schema>;

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(schema),
    defaultValues: formGenerator.defaultValues,
  });

  const onSubmit = (data: FormSchemaType) => {
    console.log(data);
  };

  return (
    <div className="w-full h-full max-w-screen-md bg-slate-100 p-5 m-5 rounded-xl">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <h1 className="text-2xl font-bold">Employee Form</h1>
        {formGenerator.fields(form)}
        <div className="flex justify-end py-5 w-full">
          <Button type="submit" className="w-60">
            SAVE
          </Button>
        </div>
      </form>
    </div>
  );
}

export default EmployeeForm;

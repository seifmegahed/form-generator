"use client";

import { z } from "zod";
import { useState } from "react";
import FormTester from "@/components/form-generator-tester";
import {
  emptyToUndefined,
  type FieldDataType,
} from "@/form-generator";
import { FieldType } from "@/form-generator";
import { Button } from "@/components/ui/button";
import Dialog from "@/components/dialog";
import AddFieldForm from "@/components/add-field-form";

const formFields = [
  {
    name: "firstName",
    label: "First Name",
    className: "md:col-span-2",
    type: FieldType.Text,
    default: "",
    schema: z.preprocess(emptyToUndefined, z.string()),
  } as const,
  {
    name: "lastName",
    label: "Last Name",
    className: "md:col-span-2",
    type: FieldType.Text,
    default: "",
    schema: z.preprocess(emptyToUndefined, z.string()),
  } as const,
  {
    name: "major",
    label: "Major",
    className: "md:col-span-3",
    type: FieldType.Select,
    default: undefined,
    options: ["Computer Science", "Mathematics", "Physics"],
    schema: z.string(),
  } as const,
  {
    name: "age",
    label: "Age",
    type: FieldType.Number,
    default: 0,
    schema: z.preprocess(
      emptyToUndefined,
      z.preprocess(
        (val) => Number(val),
        z.number({ invalid_type_error: "Age must be a number" }),
      ),
    ),
  } as const,
  {
    name: "isStudent",
    label: "Is Student",
    className: "md:col-span-4",
    type: FieldType.Checkbox,
    default: false,
    schema: z.boolean(),
  } as const,
  {
    name: "date-of-admission",
    label: "Date of Admission",
    className: "md:col-span-4",
    type: FieldType.DatePicker,
    default: new Date(),
    schema: z.date(),
  } as const,
  {
    name: "notes",
    label: "Notes",
    className: "md:col-span-4",
    type: FieldType.Textarea,
    default: "",
    schema: z.string(),
  } as const,
];

export default function HomePage() {
  const [fields, setFields] = useState<FieldDataType[]>(formFields);
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 py-5 md:px-5">
      <FormTester formFields={fields} />
      <Dialog
        open={open}
        setOpen={setOpen}
        button={<Button className="w-60">Add Field</Button>}
      >
        <AddFieldForm
          onSubmit={(field) => {
            setFields((prev) => [...prev, field]);
            setOpen(false);
            console.log(field);
          }}
        />
      </Dialog>
    </div>
  );
}

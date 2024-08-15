"use client";

import { z } from "zod";
import { useState } from "react";
import FormTester from "@/components/form-builder-tester";
import { emptyToUndefined } from "@/components/form-builder";
import { FieldType } from "@/components/form-builder";
import { Button } from "@/components/ui/button";

const formFields = [
  {
    name: "firstName",
    label: "First Name",
    className: "md:col-span-2",
    type: FieldType.Text,
    default: "",
    schema: z.preprocess(emptyToUndefined, z.string()),
  },
  {
    name: "lastName",
    label: "Last Name",
    className: "md:col-span-2",
    type: FieldType.Text,
    default: "",
    schema: z.preprocess(emptyToUndefined, z.string()),
  },
  {
    name: "major",
    label: "Major",
    className: "md:col-span-3",
    type: FieldType.Select,
    default: undefined,
    options: ["Computer Science", "Mathematics", "Physics"],
    schema: z.string(),
  },
  {
    name: "age",
    label: "Age",
    type: FieldType.Number,
    default: 0,
    schema: z.preprocess(
      emptyToUndefined,
      z.preprocess(
        (val) => Number(val),
        z.number({ invalid_type_error: "Age must be a number" })
      )
    ),
  },
  {
    name: "isStudent",
    label: "Is Student",
    className: "md:col-span-4",
    type: FieldType.Checkbox,
    default: false,
    schema: z.boolean(),
  },
  {
    name: "notes",
    label: "Notes",
    className: "md:col-span-4",
    type: FieldType.Textarea,
    default: "",
    schema: z.string(),
  },
];

export default function HomePage() {
  const [fields, setFields] = useState(formFields);

  const newField = (label: string) => ({
    name: label.toLowerCase().replace(" ", "-"),
    label,
    type: FieldType.Text,
    default: "",
    className: "md:col-span-2",
    schema: z.preprocess(emptyToUndefined, z.string()),
  });
  
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <>
      <div className="flex justify-center items-center min-h-screen flex-col gap-5 md:px-5 py-5">
        <FormTester formFields={fields} />
        <Button
          className="w-60"
          onClick={() => {
            setFields((prev) => [...prev, newField(`Field ${fields.length}`)]);
            scrollToTop();
          }}
        >
          Add Field
        </Button>
      </div>
    </>
  );
}

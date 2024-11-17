"use client";

import { z } from "zod";
import { useState } from "react";
import FormTester from "@/components/form-generator-tester";
import { emptyToUndefined, type FieldDataType } from "@/form-generator";
import { FieldType } from "@/form-generator";
import { Button } from "@/components/ui/button";
import Dialog from "@/components/dialog";
import AddFieldForm from "@/components/add-field-form";
import { countries } from "@/lib/countries";

const formFields = [
  {
    name: "firstName",
    label: "First Name",
    className: "md:col-span-2",
    type: FieldType.Text,
    default: "",
    schema: z.preprocess(emptyToUndefined, z.string()),
    required: true,
  } as const,
  {
    name: "lastName",
    label: "Last Name",
    className: "md:col-span-2",
    type: FieldType.Text,
    default: "",
    schema: z.preprocess(emptyToUndefined, z.string()),
    required: true,
  } as const,
  {
    name: "major",
    label: "Major",
    className: "md:col-span-3",
    type: FieldType.Select,
    default: undefined,
    options: ["Computer Science", "Mathematics", "Physics"],
    schema: z.string(),
    required: true,
    description:
      "Select is a select field that allows you to select from a list of options.",
  } as const,
  {
    name: "age",
    label: "Age",
    type: FieldType.Number,
    default: 0,
    schema: z.preprocess(emptyToUndefined, z.number()),
    required: true,
  } as const,
  {
    name: "registrationNumber",
    label: "Registration Number",
    className: "md:col-span-4",
    type: FieldType.Text,
    default: "",
    schema: z.preprocess(emptyToUndefined, z.string()),
    required: true,
    description: (
      <p>
        Okay, so one of the worse things about using zod with react-hook-form is
        that it expects the default values to match the type of the schema.
        Usually this is fine and you can just use a preprocessor to make empty
        strings default to undefined. However, in the case of a number, it gets
        a bit tricky. If you do not provide a default value as a number,
        typescript will complain.
        <br />
        <strong>
          Look at the age field! it looks ridiculous with that zero
        </strong>
        , also the number input field is just a bit weird for me.
        <br />
        So, what I usually like to do is use a regular text input field with an
        emptyToUndefined preprocessor then a string schema with an empty string
        as the default value. Then I use the superRefine Method on the schema to
        parse the string to a float or an int then check if NaN and complain if
        it is indeed NaN. If the value is a valid number, I return the data with
        the parsed number.
        <br />
        Try it out and check the console for the result, but first test an
        invalid number to see if it complains.
        <br />
        Trust me, once you try it you will never use number fields ever
        again....
      </p>
    ),
  } as const,
  {
    name: "country",
    label: "Country",
    className: "md:col-span-4",
    type: FieldType.ComboSelect,
    default: undefined,
    options: countries,
    selectMessage: "Select Country",
    searchMessage: "Search Countries",
    notFoundMessage: "No Country Found",
    schema: z.string(),
    required: true,
    description: (
      <p>
        Combo Select is a select field that allows you to search for options. It
        is a great way to add a dropdown with a search bar to your form.
      </p>
    ),
  } as const,
  {
    name: "isStudent",
    label: "Is Student",
    className: "md:col-span-4",
    type: FieldType.Checkbox,
    default: false,
    schema: z.boolean(),
    required: true,
  } as const,
  {
    name: "date-of-admission",
    label: "Date of Admission",
    className: "md:col-span-4",
    type: FieldType.DatePicker,
    default: new Date(),
    schema: z.date(),
    required: true,
  } as const,
  {
    name: "notes",
    label: "Notes",
    className: "md:col-span-4",
    type: FieldType.Textarea,
    default: "",
    schema: z.string(),
    required: true,
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
        button={
          <Button className="w-60" aria-expanded={open}>
            Add Field
          </Button>
        }
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

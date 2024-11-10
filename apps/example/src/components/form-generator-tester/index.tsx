"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { FormGenerator, type FieldDataType } from "@/form-generator";

import { Button } from "../ui/button";
import { useMemo } from "react";

function FormTester({ formFields }: { formFields: FieldDataType[] }) {
  const formData = useMemo(
    () => new FormGenerator<typeof formFields>(formFields),
    [formFields],
  );

  const schema = useMemo(
    () =>
      z.object(formData.schema).superRefine((data, ctx) => {
        const registrationNumber = parseFloat(
          data.registrationNumber as string,
        );
        if (isNaN(registrationNumber)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Pretty cool right? Now enter a valid number",
            path: ["registrationNumber"],
          });
          return false;
        }
        data.registrationNumber = registrationNumber;
        return data;
      }),
    [formData],
  );

  type schemaDataType = z.infer<typeof schema>;

  const form = useForm<schemaDataType>({
    resolver: zodResolver(schema),
    defaultValues: formData.defaultValues,
  });

  const onSubmit = (data: schemaDataType) => {
    console.log(data);
    form.reset();
  };

  return (
    <form
      className="w-full max-w-lg bg-primary-foreground p-5 shadow-md sm:rounded-lg"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <div className="py-3 text-3xl font-bold">
        <p className="line-clamp-1 text-ellipsis text-primary">
          Form Generator Tester
        </p>
      </div>
      <div className="grid gap-x-3 md:grid-cols-4">{formData.fields(form)}</div>
      <div className="flex justify-end py-5">
        <Button
          type="submit"
          className="rounded-md px-12 py-2 font-medium"
          disabled={form.formState.isSubmitting}
        >
          Save
        </Button>
      </div>
    </form>
  );
}

export default FormTester;

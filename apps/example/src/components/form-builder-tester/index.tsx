"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { FormGenerator, FieldDataType } from "@/components/form-builder";

import { Button } from "../ui/button";
import { useMemo } from "react";

function FormTester({ formFields }: { formFields: FieldDataType[] }) {
  const formData = useMemo(
    () => new FormGenerator<typeof formFields>(formFields),
    [formFields],
  );

  type schemaDataType = z.infer<typeof formData.schema>;

  const form = useForm<schemaDataType>({
    resolver: zodResolver(formData.schema),
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
          Form Builder Tester
        </p>
      </div>
      <div className="grid gap-x-3 md:grid-cols-4">
        {formData.fields<typeof formFields, schemaDataType>({
          form,
        })}
      </div>
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

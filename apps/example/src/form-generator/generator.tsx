"use client";

import type { ControllerRenderProps, UseFormReturn } from "react-hook-form";

import { Form, FormField } from "@/components/ui/form";

import type { FieldDataType, FormSchema } from "./types";
import FieldSelector from "./field-selector";

type ReducedCollectionType<
  T extends readonly FieldDataType[],
  P extends keyof T[number],
> = {
  [K in T[number]["name"]]: Extract<T[number], { name: K }>[P];
};

class FormGenerator<T extends readonly FieldDataType[]> {
  readonly formData: T;
  readonly schema: ReducedCollectionType<T, "schema">;
  readonly defaultValues: ReducedCollectionType<T, "default">;

  constructor(formData: T) {
    this.formData = formData;
    this.schema = formData.reduce(
      (acc, field) => ({ [field.name]: field.schema, ...acc }),
      {} as ReducedCollectionType<T, "schema">,
    );

    this.defaultValues = formData.reduce(
      (acc, field) => ({ [field.name]: field.default, ...acc }),
      {} as ReducedCollectionType<T, "default">,
    );
  }

  fields(form: UseFormReturn<FormSchema<T>>) {
    return (
      <Form {...form}>
        {this.formData.map((fieldData) =>
          fieldData.hidden ? null : (
            <FormField
              key={fieldData.name}
              control={form.control}
              name={fieldData.name as FormSchema<T>[keyof FormSchema<T>]}
              render={({ field }) => (
                <FieldSelector
                  fieldData={fieldData}
                  field={
                    field as ControllerRenderProps<
                      FormSchema<T>[keyof FormSchema<T>]
                    >
                  }
                />
              )}
            />
          ),
        )}
      </Form>
    );
  }
}

export default FormGenerator;

"use client"

import { z } from "zod";
import type { ControllerRenderProps } from "react-hook-form";

import { Form, FormField } from "@/components/ui/form";

import type { FieldDataType, FormGeneratorProps } from "./types";
import { reduceDefaultValues, reduceSchema } from "./utils";
import FieldSelector from "./field-selector";

class FormGenerator<T extends FieldDataType[]> {
  formData: T;
  readonly schema: z.ZodObject<{
    [K in T[number]["name"]]: Extract<T[number], { name: K }>["schema"];
  }>;
  readonly defaultValues: {
    [K in T[number]["name"]]: Extract<T[number], { name: K }>["default"];
  };

  constructor(formData: T) {
    this.formData = formData;
    this.schema = z.object(
      formData.reduce(reduceSchema<T[number]>, {}) as {
        [K in T[number]["name"]]: Extract<T[number], { name: K }>["schema"];
      }
    );
    this.defaultValues = formData.reduce(
      reduceDefaultValues<T[number]>,
      {}
    ) as {
      [K in T[number]["name"]]: Extract<T[number], { name: K }>["default"];
    };
  }

  fields<
    T extends readonly FieldDataType[],
    FormSchema extends {
      [K in T[number]["name"]]: z.infer<T[number]["schema"]>;
    }
  >({ form }: FormGeneratorProps<T, FormSchema>) {
    return (
      <Form {...form} >
        {this.formData.map((fieldData) =>
          fieldData.hidden ? null : (
            <FormField
              key={fieldData.name}
              control={form.control}
              name={fieldData.name as FormSchema["name"]}
              render={({ field }) => (
                <FieldSelector<typeof fieldData>
                  key={fieldData.name}
                  fieldData={fieldData}
                  field={field as ControllerRenderProps}
                />
              )}
            />
          )
        )}
      </Form>
    );
  }
}

export default FormGenerator;

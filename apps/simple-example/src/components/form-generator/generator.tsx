

import type { z } from "zod";
import type { ControllerRenderProps, UseFormReturn } from "react-hook-form";

import { Form, FormField } from "@/components/ui/form";

import type { FieldDataType } from "./types";
import { reduceDefaultValues, reduceSchema } from "./utils";
import FieldSelector from "./field-selector";

class FormGenerator<T extends readonly FieldDataType[]> {
  readonly formData: T;
  readonly schema: {
    [K in T[number]["name"]]: Extract<T[number], { name: K }>["schema"];
  };
  readonly defaultValues: {
    [K in T[number]["name"]]: Extract<T[number], { name: K }>["default"];
  };

  constructor(formData: T) {
    this.formData = formData;
    this.schema = formData.reduce(reduceSchema<T[number]>, {}) as {
      [K in T[number]["name"]]: Extract<T[number], { name: K }>["schema"];
    };

    this.defaultValues = formData.reduce(
      reduceDefaultValues<T[number]>,
      {},
    ) as {
      [K in T[number]["name"]]: Extract<T[number], { name: K }>["default"];
    };
  }

  fields<
    T extends readonly FieldDataType[],
    FormSchema extends {
      [K in T[number]["name"]]: z.infer<Extract<T[number], { name: K }>["schema"]>;
    },
  >({ form }: { form: UseFormReturn<FormSchema> }) {
    return (
      <Form {...form}>
        {this.formData.map((fieldData) =>
          fieldData.hidden ? null : (
            <FormField
              key={fieldData.name}
              control={form.control}
              name={fieldData.name as  FormSchema["name"]}
              render={({ field }) => (
                <FieldSelector<typeof fieldData>
                  fieldData={fieldData}
                  field={field as ControllerRenderProps} 
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

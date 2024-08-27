

import type { ControllerRenderProps, Path, UseFormReturn } from "react-hook-form";

import { Form, FormField } from "@/components/ui/form";

import type { FieldDataType, FormSchema } from "./types";
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
  fields(form: UseFormReturn<FormSchema<T>>) {
    return (
      <Form {...form}>
        {this.formData.map((fieldData) =>
          fieldData.hidden ? null : (
            <FormField
              key={fieldData.name}
              control={form.control}
              name={fieldData.name as Path<FormSchema<T>>}
              render={({ field }) => (
                <FieldSelector
                  fieldData={fieldData}
                  field={
                    field as ControllerRenderProps<
                      FormSchema<T>[typeof fieldData.name]
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

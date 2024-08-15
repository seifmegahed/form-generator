"use client";
/**
 *  Split anchors are used to split the code by the CLI.
 *  When adding a new Component to the switch, add an anchor
 *  followed by the name of the component like this:
 *
 *   //split//select
 *
 *  Then make sure you update the CLI to handle the new component
 *  accordingly in:
 *
 *   ./packages/cli/src/transformers/selector-transformer.ts
 *   ./packages/cli/src/transformers/config/index.ts
 *
 *  Note: All comments in this file are cleared when pulled by
 *  the CLI.
 */

//split//select
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
//split//text
import { Input } from "@/components/ui/input";
import type { InputProps } from "@/components/ui/input";
//split//textarea
import { Textarea } from "@/components/ui/textarea";
import type { TextareaProps } from "@/components/ui/textarea";
//split//checkbox
import { Checkbox } from "@/components/ui/checkbox";
import { FormItem } from "@/components/ui/form";

//split//body
import type { z } from "zod";
import type { ControllerRenderProps, Path } from "react-hook-form";
import { cn } from "@/lib/utils";

import FieldWrapper from "./field-wrapper";
import { FieldType, type FieldDataType } from "./types";

type FormSchema<T extends FieldDataType> = {
  [K in T["name"]]: z.infer<Extract<T, { name: K }>["schema"]>;
};

interface FieldSelectorProps<T extends FieldDataType> {
  fieldData: T;
  field: ControllerRenderProps<FormSchema<T>, Path<FormSchema<T>>>;
}

function FieldSelector<T extends FieldDataType>({
  field,
  fieldData,
}: FieldSelectorProps<T>) {
  switch (fieldData.type) {
//split//select
    case FieldType.Select:
      return (
        <FieldWrapper className={fieldData.className} label={fieldData.label}>
          <Select
            onValueChange={field.onChange}
            value={(field.value as string) ?? ""}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fieldData.options!.map((option) => {
                const label =
                  typeof option === "string" ? option : option.label;
                const value =
                  typeof option === "string" ? option : option.value;
                return (
                  <SelectItem key={value + label} value={value + ""}>
                    {label}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </FieldWrapper>
      );
//split//text
    case FieldType.Text:
      return (
        <FieldWrapper className={fieldData.className} label={fieldData.label}>
          <Input
            {...(field as InputProps)}
            value={(field.value as string) ?? ""}
          />
        </FieldWrapper>
      );
    case FieldType.Number:
      return (
        <FieldWrapper className={fieldData.className} label={fieldData.label}>
          <Input {...(field as InputProps)} type="number" />
        </FieldWrapper>
      );
//split//textarea
    case FieldType.Textarea:
      return (
        <FieldWrapper className={fieldData.className} label={fieldData.label}>
          <Textarea
            {...(field as TextareaProps)}
            rows={6}
            className="resize-none"
            maxLength={512}
          />
        </FieldWrapper>
      );
//split//checkbox
    case FieldType.Checkbox:
      return (
        <FormItem
          className={cn(
            "flex items-center justify-between py-4",
            fieldData.className,
          )}
        >
          <span className="text-lg text-muted-foreground">
            {fieldData.label}
          </span>
          <Checkbox
            checked={field.value as boolean}
            onCheckedChange={field.onChange}
            className="size-5 border-2"
          />
        </FormItem>
      );
//split//body
    default:
      return null;
  }
}

export default FieldSelector;

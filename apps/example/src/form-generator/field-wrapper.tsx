import type { ReactNode } from "react";

import {
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

function FieldWrapper({
  label,
  htmlFor,
  children,
  className,
  description,
}: {
  label: string;
  children: ReactNode;
  htmlFor?: string;
  className?: string;
  description?: string | ReactNode;
}) {
  return (
    <FormItem
      className={cn("py-2", className)}
      aria-label={label + " field"}
      role="field"
      aria-describedby={description ? `${htmlFor}-form-item-description` : ""}
    >
      <FormLabel htmlFor={htmlFor} className="text-md">
        {label}
      </FormLabel>
      {children}
      <FormMessage />
      {description && (
        <FormDescription
          id={`${htmlFor}-form-item-description`}
          className="text-xs"
        >
          {description}
        </FormDescription>
      )}
    </FormItem>
  );
}

export default FieldWrapper;

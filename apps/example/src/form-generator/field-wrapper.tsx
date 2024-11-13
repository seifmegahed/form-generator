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
  children,
  className,
  description,
}: {
  label: string;
  children: ReactNode;
  className?: string;
  description?: string;
}) {
  return (
    <FormItem className={cn("py-2", className)}>
      <FormLabel className="text-md">{label}</FormLabel>
      {children}
      <FormMessage />
      <FormDescription className="text-xs">{description}</FormDescription>
    </FormItem>
  );
}

export default FieldWrapper;

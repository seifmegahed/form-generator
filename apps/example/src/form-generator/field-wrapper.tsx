import type { ReactNode } from "react";

import {
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

function FieldWrapper({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <FormItem className={cn("py-2", className)}>
      <FormLabel>{label}</FormLabel>
      {children}
      <FormMessage />
    </FormItem>
  );
}

export default FieldWrapper;

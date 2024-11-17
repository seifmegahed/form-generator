"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function ComboSelect({
  id,
  value,
  onChange = () => {
    return;
  },
  className,
  options,
  selectMessage = "Select",
  searchMessage = "Search",
  notFoundMessage = "Not Found",
  required,
}: {
  id?: string;
  value?: string | number;
  onChange?: (value: string | number) => void;
  className?: string;
  options: { label: string; value: string }[] | string[];
  selectMessage?: string;
  searchMessage?: string;
  notFoundMessage?: string;
  required?: boolean;
}) {
  const [open, setOpen] = useState(false);

  const valueLabel =
    typeof options[0] === "object" && options[0] !== null
      ? ((options as { label: string; value: string | number }[]).find(
          (x) => x.value === value,
        )?.label ?? value)
      : value;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-required={required}
          className={cn(
            "w-full justify-between",
            className,
            value ? "" : "text-muted-foreground",
          )}
        >
          <p className="truncate">{valueLabel ? valueLabel : selectMessage}</p>
          <ChevronsUpDown
            className="h-3 w-3 shrink-0 text-secondary-foreground opacity-50"
            aria-hidden
            aria-label="Open Combo Select"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command className="max-h-[500px] w-full overflow-y-auto">
          <CommandInput placeholder={searchMessage} />
          <CommandList>
            <CommandEmpty>{notFoundMessage}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const optionValue =
                  typeof option === "object" ? option.value : option;
                const optionLabel =
                  typeof option === "object" ? option.label : option;
                return (
                  <CommandItem
                    key={optionValue}
                    value={optionValue}
                    onSelect={() => {
                      if (value === optionValue) onChange("");
                      else onChange(optionValue);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "me-2 h-4 w-4",
                        value === optionValue ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {optionLabel}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default ComboSelect;

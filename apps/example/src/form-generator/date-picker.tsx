"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

function DatePicker({
  id,
  date,
  allowFuture,
  required,
  onChange,
}: {
  id?: string;
  date?: Date;
  allowFuture?: boolean;
  required?: boolean;
  onChange: (date?: Date) => void;
}) {
  const [open, setOpen] = useState(false);

  const disabledDates = (date: Date) => {
    if (allowFuture) return new Date("1900-01-01") > date;
    return date > new Date() || new Date("1900-01-01") > date;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant={"outline"}
          className={cn(
            "w-[240px] pl-3 text-left font-normal",
            !date && "text-muted-foreground",
          )}
          aria-required={required}
          aria-expanded={open}
        >
          {date ? format(date, "PPP") : "Select date"}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" aria-hidden />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          aria-label="Date Picker"
          data-testid="date-picker-calendar"
          mode="single"
          month={date ?? new Date()}
          onMonthChange={(_date) => onChange(_date)}
          selected={date}
          onSelect={onChange}
          disabled={disabledDates}
        />
      </PopoverContent>
    </Popover>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={cn("size-6", className)}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
      />
    </svg>
  );
}

export default DatePicker;

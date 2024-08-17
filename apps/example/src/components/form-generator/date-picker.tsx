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
import { CalendarIcon } from "lucide-react";

function DatePicker({
  date,
  allowFuture,
  onChange,
}: {
  date?: Date;
  allowFuture?: boolean;
  onChange: (date?: Date) => void;
}) {
  const disabledDates = (date: Date) => {
    if (allowFuture) return new Date("1900-01-01") > date;
    return date > new Date() || new Date("1900-01-01") > date;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[240px] pl-3 text-left font-normal",
            !date && "text-muted-foreground",
          )}
        >
          {date ? format(date, "PPP") : "Select date"}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
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

export default DatePicker;

import { useState } from "react";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Calendar,
} from "@/components/ui";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

type DatePickerFieldProps = {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function DatePickerField({
  value,
  onChange,
  placeholder = "Selecciona una fecha",
}: DatePickerFieldProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? (
            format(new Date(value), "PPP", {
              locale: es,
            })
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          captionLayout="dropdown"
          selected={value ? new Date(value) : undefined}
          onSelect={(date) => {
            onChange(date ? date.toISOString() : "");
            setIsOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

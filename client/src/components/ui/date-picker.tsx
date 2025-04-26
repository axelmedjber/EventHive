import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DatePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  className?: string;
  placeholder?: string;
  showTimePicker?: boolean;
}

export function DatePicker({
  date,
  setDate,
  className,
  placeholder = "Select date",
  showTimePicker = false,
}: DatePickerProps) {
  const [selectedHour, setSelectedHour] = React.useState<string>("12");
  const [selectedMinute, setSelectedMinute] = React.useState<string>("00");
  const [selectedPeriod, setSelectedPeriod] = React.useState<string>("PM");

  // When date changes from calendar, preserve time if it exists
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) {
      setDate(undefined);
      return;
    }

    if (date) {
      // Preserve the time from the existing date
      selectedDate.setHours(date.getHours());
      selectedDate.setMinutes(date.getMinutes());
    } else if (showTimePicker) {
      // Set the time from the picker
      const hour = parseInt(selectedHour);
      const minute = parseInt(selectedMinute);
      const isPM = selectedPeriod === "PM";
      
      selectedDate.setHours(isPM && hour < 12 ? hour + 12 : (hour === 12 && !isPM ? 0 : hour));
      selectedDate.setMinutes(minute);
    }

    setDate(selectedDate);
  };

  // When time changes, update the date
  const handleTimeChange = () => {
    if (!date) return;
    
    const newDate = new Date(date);
    const hour = parseInt(selectedHour);
    const minute = parseInt(selectedMinute);
    const isPM = selectedPeriod === "PM";
    
    newDate.setHours(isPM && hour < 12 ? hour + 12 : (hour === 12 && !isPM ? 0 : hour));
    newDate.setMinutes(minute);
    
    setDate(newDate);
  };

  // Initialize time values from the provided date
  React.useEffect(() => {
    if (date) {
      let hours = date.getHours();
      const isPM = hours >= 12;
      
      if (hours === 0) {
        hours = 12;
      } else if (hours > 12) {
        hours -= 12;
      }
      
      setSelectedHour(hours.toString());
      setSelectedMinute(date.getMinutes().toString().padStart(2, '0'));
      setSelectedPeriod(isPM ? "PM" : "AM");
    }
  }, [date]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            showTimePicker ? (
              format(date, "PPP 'at' h:mm a")
            ) : (
              format(date, "PPP")
            )
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          initialFocus
        />
        
        {showTimePicker && (
          <div className="p-3 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Time</div>
              {date && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDate(undefined)}
                  className="h-7 text-xs"
                >
                  Clear
                </Button>
              )}
            </div>
            
            <div className="flex items-center space-x-2 mt-2">
              <Select
                value={selectedHour}
                onValueChange={(value) => {
                  setSelectedHour(value);
                  handleTimeChange();
                }}
              >
                <SelectTrigger className="w-16">
                  <SelectValue placeholder="Hour" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
                    <SelectItem key={hour} value={hour.toString()}>
                      {hour}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <span className="text-center">:</span>
              
              <Select
                value={selectedMinute}
                onValueChange={(value) => {
                  setSelectedMinute(value);
                  handleTimeChange();
                }}
              >
                <SelectTrigger className="w-16">
                  <SelectValue placeholder="Min" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                    <SelectItem key={minute} value={minute.toString().padStart(2, '0')}>
                      {minute.toString().padStart(2, '0')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select
                value={selectedPeriod}
                onValueChange={(value) => {
                  setSelectedPeriod(value);
                  handleTimeChange();
                }}
              >
                <SelectTrigger className="w-16">
                  <SelectValue placeholder="AM/PM" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AM">AM</SelectItem>
                  <SelectItem value="PM">PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

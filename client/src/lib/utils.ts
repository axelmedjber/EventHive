import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, isToday, isTomorrow } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string, includeTime: boolean = false): string {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }
  
  if (isToday(date)) {
    return includeTime 
      ? `Today at ${format(date, 'h:mm a')}` 
      : 'Today';
  }
  
  if (isTomorrow(date)) {
    return includeTime 
      ? `Tomorrow at ${format(date, 'h:mm a')}` 
      : 'Tomorrow';
  }
  
  return includeTime 
    ? format(date, 'EEE, MMM d, yyyy \'at\' h:mm a') 
    : format(date, 'EEE, MMM d, yyyy');
}

import { useQuery } from "@tanstack/react-query";
import { Registration } from "@shared/schema";
import { Users } from "lucide-react";

interface AttendeesListProps {
  eventId: number;
}

export default function AttendeesList({ eventId }: AttendeesListProps) {
  const { data: registrations, isLoading } = useQuery<Registration[]>({
    queryKey: [`/api/events/${eventId}/registrations`],
  });
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }
  
  // Get total count of attendees (sum of quantities)
  const attendeeCount = registrations?.reduce((sum, reg) => sum + reg.quantity, 0) || 0;
  
  if (!registrations || registrations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold text-secondary mb-4">Attendees</h2>
        <div className="text-center py-8">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No attendees have registered yet. Be the first!</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-semibold text-secondary mb-4">Attendees</h2>
      <p className="text-gray-500 mb-4">{attendeeCount} people are attending this event</p>
      
      <div className="flex flex-wrap gap-3">
        {/* We would normally show actual attendee information here,
            but for privacy reasons we'll just show avatars */}
        {Array.from({ length: Math.min(attendeeCount, 12) }).map((_, i) => (
          <div 
            key={i} 
            className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium"
          >
            {String.fromCharCode(65 + (i % 26))}
          </div>
        ))}
        
        {attendeeCount > 12 && (
          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
            +{attendeeCount - 12}
          </div>
        )}
      </div>
    </div>
  );
}

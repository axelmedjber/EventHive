import { Link } from "wouter";
import { Event } from "@shared/schema";
import { formatDistanceToNow, format } from "date-fns";

interface EventCardProps {
  event: Event;
  isFeatured?: boolean;
}

export default function EventCard({ event, isFeatured = false }: EventCardProps) {
  const eventDate = new Date(event.startDate);
  const formattedDate = format(eventDate, "EEE, MMM d • h:mm a");
  const timeUntil = formatDistanceToNow(eventDate, { addSuffix: true });
  
  return (
    <Link href={`/events/${event.id}`}>
      <div className="event-card cursor-pointer">
        <div className="relative">
          <img 
            className="h-48 w-full object-cover" 
            src={event.imageUrl} 
            alt={event.title} 
          />
          {isFeatured && (
            <div className="absolute top-0 right-0 m-2">
              <span className="bg-accent text-white text-xs font-bold px-2 py-1 rounded">FEATURED</span>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <div className="text-xs text-white font-medium">
              {timeUntil}
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="text-xs text-text font-medium mb-1">
            {formattedDate}
          </div>
          <h3 className="text-secondary font-semibold text-lg mb-1 truncate">{event.title}</h3>
          <p className="text-sm text-text/80 mb-2 truncate">{event.location}</p>
          <div className="flex items-center text-xs text-text/70">
            <span>By {event.organizerId}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

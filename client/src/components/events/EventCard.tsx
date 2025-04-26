import { Link } from "wouter";
import { MapPin, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { type Event, type Category } from "@shared/schema";

type EventCardProps = {
  event: Event;
  category?: Category;
  featured?: boolean;
  sellingFast?: boolean;
};

const EventCard = ({ event, category, featured, sellingFast }: EventCardProps) => {
  // Image placeholders for demo
  const imageSources = [
    "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1520155346-36773ab29479?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", 
    "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  ];
  
  // Generate a consistent image based on event ID
  const imageIndex = event.id % imageSources.length;
  const imageUrl = event.image || imageSources[imageIndex];
  
  return (
    <Link href={`/events/${event.id}`}>
      <div className="event-card bg-white rounded-lg overflow-hidden shadow-md h-full flex flex-col">
        <div className="relative h-48">
          <img 
            src={imageUrl}
            alt={event.title} 
            className="w-full h-full object-cover"
          />
          {featured && (
            <Badge variant="accent" className="absolute top-4 left-4">
              Featured
            </Badge>
          )}
          {sellingFast && (
            <Badge variant="primary" className="absolute top-4 left-4">
              Selling Fast
            </Badge>
          )}
        </div>
        
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex items-center text-sm text-foreground mb-2">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{formatDate(new Date(event.startDate))}</span>
          </div>
          
          <h3 className="font-semibold text-xl mb-2">{event.title}</h3>
          
          <div className="flex items-center text-sm text-foreground mb-4">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{event.location}</span>
          </div>
          
          <div className="flex items-center justify-between mt-auto">
            <Badge variant="category">{category?.name || 'Event'}</Badge>
            <span className="font-medium">
              {event.status === 'free' ? 'Free' : '$45'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;

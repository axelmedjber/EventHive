import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Event } from "@shared/schema";
import EventCard from "./EventCard";
import { Link } from "wouter";

interface FeaturedEventsProps {
  limit?: number;
}

export default function FeaturedEvents({ limit = 4 }: FeaturedEventsProps) {
  const [events, setEvents] = useState<Event[]>([]);
  
  const { data: featuredEvents, isLoading } = useQuery<Event[]>({
    queryKey: ["/api/events?featured=true"],
  });
  
  useEffect(() => {
    if (featuredEvents) {
      setEvents(featuredEvents.slice(0, limit));
    }
  }, [featuredEvents, limit]);
  
  if (isLoading) {
    return (
      <div className="bg-gray-light py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div className="h-8 w-64 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-6 w-20 bg-gray-200 animate-pulse rounded"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(limit)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="h-48 bg-gray-200 animate-pulse"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 animate-pulse rounded mb-2"></div>
                  <div className="h-6 bg-gray-200 animate-pulse rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 animate-pulse rounded mb-2 w-3/4"></div>
                  <div className="h-3 bg-gray-200 animate-pulse rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  if (!events || events.length === 0) {
    return null;
  }
  
  return (
    <div className="bg-gray-light py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-secondary">Featured Events</h2>
          <Link href="/browse?featured=true">
            <a className="text-accent hover:text-accent/80 font-medium">See all</a>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} isFeatured={true} />
          ))}
        </div>
      </div>
    </div>
  );
}

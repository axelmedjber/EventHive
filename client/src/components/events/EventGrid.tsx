import { useQuery } from "@tanstack/react-query";
import EventCard from "./EventCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Event, Category } from "@shared/schema";
import { useEffect, useState } from "react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type EventGridProps = {
  title?: string;
  filterControls?: boolean;
  maxItems?: number;
  categoryId?: number;
  featured?: boolean;
  searchQuery?: string;
};

const EventGrid = ({ 
  title = "Events", 
  filterControls = true,
  maxItems,
  categoryId,
  featured = false,
  searchQuery = ''
}: EventGridProps) => {
  const [dateFilter, setDateFilter] = useState<string>('any');
  const [priceFilter, setPriceFilter] = useState<string>('any');
  const [formatFilter, setFormatFilter] = useState<string>('any');

  // Fetch events based on filters
  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: [
      '/api/events', 
      searchQuery, 
      categoryId, 
      dateFilter, 
      priceFilter, 
      formatFilter,
      featured
    ],
    queryFn: async () => {
      let url = '/api/events?';
      
      if (searchQuery) {
        url += `search=${encodeURIComponent(searchQuery)}&`;
      }
      
      if (categoryId) {
        url += `categoryId=${categoryId}&`;
      }
      
      if (dateFilter !== 'any') {
        // Handle date filtering
        const now = new Date();
        let startDate;
        
        if (dateFilter === 'today') {
          startDate = now.toISOString().split('T')[0];
        } else if (dateFilter === 'tomorrow') {
          const tomorrow = new Date(now);
          tomorrow.setDate(tomorrow.getDate() + 1);
          startDate = tomorrow.toISOString().split('T')[0];
        } else if (dateFilter === 'weekend') {
          // Find next weekend (Sat-Sun)
          const dayOfWeek = now.getDay();
          const daysUntilWeekend = dayOfWeek === 6 ? 0 : (6 - dayOfWeek);
          const weekend = new Date(now);
          weekend.setDate(weekend.getDate() + daysUntilWeekend);
          startDate = weekend.toISOString().split('T')[0];
        } else if (dateFilter === 'week') {
          const nextWeek = new Date(now);
          nextWeek.setDate(nextWeek.getDate() + 7);
          startDate = now.toISOString().split('T')[0];
        } else if (dateFilter === 'month') {
          const nextMonth = new Date(now);
          nextMonth.setMonth(nextMonth.getMonth() + 1);
          startDate = now.toISOString().split('T')[0];
        }
        
        if (startDate) {
          url += `startDate=${startDate}&`;
        }
      }
      
      if (priceFilter !== 'any') {
        url += `price=${priceFilter}&`;
      }
      
      if (formatFilter !== 'any') {
        const isVirtual = formatFilter === 'online' ? 'true' : 'false';
        url += `isVirtual=${isVirtual}&`;
      }
      
      if (featured) {
        return fetch('/api/events/featured').then(res => res.json());
      }
      
      return fetch(url).then(res => res.json());
    }
  });

  // Fetch categories for displaying category names
  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
    queryFn: async () => {
      return fetch('/api/categories').then(res => res.json());
    }
  });

  // Filter events if maxItems is provided
  const displayedEvents = maxItems ? events?.slice(0, maxItems) : events;

  return (
    <div className="py-10">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold mb-4 md:mb-0">{title}</h2>
          
          {filterControls && (
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <Select 
                  value={dateFilter} 
                  onValueChange={setDateFilter}
                >
                  <SelectTrigger className="w-[150px] bg-white border border-border-gray rounded-full text-sm">
                    <SelectValue placeholder="Date: Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Date: Any</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="tomorrow">Tomorrow</SelectItem>
                    <SelectItem value="weekend">This weekend</SelectItem>
                    <SelectItem value="week">This week</SelectItem>
                    <SelectItem value="month">This month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="relative">
                <Select 
                  value={priceFilter} 
                  onValueChange={setPriceFilter}
                >
                  <SelectTrigger className="w-[150px] bg-white border border-border-gray rounded-full text-sm">
                    <SelectValue placeholder="Any price" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any price</SelectItem>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="relative">
                <Select 
                  value={formatFilter} 
                  onValueChange={setFormatFilter}
                >
                  <SelectTrigger className="w-[150px] bg-white border border-border-gray rounded-full text-sm">
                    <SelectValue placeholder="Format: Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Format: Any</SelectItem>
                    <SelectItem value="inperson">In person</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col">
                <Skeleton className="h-48 w-full mb-4" />
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-4 w-48 mb-4" />
                <div className="flex justify-between">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-12" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {displayedEvents && displayedEvents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedEvents.map((event) => {
                  const category = categories?.find(c => c.id === event.categoryId);
                  const isFeatured = featured || event.isFeatured;
                  // Randomize the "selling fast" badge for demo purposes
                  const isSellingFast = event.id % 5 === 0;
                  
                  return (
                    <EventCard 
                      key={event.id} 
                      event={event} 
                      category={category}
                      featured={isFeatured}
                      sellingFast={isSellingFast}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No events found</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your filters or search criteria</p>
                <Button>Browse All Events</Button>
              </div>
            )}
          </>
        )}
        
        {!maxItems && events && events.length > 0 && (
          <div className="mt-10 text-center">
            <Button variant="outline" className="border-2 border-accent text-accent hover:bg-accent hover:text-white px-6 py-3 rounded-md font-medium transition-colors">
              View More Events
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventGrid;

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Event, Category } from "@shared/schema";
import { Calendar, MapPin, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import CategorySelector from "@/components/CategorySelector";
import EventCard from "@/components/EventCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function Browse() {
  const [location, setLocation] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1]);
  
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    searchParams.has('categoryId') ? Number(searchParams.get('categoryId')) : null
  );
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [locationTerm, setLocationTerm] = useState(searchParams.get('location') || '');
  const [date, setDate] = useState<Date | undefined>(
    searchParams.has('date') ? new Date(searchParams.get('date')!) : undefined
  );
  const [featured, setFeatured] = useState(searchParams.get('featured') === 'true');
  
  // Query for events with filters
  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ["/api/events", {
      categoryId: selectedCategoryId,
      search: searchTerm,
      location: locationTerm,
      startDate: date,
      featured: featured
    }],
  });
  
  useEffect(() => {
    document.title = "Browse Events - EventHub";
  }, []);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update URL with search parameters
    const params = new URLSearchParams();
    if (selectedCategoryId) params.set('categoryId', selectedCategoryId.toString());
    if (searchTerm) params.set('search', searchTerm);
    if (locationTerm) params.set('location', locationTerm);
    if (date) params.set('date', date.toISOString().split('T')[0]);
    if (featured) params.set('featured', 'true');
    
    setLocation(`/browse?${params.toString()}`);
  };
  
  const clearFilters = () => {
    setSelectedCategoryId(null);
    setSearchTerm('');
    setLocationTerm('');
    setDate(undefined);
    setFeatured(false);
    setLocation('/browse');
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-secondary mb-6">Browse Events</h1>
      
      <CategorySelector 
        onSelectCategory={setSelectedCategoryId} 
        selectedCategoryId={selectedCategoryId} 
      />
      
      <div className="bg-white p-4 rounded-lg shadow mb-8">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search events"
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="City or location"
              className="pl-10"
              value={locationTerm}
              onChange={(e) => setLocationTerm(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <DatePicker
              date={date}
              setDate={setDate}
              className="pl-10 w-full"
              placeholder="Select date"
            />
          </div>
          
          <div className="flex space-x-2">
            <Button type="submit" className="bg-primary hover:bg-primary/90 flex-1">
              Search
            </Button>
            <Button type="button" variant="outline" onClick={clearFilters}>
              Clear
            </Button>
          </div>
        </form>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : events && events.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {events.map((event) => (
            <EventCard 
              key={event.id} 
              event={event} 
              isFeatured={event.isFeatured}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-secondary mb-2">No events found</h3>
          <p className="text-gray-500 mb-6">Try adjusting your search filters or browse all events.</p>
          <Button onClick={clearFilters}>View All Events</Button>
        </div>
      )}
    </div>
  );
}

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Event, Category } from "@shared/schema";
import Hero from "@/components/Hero";
import CategorySelector from "@/components/CategorySelector";
import FeaturedEvents from "@/components/FeaturedEvents";
import EventsByCategory from "@/components/EventsByCategory";
import CreateEventCTA from "@/components/CreateEventCTA";
import CategoryItem from "@/components/CategoryItem";
import { Link } from "wouter";

export default function Home() {
  useEffect(() => {
    document.title = "EventHub - Discover and Create Events";
  }, []);

  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: events, isLoading: eventsLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  // Count events per category
  const categoryCounts: Record<number, number> = {};
  
  if (events) {
    events.forEach(event => {
      if (!categoryCounts[event.categoryId]) {
        categoryCounts[event.categoryId] = 0;
      }
      categoryCounts[event.categoryId] += 1;
    });
  }

  // Get weekend events (filter events in the next 7 days)
  const weekendEvents = events?.filter(event => {
    const eventDate = new Date(event.startDate);
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    return eventDate >= today && eventDate <= nextWeek;
  });

  return (
    <div>
      <Hero />
      
      <CategorySelector onSelectCategory={() => {}} selectedCategoryId={null} />
      
      <FeaturedEvents limit={4} />
      
      {weekendEvents && weekendEvents.length > 0 && (
        <EventsByCategory title="Events This Weekend" limit={4} />
      )}
      
      {/* Browse Events By Category */}
      <div className="bg-gray-light py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-secondary mb-8">Browse Events By Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {categoriesLoading ? (
              Array(8).fill(0).map((_, i) => (
                <div key={i} className="flex flex-col items-center animate-pulse">
                  <div className="w-24 h-24 bg-gray-200 rounded-full mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              ))
            ) : (
              categories?.map((category) => (
                <Link key={category.id} href={`/browse?categoryId=${category.id}`}>
                  <a className="cursor-pointer">
                    <CategoryItem 
                      category={category} 
                      count={categoryCounts[category.id] || 0} 
                    />
                  </a>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
      
      <CreateEventCTA />
    </div>
  );
}

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { RegistrationWithDetails } from "@shared/schema";
import { useAuth } from "@/App";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TicketCard from "@/components/TicketCard";
import { CalendarIcon } from "lucide-react";

export default function MyTickets() {
  const { user, isAuthenticated } = useAuth();
  const [_, setLocation] = useLocation();
  
  useEffect(() => {
    document.title = "My Tickets - EventHub";
  }, []);
  
  const { data: registrations, isLoading } = useQuery<RegistrationWithDetails[]>({
    queryKey: [`/api/users/${user?.id}/registrations`],
    enabled: !!user,
  });
  
  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold text-secondary mb-4">Login Required</h1>
        <p className="mb-8">You need to be logged in to view your tickets.</p>
        <Button 
          className="bg-primary hover:bg-primary/90"
          onClick={() => setLocation("/")}
        >
          Go to Homepage
        </Button>
      </div>
    );
  }
  
  // Split registrations into upcoming and past
  const now = new Date();
  const upcomingRegistrations = registrations?.filter(
    reg => new Date(reg.event.startDate) > now
  ) || [];
  
  const pastRegistrations = registrations?.filter(
    reg => new Date(reg.event.startDate) <= now
  ) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-secondary mb-6">My Tickets</h1>
      
      <Tabs defaultValue="upcoming">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
          <TabsTrigger value="past">Past Events</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="mt-6">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-20 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : upcomingRegistrations.length > 0 ? (
            <div className="space-y-4">
              {upcomingRegistrations.map((registration) => (
                <TicketCard 
                  key={registration.id}
                  registration={registration}
                  isUpcoming={true}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-secondary mb-2">No upcoming tickets</h3>
              <p className="text-gray-500 mb-6">Browse events and register to see your tickets here.</p>
              <Button 
                onClick={() => setLocation("/browse")}
                className="bg-primary hover:bg-primary/90"
              >
                Browse Events
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="past" className="mt-6">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-20 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : pastRegistrations.length > 0 ? (
            <div className="space-y-4">
              {pastRegistrations.map((registration) => (
                <TicketCard 
                  key={registration.id}
                  registration={registration}
                  isUpcoming={false}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <h3 className="text-xl font-semibold text-secondary mb-2">No past tickets</h3>
              <p className="text-gray-500">Your ticket history will appear here after attending events.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

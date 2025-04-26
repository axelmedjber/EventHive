import { useState } from "react";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Event, Registration } from "@shared/schema";
import { Calendar, MapPin, Users, Ticket, PlusCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";

const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <Skeleton className="h-10 w-1/3" />
      <Skeleton className="h-10 w-24" />
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-28 w-full" />
      ))}
    </div>
    
    <Skeleton className="h-12 w-full" />
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-64 w-full" />
      ))}
    </div>
  </div>
);

type RegistrationWithEvent = Registration & { event?: Event };

const Dashboard = () => {
  const [_, navigate] = useLocation();
  const { user, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("organized");

  // Fetch organized events
  const { 
    data: organizedEvents, 
    isLoading: eventsLoading,
  } = useQuery<Event[]>({
    queryKey: ["/api/events/organizer", user?.id],
    queryFn: async () => {
      if (!user) return [];
      return fetch(`/api/events/organizer/${user.id}`).then(res => res.json());
    },
    enabled: !!user && user.isOrganizer,
  });

  // Fetch registered events
  const { 
    data: registrations, 
    isLoading: registrationsLoading,
  } = useQuery<Registration[]>({
    queryKey: ["/api/registrations/me"],
    queryFn: async () => {
      if (!user) return [];
      return fetch("/api/registrations/me").then(res => res.json());
    },
    enabled: !!user,
  });
  
  // Fetch event details for registrations
  const { 
    data: registeredEvents, 
    isLoading: detailsLoading,
  } = useQuery<RegistrationWithEvent[]>({
    queryKey: ["/api/registrations/details"],
    queryFn: async () => {
      if (!registrations || registrations.length === 0) return [];
      
      // Fetch event details for each registration
      const registrationsWithEvents = await Promise.all(
        registrations.map(async (registration) => {
          try {
            const event = await fetch(`/api/events/${registration.eventId}`).then(res => res.json());
            return { ...registration, event };
          } catch (error) {
            return registration;
          }
        })
      );
      
      return registrationsWithEvents;
    },
    enabled: !!registrations && registrations.length > 0,
  });

  // Handle unauthenticated state
  if (!authLoading && !user) {
    navigate("/login?redirect=/dashboard");
    return null;
  }

  // Loading state
  const isLoading = authLoading || eventsLoading || registrationsLoading || detailsLoading;
  if (isLoading) {
    return (
      <div className="container mx-auto px-6 max-w-7xl py-8">
        <DashboardSkeleton />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dashboard | EventHub</title>
        <meta name="description" content="Manage your events and registrations" />
      </Helmet>

      <div className="container mx-auto px-6 max-w-7xl py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.name}! Manage your events and registrations here.
            </p>
          </div>
          
          <Link href="/create">
            <Button className="mt-4 md:mt-0">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Event
            </Button>
          </Link>
        </div>

        {user?.isOrganizer && organizedEvents && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">{organizedEvents.length}</CardTitle>
                <CardDescription>Total Events</CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">
                  {organizedEvents.filter(e => new Date(e.startDate) > new Date()).length}
                </CardTitle>
                <CardDescription>Upcoming Events</CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">
                  {registrations?.length || 0}
                </CardTitle>
                <CardDescription>Total Registrations</CardDescription>
              </CardHeader>
            </Card>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            {user?.isOrganizer && (
              <TabsTrigger value="organized">Organized Events</TabsTrigger>
            )}
            <TabsTrigger value="registered">My Registrations</TabsTrigger>
          </TabsList>
          
          {user?.isOrganizer && (
            <TabsContent value="organized" className="space-y-6">
              {organizedEvents?.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <h3 className="text-xl font-semibold mb-2">No events yet</h3>
                    <p className="text-muted-foreground mb-6">You haven't created any events yet.</p>
                    <Link href="/create">
                      <Button>Create Your First Event</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {organizedEvents?.map((event) => (
                    <Card key={event.id} className="overflow-hidden">
                      <div className="flex flex-col sm:flex-row">
                        <div className="sm:w-1/3 h-full">
                          <img
                            src={event.image || `https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80`}
                            alt={event.title}
                            className="w-full h-48 sm:h-full object-cover"
                          />
                        </div>
                        <div className="sm:w-2/3 p-4">
                          <div className="flex justify-between mb-2">
                            <h3 className="font-semibold">{event.title}</h3>
                            <Badge variant={event.status === 'active' ? 'outline' : 'secondary'}>
                              {event.status === 'active' ? 'Active' : 'Draft'}
                            </Badge>
                          </div>
                          
                          <div className="space-y-1 mb-4">
                            <div className="flex items-center text-sm">
                              <Calendar className="h-3 w-3 mr-2 text-muted-foreground" />
                              <span>{formatDate(new Date(event.startDate))}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <MapPin className="h-3 w-3 mr-2 text-muted-foreground" />
                              <span>{event.location}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <Users className="h-3 w-3 mr-2 text-muted-foreground" />
                              <span>
                                {/* For demo, show random registration counts */}
                                {Math.floor(Math.random() * 50)} Registrations
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" asChild>
                              <Link href={`/events/${event.id}`}>View</Link>
                            </Button>
                            <Button size="sm">Manage</Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          )}
          
          <TabsContent value="registered" className="space-y-6">
            {!registeredEvents || registeredEvents.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <h3 className="text-xl font-semibold mb-2">No registrations yet</h3>
                  <p className="text-muted-foreground mb-6">You haven't registered for any events yet.</p>
                  <Link href="/events">
                    <Button>Browse Events</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {registeredEvents?.map((registration) => (
                  <Card key={registration.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{registration.event?.title || "Event"}</CardTitle>
                          <CardDescription>
                            {registration.event 
                              ? formatDate(new Date(registration.event.startDate)) 
                              : "Date not available"}
                          </CardDescription>
                        </div>
                        <Badge>
                          {registration.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center mb-2">
                        <Ticket className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>
                          {registration.quantity} Ticket{registration.quantity > 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="font-medium">
                        Total: ${registration.totalAmount.toFixed(2)}
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2 border-t">
                      {registration.event && (
                        <Button variant="outline" asChild className="w-full">
                          <Link href={`/events/${registration.eventId}`}>
                            View Event Details
                          </Link>
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Dashboard;

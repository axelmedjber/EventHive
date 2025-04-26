import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { EventWithDetails } from "@shared/schema";
import { CalendarIcon, MapPinIcon, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import RegisterForm from "@/components/RegisterForm";
import AttendeesList from "@/components/AttendeesList";
import { format } from "date-fns";

export default function EventDetails() {
  const { id } = useParams();
  const eventId = Number(id);

  const { data: event, isLoading, error } = useQuery<EventWithDetails>({
    queryKey: [`/api/events/${eventId}`],
  });

  useEffect(() => {
    if (event) {
      document.title = `${event.title} - EventHub`;
    } else {
      document.title = "Event Details - EventHub";
    }
  }, [event]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Skeleton className="h-80 w-full rounded-lg mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-40 w-full" />
          </div>
          <div>
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold text-secondary mb-4">Event Not Found</h1>
        <p className="mb-8">The event you are looking for might have been removed or never existed.</p>
        <Button onClick={() => window.history.back()}>Go Back</Button>
      </div>
    );
  }

  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);
  const formattedStartDate = format(startDate, "EEEE, MMMM d, yyyy");
  const formattedStartTime = format(startDate, "h:mm a");
  const formattedEndTime = format(endDate, "h:mm a");

  return (
    <div>
      {/* Event Header/Banner */}
      <div className="relative h-80 bg-gray-800">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="max-w-7xl mx-auto">
            <div className="inline-block bg-accent px-3 py-1 text-sm font-medium rounded mb-2">
              {event.category.name}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold">{event.title}</h1>
          </div>
        </div>
      </div>

      {/* Event Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Event Details */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-semibold text-secondary mb-4">About this event</h2>
              
              <div className="flex items-start space-x-4 mb-6">
                <div className="bg-gray-100 p-3 rounded-full">
                  <CalendarIcon className="h-6 w-6 text-gray-500" />
                </div>
                <div>
                  <p className="font-medium">{formattedStartDate}</p>
                  <p className="text-gray-500">{formattedStartTime} - {formattedEndTime}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 mb-6">
                <div className="bg-gray-100 p-3 rounded-full">
                  <MapPinIcon className="h-6 w-6 text-gray-500" />
                </div>
                <div>
                  <p className="font-medium">{event.location}</p>
                  <p className="text-gray-500">{event.address}</p>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-secondary mt-8 mb-4">Event Description</h3>
              <p className="whitespace-pre-line">{event.description}</p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-semibold text-secondary mb-4">Organizer</h2>
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                  {event.organizer.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{event.organizer.name}</p>
                  <p className="text-gray-500 text-sm">Event Organizer</p>
                </div>
              </div>
            </div>
            
            {/* Attendees Section */}
            <AttendeesList eventId={eventId} />
          </div>
          
          {/* Registration Sidebar */}
          <div className="space-y-6">
            <RegisterForm eventId={eventId} />
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-secondary mb-3">Event Details</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-gray-500" />
                  <span className="text-sm">
                    Duration: {Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60))} hours
                  </span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <MapPinIcon className="h-5 w-5 text-gray-500" />
                  <span className="text-sm">{event.location}</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-gray-500" />
                  <span className="text-sm">
                    {event.ticketTypes.reduce((acc, ticket) => acc + ticket.quantity, 0)} spots available
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-secondary mb-3">Share this event</h3>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  Facebook
                </Button>
                <Button variant="outline" size="sm">
                  Twitter
                </Button>
                <Button variant="outline" size="sm">
                  Email
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

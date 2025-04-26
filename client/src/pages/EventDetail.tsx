import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { useEffect, useState } from "react";
import { MapPin, Calendar, Clock, Globe, ExternalLink, AlertCircle, Users } from "lucide-react";
import { format } from "date-fns";
import { 
  EventWithDetails, 
  Ticket, 
  Registration, 
  insertRegistrationSchema 
} from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const eventId = parseInt(id);
  const [_, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);

  const { data: event, isLoading, error } = useQuery<EventWithDetails>({
    queryKey: [`/api/events/${eventId}`],
    enabled: !isNaN(eventId)
  });

  const registerMutation = useMutation({
    mutationFn: async (registrationData: Registration) => {
      const response = await apiRequest("POST", "/api/registrations", registrationData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/events/${eventId}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/registrations/me"] });
      toast({
        title: "Registration Successful",
        description: "You've successfully registered for this event",
      });
      setRegisterDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to register for this event",
        variant: "destructive",
      });
    }
  });

  const handleRegister = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to register for this event",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (!selectedTicket) {
      toast({
        title: "Select a Ticket",
        description: "Please select a ticket type",
        variant: "destructive",
      });
      return;
    }

    const totalAmount = selectedTicket.price * quantity;

    const registrationData = {
      userId: user.id,
      eventId: eventId,
      ticketId: selectedTicket.id,
      quantity: quantity,
      totalAmount: totalAmount,
      status: "confirmed"
    };

    try {
      insertRegistrationSchema.parse(registrationData);
      registerMutation.mutate(registrationData);
    } catch (error: any) {
      toast({
        title: "Validation Error",
        description: error.message || "Invalid registration data",
        variant: "destructive",
      });
    }
  };

  // Handle invalid event ID
  useEffect(() => {
    if (isNaN(eventId)) {
      navigate("/events");
    }
  }, [eventId, navigate]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 max-w-7xl py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3">
            <Skeleton className="h-96 w-full mb-8" />
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-2" />
            <Skeleton className="h-6 w-1/3 mb-8" />
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="w-full lg:w-1/3">
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="container mx-auto px-6 max-w-7xl py-16 text-center">
        <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Event Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The event you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => navigate("/events")}>Browse Events</Button>
      </div>
    );
  }

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
    <>
      <Helmet>
        <title>{event.title} | EventHub</title>
        <meta name="description" content={event.description.substring(0, 160)} />
      </Helmet>

      <div className="container mx-auto px-6 max-w-7xl py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Event Details Section */}
          <div className="w-full lg:w-2/3">
            <div className="relative h-96 rounded-lg overflow-hidden mb-6">
              <img 
                src={imageUrl} 
                alt={event.title} 
                className="w-full h-full object-cover"
              />
              {event.isFeatured && (
                <Badge variant="accent" className="absolute top-4 left-4">
                  Featured
                </Badge>
              )}
            </div>

            <h1 className="text-3xl font-bold mb-3">{event.title}</h1>
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{formatDate(new Date(event.startDate))}</span>
                {event.startDate !== event.endDate && (
                  <span> - {formatDate(new Date(event.endDate))}</span>
                )}
              </div>
              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{format(new Date(event.startDate), 'h:mm a')}</span>
              </div>
              <div className="flex items-center text-sm">
                {event.isVirtual ? (
                  <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                ) : (
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                )}
                <span>{event.location}</span>
              </div>
              <Badge variant="category">{event.category.name}</Badge>
            </div>

            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
                <TabsTrigger value="organizer">Organizer</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="mt-6">
                <h2 className="text-xl font-semibold mb-4">About this event</h2>
                <div className="prose max-w-none">
                  <p className="whitespace-pre-line">{event.description}</p>
                </div>
              </TabsContent>
              <TabsContent value="location" className="mt-6">
                <h2 className="text-xl font-semibold mb-4">Location</h2>
                {event.isVirtual ? (
                  <div>
                    <Badge variant="outline" className="mb-4">
                      <Globe className="h-4 w-4 mr-2" /> 
                      Online Event
                    </Badge>
                    <p className="mb-2">This is a virtual event that will take place online.</p>
                    {event.virtualMeetingLink && (
                      <a 
                        href={event.virtualMeetingLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-accent hover:underline"
                      >
                        Join virtual event 
                        <ExternalLink className="h-4 w-4 ml-1" />
                      </a>
                    )}
                  </div>
                ) : (
                  <div>
                    <p className="font-medium mb-1">{event.location}</p>
                    {event.address && <p className="text-muted-foreground mb-4">{event.address}</p>}
                    <div className="w-full h-64 bg-muted rounded-md flex items-center justify-center">
                      <MapPin className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="organizer" className="mt-6">
                <h2 className="text-xl font-semibold mb-4">Organizer</h2>
                <div className="flex items-center mb-4">
                  <div className="bg-muted h-12 w-12 rounded-full flex items-center justify-center mr-3">
                    {event.organizer.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-medium">{event.organizer.name}</h3>
                    <p className="text-sm text-muted-foreground">Event Organizer</p>
                  </div>
                </div>
                {event.organizer.bio && (
                  <p className="text-sm">{event.organizer.bio}</p>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Ticket Section */}
          <div className="w-full lg:w-1/3">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Registration</CardTitle>
                <CardDescription>
                  {event.tickets.length > 0 
                    ? "Select your tickets and register for this event" 
                    : "Registration information"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {event.tickets.length > 0 ? (
                  <>
                    <div className="space-y-4 mb-6">
                      {event.tickets.map((ticket) => (
                        <div 
                          key={ticket.id} 
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedTicket?.id === ticket.id 
                              ? "border-primary bg-primary/5" 
                              : "hover:border-accent"
                          }`}
                          onClick={() => setSelectedTicket(ticket)}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-medium">{ticket.name}</h3>
                              {ticket.description && (
                                <p className="text-sm text-muted-foreground">{ticket.description}</p>
                              )}
                            </div>
                            <Badge variant="price">
                              {ticket.price === 0 ? "Free" : `$${ticket.price.toFixed(2)}`}
                            </Badge>
                          </div>
                          <div className="text-sm flex items-center">
                            <Users className="h-3 w-3 mr-1 text-muted-foreground" />
                            <span>{ticket.available} remaining</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {selectedTicket && (
                      <>
                        <div className="mb-6">
                          <label className="block text-sm font-medium mb-2">Quantity</label>
                          <Select 
                            value={quantity.toString()} 
                            onValueChange={(value) => setQuantity(parseInt(value))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select quantity" />
                            </SelectTrigger>
                            <SelectContent>
                              {[...Array(Math.min(10, selectedTicket.available))].map((_, i) => (
                                <SelectItem key={i + 1} value={(i + 1).toString()}>
                                  {i + 1}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="flex justify-between font-medium">
                            <span>Subtotal</span>
                            <span>
                              {selectedTicket.price === 0 
                                ? "Free" 
                                : `$${(selectedTicket.price * quantity).toFixed(2)}`}
                            </span>
                          </div>
                          
                          <Dialog open={registerDialogOpen} onOpenChange={setRegisterDialogOpen}>
                            <DialogTrigger asChild>
                              <Button className="w-full">Register</Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Confirm Registration</DialogTitle>
                                <DialogDescription>
                                  You're about to register for {event.title}
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="py-4">
                                <div className="flex justify-between mb-2">
                                  <span className="font-medium">{selectedTicket.name}</span>
                                  <span>
                                    {selectedTicket.price === 0 
                                      ? "Free" 
                                      : `$${selectedTicket.price.toFixed(2)}`}
                                  </span>
                                </div>
                                <div className="flex justify-between mb-4">
                                  <span>Quantity</span>
                                  <span>{quantity}</span>
                                </div>
                                
                                <Separator className="my-4" />
                                
                                <div className="flex justify-between font-bold">
                                  <span>Total</span>
                                  <span>
                                    {selectedTicket.price === 0 
                                      ? "Free" 
                                      : `$${(selectedTicket.price * quantity).toFixed(2)}`}
                                  </span>
                                </div>
                              </div>
                              
                              <DialogFooter>
                                <Button 
                                  variant="outline" 
                                  onClick={() => setRegisterDialogOpen(false)}
                                >
                                  Cancel
                                </Button>
                                <Button 
                                  onClick={handleRegister}
                                  disabled={registerMutation.isPending}
                                >
                                  {registerMutation.isPending ? "Processing..." : "Confirm Registration"}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="text-center py-6">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-medium mb-2">No tickets available</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      This event doesn't have any tickets available for registration.
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <Button variant="ghost" size="sm" onClick={() => navigate("/events")}>
                  Back to Events
                </Button>
                {user?.id === event.organizer.id && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate("/dashboard")}
                  >
                    Manage Event
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventDetail;

import { RegistrationWithDetails } from "@shared/schema";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, MapPinIcon, Clock, Download, ExternalLink } from "lucide-react";
import { format } from "date-fns";

interface TicketCardProps {
  registration: RegistrationWithDetails;
  isUpcoming: boolean;
}

export default function TicketCard({ registration, isUpcoming }: TicketCardProps) {
  const { event, ticketType, quantity, totalPrice, status, purchaseDate } = registration;
  const eventDate = new Date(event.startDate);
  const formattedDate = format(eventDate, "EEEE, MMMM d, yyyy");
  const formattedTime = format(eventDate, "h:mm a");
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
          <div className="flex-1">
            <div className="flex items-start space-x-4">
              <div className="h-16 w-16 flex-shrink-0 rounded-md overflow-hidden">
                <img 
                  src={event.imageUrl} 
                  alt={event.title} 
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-secondary">{event.title}</h3>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <CalendarIcon className="mr-1 h-4 w-4" />
                  <span>{formattedDate} at {formattedTime}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <MapPinIcon className="mr-1 h-4 w-4" />
                  <span>{event.location}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 px-4 py-3 bg-gray-50 rounded-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Ticket Type:</span>
                <span className="text-sm">{ticketType.name}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Quantity:</span>
                <span className="text-sm">{quantity}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Price per Ticket:</span>
                <span className="text-sm">{formatCurrency(ticketType.price / 100)}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                <span className="text-sm font-medium">Total:</span>
                <span className="text-sm font-semibold">{formatCurrency(totalPrice / 100)}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 md:mt-0 md:ml-6 md:w-1/4 flex flex-col items-center">
            <div className="bg-gray-100 px-4 py-3 rounded-lg w-full text-center mb-3">
              <div className="text-sm text-gray-500">Status</div>
              <div className="text-lg font-medium capitalize">{status}</div>
            </div>
            
            <div className="text-sm text-gray-500 mb-3 text-center">
              <div>Purchased on</div>
              <div>{format(new Date(purchaseDate), "MMM d, yyyy")}</div>
            </div>
            
            <div className="text-sm text-gray-500 text-center">
              Order #: {registration.id.toString().padStart(8, '0')}
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="bg-gray-50 px-6 py-4 flex flex-wrap gap-2">
        {isUpcoming ? (
          <>
            <Button variant="outline" className="flex-1" onClick={() => window.print()}>
              <Download className="mr-2 h-4 w-4" /> Download
            </Button>
            <Button 
              className="flex-1 bg-primary hover:bg-primary/90"
              onClick={() => window.open(`/events/${event.id}`, '_blank')}
            >
              <ExternalLink className="mr-2 h-4 w-4" /> View Event
            </Button>
          </>
        ) : (
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => window.open(`/events/${event.id}`, '_blank')}
          >
            <ExternalLink className="mr-2 h-4 w-4" /> View Event
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

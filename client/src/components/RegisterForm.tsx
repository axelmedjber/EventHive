import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/App";
import { TicketType, ticketPurchaseSchema, TicketPurchase } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { formatCurrency } from "@/lib/utils";

interface RegisterFormProps {
  eventId: number;
}

export default function RegisterForm({ eventId }: RegisterFormProps) {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [ticketTypeId, setTicketTypeId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [successDialog, setSuccessDialog] = useState(false);
  
  const { data: ticketTypes, isLoading } = useQuery<TicketType[]>({
    queryKey: [`/api/events/${eventId}/tickets`],
  });
  
  const selectedTicket = ticketTypes?.find(ticket => ticket.id === ticketTypeId);
  
  useEffect(() => {
    if (selectedTicket) {
      setTotalPrice(selectedTicket.price * quantity);
    } else {
      setTotalPrice(0);
    }
  }, [selectedTicket, quantity]);
  
  const form = useForm<TicketPurchase>({
    resolver: zodResolver(ticketPurchaseSchema),
    defaultValues: {
      eventId: eventId,
      userId: user?.id || 0,
      ticketTypeId: 0,
      quantity: 1,
      totalPrice: 0,
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: TicketPurchase) => {
      const response = await apiRequest("POST", `/api/events/${eventId}/register`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/events/${eventId}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user?.id}/registrations`] });
      setShowConfirmDialog(false);
      setSuccessDialog(true);
    },
    onError: (error) => {
      setShowConfirmDialog(false);
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    },
  });
  
  const handleRegister = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to register for this event",
        variant: "destructive",
      });
      return;
    }
    
    if (!ticketTypeId) {
      toast({
        title: "Ticket selection required",
        description: "Please select a ticket type",
        variant: "destructive",
      });
      return;
    }
    
    setShowConfirmDialog(true);
  };
  
  const confirmRegistration = () => {
    if (!user || !ticketTypeId) return;
    
    const data: TicketPurchase = {
      eventId,
      userId: user.id,
      ticketTypeId,
      quantity,
      totalPrice,
    };
    
    registerMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-slate-200 rounded"></div>
          <div className="h-10 bg-slate-200 rounded"></div>
          <div className="h-10 bg-slate-200 rounded"></div>
          <div className="h-10 bg-slate-200 rounded w-1/2"></div>
          <div className="h-12 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }
  
  if (!ticketTypes || ticketTypes.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-center text-gray-500">Tickets are not available for this event yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold text-secondary mb-4">Register for this Event</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Ticket Type
          </label>
          <Select onValueChange={(value) => setTicketTypeId(parseInt(value))}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a ticket type" />
            </SelectTrigger>
            <SelectContent>
              {ticketTypes.map((ticket) => (
                <SelectItem key={ticket.id} value={ticket.id.toString()}>
                  {ticket.name} - {formatCurrency(ticket.price / 100)}
                  {ticket.quantity < 10 && ` (Only ${ticket.quantity} left)`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedTicket?.description && (
            <p className="mt-1 text-sm text-gray-500">{selectedTicket.description}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quantity
          </label>
          <Input
            type="number"
            min={1}
            max={selectedTicket?.quantity || 1}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            className="w-24"
          />
        </div>
        
        {selectedTicket && (
          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Price per ticket:</span>
              <span className="text-sm font-medium">{formatCurrency(selectedTicket.price / 100)}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-sm text-gray-500">Quantity:</span>
              <span className="text-sm">{quantity}</span>
            </div>
            <div className="flex justify-between mt-2 border-t border-gray-100 pt-2">
              <span className="font-medium">Total:</span>
              <span className="font-medium">{formatCurrency(totalPrice / 100)}</span>
            </div>
          </div>
        )}
        
        <Button 
          className="w-full bg-primary hover:bg-primary/90 mt-4"
          onClick={handleRegister}
          disabled={!ticketTypeId || registerMutation.isPending}
        >
          {registerMutation.isPending ? "Processing..." : "Register Now"}
        </Button>
      </div>
      
      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Registration</DialogTitle>
            <DialogDescription>
              Please review your ticket selection before confirming.
            </DialogDescription>
          </DialogHeader>
          
          {selectedTicket && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-2">
                <span className="text-sm text-gray-500">Ticket Type:</span>
                <span className="text-sm font-medium">{selectedTicket.name}</span>
                
                <span className="text-sm text-gray-500">Price per ticket:</span>
                <span className="text-sm">{formatCurrency(selectedTicket.price / 100)}</span>
                
                <span className="text-sm text-gray-500">Quantity:</span>
                <span className="text-sm">{quantity}</span>
                
                <span className="text-sm font-medium">Total:</span>
                <span className="text-sm font-medium">{formatCurrency(totalPrice / 100)}</span>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-primary hover:bg-primary/90"
              onClick={confirmRegistration}
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? "Processing..." : "Confirm Purchase"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Success Dialog */}
      <Dialog open={successDialog} onOpenChange={setSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registration Successful!</DialogTitle>
            <DialogDescription>
              Your registration for this event has been confirmed. You can view your tickets in the My Tickets section.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setSuccessDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

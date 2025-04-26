import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { InsertTicketType } from "@shared/schema";
import { insertTicketTypeSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface TicketFormProps {
  eventId: number;
  onTicketAdded?: () => void;
}

export default function TicketForm({ eventId, onTicketAdded }: TicketFormProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<InsertTicketType>({
    resolver: zodResolver(insertTicketTypeSchema),
    defaultValues: {
      eventId: eventId,
      name: "",
      price: 0,
      quantity: 0,
      description: "",
    },
  });

  const createTicket = useMutation({
    mutationFn: async (data: InsertTicketType) => {
      const response = await apiRequest("POST", `/api/events/${eventId}/tickets`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/events/${eventId}/tickets`] });
      queryClient.invalidateQueries({ queryKey: [`/api/events/${eventId}`] });
      toast({
        title: "Ticket type added",
        description: "The ticket type has been added successfully!",
      });
      form.reset({
        eventId: eventId,
        name: "",
        price: 0,
        quantity: 0,
        description: "",
      });
      setIsOpen(false);
      if (onTicketAdded) onTicketAdded();
    },
    onError: (error) => {
      toast({
        title: "Failed to add ticket type",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertTicketType) => {
    // Convert price to cents
    data.price = data.price * 100;
    createTicket.mutate(data);
  };

  return (
    <div className="mb-8">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-primary hover:bg-primary/90 text-white"
        >
          Add Ticket Type
        </Button>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow mt-4">
          <h3 className="text-lg font-semibold text-secondary mb-4">Add Ticket Type</h3>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ticket Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., General Admission, VIP, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter price"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Available Quantity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter quantity"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe what's included with this ticket" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end space-x-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-primary hover:bg-primary/90"
                  disabled={createTicket.isPending}
                >
                  {createTicket.isPending ? "Adding..." : "Add Ticket Type"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
}

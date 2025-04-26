import { Helmet } from "react-helmet";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useLocation } from "wouter";
import EventForm from "@/components/events/EventForm";

const CreateEvent = () => {
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !user) {
      navigate("/login?redirect=/create");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 max-w-5xl py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-muted rounded w-1/3"></div>
          <div className="h-6 bg-muted rounded w-1/2"></div>
          <div className="h-96 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <>
      <Helmet>
        <title>Create New Event | EventHub</title>
        <meta name="description" content="Create and publish your event on EventHub to connect with attendees and sell tickets." />
      </Helmet>

      <div className="container mx-auto px-6 max-w-5xl py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create Your Event</h1>
          <p className="text-muted-foreground">
            Fill in the details below to create and publish your event
          </p>
        </div>

        <EventForm />
      </div>
    </>
  );
};

export default CreateEvent;

import { useEffect } from "react";
import EventForm from "@/components/EventForm";
import { useAuth } from "@/App";

export default function CreateEvent() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    document.title = "Create an Event - EventHub";
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-secondary mb-6">Create an Event</h1>
      
      {!isAuthenticated ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <h2 className="text-xl font-semibold text-secondary mb-4">Please log in to create an event</h2>
          <p className="mb-4">You need to be logged in to create and manage events.</p>
        </div>
      ) : (
        <EventForm />
      )}
      
      <div className="mt-8 bg-gray-50 rounded-lg p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-secondary mb-4">Tips for creating successful events</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Add a compelling event image that clearly shows what your event is about</li>
          <li>Write a detailed description to help attendees understand what to expect</li>
          <li>Set an appropriate ticket price based on your event's value</li>
          <li>Promote your event on social media and to your network</li>
          <li>Send reminders to registered attendees as the event date approaches</li>
        </ul>
      </div>
    </div>
  );
}

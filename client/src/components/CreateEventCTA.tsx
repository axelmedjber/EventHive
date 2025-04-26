import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/App";

export default function CreateEventCTA() {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-secondary rounded-xl shadow-xl overflow-hidden">
          <div className="px-6 py-12 sm:px-12 lg:px-16 lg:py-16 flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 text-center lg:text-left">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                <span className="block">Ready to host your own event?</span>
              </h2>
              <p className="mt-4 text-lg leading-6 text-gray-300">
                Set up in minutes and reach thousands of potential attendees. Our platform makes it easy to create, manage, and promote your events.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row justify-center lg:justify-start gap-3">
                <Link href="/create-event">
                  <Button className="w-full bg-white text-secondary hover:bg-gray-50">
                    Create an Event
                  </Button>
                </Link>
                {!isAuthenticated && (
                  <Link href="/browse">
                    <Button variant="default" className="w-full bg-primary hover:bg-primary/90 text-white mt-3 sm:mt-0">
                      Learn More
                    </Button>
                  </Link>
                )}
              </div>
            </div>
            <div className="mt-10 lg:mt-0 lg:ml-8 lg:w-1/2">
              <img 
                className="h-64 w-full object-cover lg:h-80 rounded-lg shadow-lg" 
                src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80" 
                alt="Event venue" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

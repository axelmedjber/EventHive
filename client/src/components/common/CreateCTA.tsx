import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const CreateCTA = () => {
  return (
    <section className="py-16 bg-secondary">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-10">
          <div className="w-full lg:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1560439514-4e9645039924?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Person creating an event" 
              className="rounded-lg shadow-xl w-full h-auto"
            />
          </div>
          
          <div className="w-full lg:w-1/2 text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Create your own event</h2>
            <p className="text-lg md:text-xl mb-8 opacity-90">Share your passion, build your community, and grow your business with EventHub's powerful event management tools.</p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold mb-1">Easy to use</h3>
                  <p className="opacity-80">Our intuitive event creation process makes it simple to set up and manage your events.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold mb-1">Powerful tools</h3>
                  <p className="opacity-80">From ticketing to promotion, we provide everything you need for successful events.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold mb-1">Reach more people</h3>
                  <p className="opacity-80">Get discovered by our community of event-goers looking for experiences like yours.</p>
                </div>
              </div>
            </div>
            
            <Link href="/create">
              <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-6 h-auto text-lg">
                Start Creating
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreateCTA;

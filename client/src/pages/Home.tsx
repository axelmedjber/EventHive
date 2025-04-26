import { Helmet } from "react-helmet";
import Hero from "@/components/common/Hero";
import CategoryFilters from "@/components/events/CategoryFilters";
import EventGrid from "@/components/events/EventGrid";
import CreateCTA from "@/components/common/CreateCTA";
import PopularLocations from "@/components/common/LocationCard";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const CTASection = () => {
  return (
    <section className="py-12 bg-muted">
      <div className="container mx-auto px-6 max-w-7xl text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to discover amazing events?</h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto">Join thousands of event-goers and find your next unforgettable experience today.</p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/events">
            <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 h-auto">
              Browse Events
            </Button>
          </Link>
          <Link href="/create">
            <Button 
              variant="outline" 
              className="border-2 border-secondary text-secondary hover:bg-secondary hover:text-white px-8 py-3 h-auto"
            >
              Create an Event
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

const Home = () => {
  return (
    <>
      <Helmet>
        <title>EventHub - Discover & Create Events</title>
        <meta name="description" content="Find and book tickets for concerts, workshops, conferences and more. Or create your own event with our easy-to-use platform." />
      </Helmet>
      
      <Hero />
      
      <CategoryFilters />
      
      <EventGrid 
        title="Popular Events" 
        filterControls={true}
        maxItems={6}
        featured={true}
      />
      
      <CreateCTA />
      
      <PopularLocations />
      
      <CTASection />
    </>
  );
};

export default Home;

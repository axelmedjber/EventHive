import { Helmet } from "react-helmet";
import Hero from "@/components/common/Hero";
import CategoryFilters from "@/components/events/CategoryFilters";
import EventGrid from "@/components/events/EventGrid";
import CreateCTA from "@/components/common/CreateCTA";
import PopularLocations from "@/components/common/LocationCard";
import TranslationDemo from "@/components/common/TranslationDemo";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import TranslatedText from "@/components/common/TranslatedText";
import TranslatedButton from "@/components/common/TranslatedButton";
import TranslatedBadge from "@/components/common/TranslatedBadge";

const CTASection = () => {
  return (
    <section className="py-12 bg-muted">
      <div className="container mx-auto px-6 max-w-7xl text-center">
        <h2 className="text-3xl font-bold mb-6">
          <TranslatedText text="Ready to discover amazing events?" />
        </h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          <TranslatedText 
            text="Join thousands of event-goers and find your next unforgettable experience today." 
          />
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/events">
            <TranslatedButton 
              text="Browse Events"
              className="bg-primary hover:bg-primary/90 text-white px-8 py-3 h-auto" 
            />
          </Link>
          <Link href="/create">
            <TranslatedButton 
              text="Create an Event"
              variant="outline" 
              className="border-2 border-secondary text-secondary hover:bg-secondary hover:text-white px-8 py-3 h-auto"
            />
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
      
      {/* Multi-language Translation Demo */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-6 max-w-7xl">
          <h2 className="text-3xl font-bold mb-8 text-center">
            <TranslatedText text="Multi-language Support" />
          </h2>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <TranslatedBadge text="Translate to any language" variant="outline" />
            <TranslatedBadge text="Powered by Google Translate" variant="secondary" />
            <TranslatedBadge text="Automatic UI translation" variant="default" />
          </div>
          
          <div className="max-w-2xl mx-auto">
            <TranslationDemo />
          </div>
        </div>
      </section>
      
      <PopularLocations />
      
      <CTASection />
    </>
  );
};

export default Home;

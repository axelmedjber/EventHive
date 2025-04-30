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
import LanguageMoodDisplay from "@/components/common/LanguageMoodDisplay";

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
      
      {/* Multi-language Translation Demo with Mood Indicators */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col items-center gap-2 mb-8">
            <h2 className="text-3xl font-bold text-center">
              <TranslatedText text="Multi-language Support" />
            </h2>
            
            {/* Language Mood Display - Shows the current language "mood" */}
            <div className="flex items-center gap-3 mt-2">
              <LanguageMoodDisplay size="lg" animate={true} />
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <TranslatedBadge text="Language Mood Indicators" variant="outline" />
            <TranslatedBadge text="English-French Translation" variant="secondary" />
            <TranslatedBadge text="Time-aware Emoji Moods" variant="default" />
          </div>
          
          <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-xl">
                  <TranslatedText text="Language Mood" />
                </h3>
                <p className="text-muted-foreground">
                  <TranslatedText text="Our application now shows emoji mood indicators that change based on the selected language and time of day." />
                </p>
                <div className="flex gap-3 items-center">
                  <LanguageMoodDisplay showLabel={false} size="lg" />
                  <span className="text-sm text-muted-foreground">← Morning mood</span>
                </div>
                <div className="flex gap-3 items-center">
                  <LanguageMoodDisplay showLabel={false} size="lg" />
                  <span className="text-sm text-muted-foreground">← Afternoon mood</span>
                </div>
              </div>
              
              <div>
                <TranslationDemo />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <PopularLocations />
      
      <CTASection />
    </>
  );
};

export default Home;

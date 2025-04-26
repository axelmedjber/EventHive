import SearchFilter from "@/components/events/SearchFilter";

const Hero = () => {
  return (
    <section className="relative bg-secondary overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="flex flex-col items-center text-center py-12 md:py-24">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Find your next experience</h1>
          <p className="text-white text-lg md:text-xl mb-10 max-w-2xl">Discover events that match your passions or create your own</p>
          
          {/* Event search form */}
          <SearchFilter />
        </div>
      </div>
      
      {/* Background hero image with overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
          alt="People enjoying an event" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-secondary bg-opacity-70"></div>
      </div>
    </section>
  );
};

export default Hero;

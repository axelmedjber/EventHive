import { Link } from "wouter";

interface LocationCardProps {
  image: string;
  name: string;
  eventCount: number;
}

const LocationCard = ({ image, name, eventCount }: LocationCardProps) => {
  return (
    <Link href={`/events?location=${encodeURIComponent(name)}`}>
      <div className="group relative rounded-lg overflow-hidden h-40 cursor-pointer">
        <img 
          src={image} 
          alt={`${name} events`} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="font-medium text-lg">{name}</h3>
          <p className="text-sm opacity-90">{eventCount} events</p>
        </div>
      </div>
    </Link>
  );
};

const PopularLocations = () => {
  const locations = [
    {
      name: "New York",
      image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      eventCount: 452
    },
    {
      name: "Los Angeles",
      image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      eventCount: 325
    },
    {
      name: "Chicago",
      image: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      eventCount: 215
    },
    {
      name: "Miami",
      image: "https://images.unsplash.com/photo-1564565562150-46e11cc9e066?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      eventCount: 182
    }
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-6 max-w-7xl">
        <h2 className="text-2xl font-semibold mb-8">Popular Event Locations</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {locations.map((location, index) => (
            <LocationCard 
              key={index}
              name={location.name}
              image={location.image}
              eventCount={location.eventCount}
            />
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <Link href="/events">
            <div className="text-accent hover:underline font-medium inline-flex items-center cursor-pointer">
              View all locations 
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopularLocations;

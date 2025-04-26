import { useState } from "react";
import { useLocation } from "wouter";
import { CalendarIcon, MapPinIcon, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";

export default function Hero() {
  const [_, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [locationTerm, setLocationTerm] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Build the query parameters
    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm);
    if (locationTerm) params.set("location", locationTerm);
    if (date) params.set("date", date.toISOString().split('T')[0]);
    
    // Navigate to the browse page with query parameters
    setLocation(`/browse?${params.toString()}`);
  };

  return (
    <div className="relative bg-secondary">
      <div className="absolute inset-0">
        <img 
          className="w-full h-full object-cover" 
          src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&h=450&q=80" 
          alt="Event audience" 
        />
        <div className="absolute inset-0 bg-secondary bg-opacity-70 mix-blend-multiply"></div>
      </div>
      <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">Find your next experience</h1>
        <p className="mt-6 max-w-3xl text-xl text-gray-300">Discover events that match your passions, or create your own.</p>
        <div className="mt-10 w-full max-w-3xl">
          <form onSubmit={handleSearch} className="bg-white shadow-md rounded-lg p-3 flex flex-col md:flex-row">
            <div className="flex-1 mb-3 md:mb-0 md:mr-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Search events or categories"
                  className="pl-10 pr-3 py-2"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex-1 mb-3 md:mb-0 md:mr-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPinIcon className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="City or location"
                  className="pl-10 pr-3 py-2"
                  value={locationTerm}
                  onChange={(e) => setLocationTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex-1 mb-3 md:mb-0 md:mr-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                </div>
                <DatePicker
                  date={date}
                  setDate={setDate}
                  className="pl-10 pr-3 py-2 border border-input rounded-md w-full"
                  placeholder="Select date"
                />
              </div>
            </div>
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-white px-6 py-2">
              Search
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

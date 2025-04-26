import { useState, FormEvent } from "react";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Calendar } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SearchFilter = () => {
  const [_, navigate] = useLocation();
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("any");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    let searchParams = new URLSearchParams();
    if (keyword) searchParams.append("search", keyword);
    if (location) searchParams.append("location", location);
    if (date !== "any") searchParams.append("date", date);
    
    navigate(`/events?${searchParams.toString()}`);
  };

  return (
    <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
      <form onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border-gray">
          <div className="p-4">
            <label className="block text-sm font-medium text-foreground mb-1">What</label>
            <div className="flex items-center">
              <Search className="h-4 w-4 text-muted-foreground mr-2" />
              <Input 
                type="text" 
                placeholder="Event title, keywords" 
                className="w-full border-none focus:outline-none focus:ring-0 p-0 shadow-none h-auto"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
          </div>
          
          <div className="p-4">
            <label className="block text-sm font-medium text-foreground mb-1">Where</label>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
              <Input 
                type="text" 
                placeholder="Location" 
                className="w-full border-none focus:outline-none focus:ring-0 p-0 shadow-none h-auto"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>
          
          <div className="p-4">
            <label className="block text-sm font-medium text-foreground mb-1">When</label>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
              <Select value={date} onValueChange={setDate}>
                <SelectTrigger className="border-none focus:ring-0 shadow-none p-0">
                  <SelectValue placeholder="Any date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any date</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="weekend">This weekend</SelectItem>
                  <SelectItem value="week">This week</SelectItem>
                  <SelectItem value="month">This month</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <div className="bg-muted p-4 flex justify-end">
          <Button type="submit" className="bg-accent hover:bg-accent/90 text-white px-6 py-2 rounded-md font-medium transition-colors">
            Find Events
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SearchFilter;

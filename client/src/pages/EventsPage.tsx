import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Search, Filter } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Category } from "@shared/schema";
import EventGrid from "@/components/events/EventGrid";

const EventsPage = () => {
  const [location, search] = useLocation();
  const params = new URLSearchParams(search);
  
  // Extract URL parameters
  const [searchQuery, setSearchQuery] = useState(params.get('search') || '');
  const [locationFilter, setLocationFilter] = useState(params.get('location') || '');
  const [dateFilter, setDateFilter] = useState(params.get('date') || 'any');
  const [categoryFilter, setCategoryFilter] = useState(params.get('category') || 'all');
  const [priceFilter, setPriceFilter] = useState(params.get('price') || 'any');
  const [formatFilter, setFormatFilter] = useState(params.get('format') || 'any');
  
  // Fetch categories
  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
    queryFn: async () => {
      return fetch('/api/categories').then(res => res.json());
    }
  });
  
  // Apply filters
  const applyFilters = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (locationFilter) params.append('location', locationFilter);
    if (dateFilter !== 'any') params.append('date', dateFilter);
    if (categoryFilter && categoryFilter !== 'all') params.append('category', categoryFilter);
    if (priceFilter !== 'any') params.append('price', priceFilter);
    if (formatFilter !== 'any') params.append('format', formatFilter);
    
    window.history.replaceState(null, '', `?${params.toString()}`);
  };
  
  // Reset filters
  const resetFilters = () => {
    setSearchQuery('');
    setLocationFilter('');
    setDateFilter('any');
    setCategoryFilter('all');
    setPriceFilter('any');
    setFormatFilter('any');
  };
  
  // Handle search form submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  // Update URL when filters change
  useEffect(() => {
    applyFilters();
  }, [dateFilter, categoryFilter, priceFilter, formatFilter]);

  return (
    <>
      <Helmet>
        <title>Browse Events | EventHub</title>
        <meta name="description" content="Discover and browse through upcoming events. Find concerts, workshops, conferences and more." />
      </Helmet>

      <div className="bg-muted py-8">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <h1 className="text-3xl font-bold mb-4 md:mb-0">Events</h1>
            
            <div className="flex space-x-2">
              {/* Mobile filters */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="md:hidden">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>
                      Refine your search results
                    </SheetDescription>
                  </SheetHeader>
                  
                  <div className="py-4 space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Date</label>
                      <Select value={dateFilter} onValueChange={setDateFilter}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Any date" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any date</SelectItem>
                          <SelectItem value="today">Today</SelectItem>
                          <SelectItem value="tomorrow">Tomorrow</SelectItem>
                          <SelectItem value="weekend">This weekend</SelectItem>
                          <SelectItem value="week">This week</SelectItem>
                          <SelectItem value="month">This month</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-1 block">Category</label>
                      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="All categories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All categories</SelectItem>
                          {categories?.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-1 block">Price</label>
                      <Select value={priceFilter} onValueChange={setPriceFilter}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Any price" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any price</SelectItem>
                          <SelectItem value="free">Free</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-1 block">Format</label>
                      <Select value={formatFilter} onValueChange={setFormatFilter}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Any format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any format</SelectItem>
                          <SelectItem value="inperson">In person</SelectItem>
                          <SelectItem value="online">Online</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <SheetFooter>
                    <Button variant="outline" onClick={resetFilters}>Reset Filters</Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
              
              {/* Search form */}
              <form onSubmit={handleSearchSubmit} className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search events..."
                    className="pl-10 w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </form>
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Desktop sidebar filters */}
            <div className="hidden md:block w-full lg:w-1/4">
              <Card>
                <CardHeader>
                  <CardTitle>Filters</CardTitle>
                  <CardDescription>Refine your search results</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        type="text" 
                        placeholder="Enter location" 
                        className="pl-10"
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                        onBlur={applyFilters}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Select value={dateFilter} onValueChange={setDateFilter}>
                        <SelectTrigger className="pl-10">
                          <SelectValue placeholder="Any date" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any date</SelectItem>
                          <SelectItem value="today">Today</SelectItem>
                          <SelectItem value="tomorrow">Tomorrow</SelectItem>
                          <SelectItem value="weekend">This weekend</SelectItem>
                          <SelectItem value="week">This week</SelectItem>
                          <SelectItem value="month">This month</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Category</label>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All categories</SelectItem>
                        {categories?.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Price</label>
                    <Select value={priceFilter} onValueChange={setPriceFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Any price" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any price</SelectItem>
                        <SelectItem value="free">Free</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Format</label>
                    <Select value={formatFilter} onValueChange={setFormatFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Any format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any format</SelectItem>
                        <SelectItem value="inperson">In person</SelectItem>
                        <SelectItem value="online">Online</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={resetFilters}
                  >
                    Reset Filters
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            {/* Event Grid */}
            <div className="w-full lg:w-3/4">
              <EventGrid 
                title={searchQuery ? `Search results for "${searchQuery}"` : "All Events"} 
                filterControls={false}
                categoryId={categoryFilter && categoryFilter !== 'all' ? parseInt(categoryFilter) : undefined}
                searchQuery={searchQuery}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventsPage;

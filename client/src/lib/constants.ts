// Event categories and their icons
export const CATEGORIES = [
  { id: 1, name: "Music", slug: "music", icon: "music" },
  { id: 2, name: "Food & Drink", slug: "food-drink", icon: "utensils" },
  { id: 3, name: "Technology", slug: "technology", icon: "laptop" },
  { id: 4, name: "Arts", slug: "arts", icon: "palette" },
  { id: 5, name: "Sports", slug: "sports", icon: "running" },
  { id: 6, name: "Business", slug: "business", icon: "briefcase" }
];

// Popular cities for events
export const POPULAR_LOCATIONS = [
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

// Event image placeholders
export const EVENT_IMAGES = [
  "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1520155346-36773ab29479?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", 
  "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
];

// Price range options
export const PRICE_RANGES = [
  { label: "Any price", value: "any" },
  { label: "Free", value: "free" },
  { label: "Paid", value: "paid" },
  { label: "$0-$25", value: "0-25" },
  { label: "$25-$50", value: "25-50" },
  { label: "$50+", value: "50+" }
];

// Date filter options
export const DATE_FILTERS = [
  { label: "Any date", value: "any" },
  { label: "Today", value: "today" },
  { label: "Tomorrow", value: "tomorrow" },
  { label: "This weekend", value: "weekend" },
  { label: "This week", value: "week" },
  { label: "This month", value: "month" }
];

// Event format options
export const FORMAT_FILTERS = [
  { label: "Format: Any", value: "any" },
  { label: "In person", value: "inperson" },
  { label: "Online", value: "online" }
];

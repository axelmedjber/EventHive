import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Category } from "@shared/schema";
import { 
  Music, 
  Utensils, 
  Laptop, 
  Palette, 
  Terminal, 
  MoreHorizontal, 
  Briefcase,
  GraduationCap, 
  Heart,
  PartyPopper
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const CategoryIcon = ({ icon }: { icon: string }) => {
  switch (icon) {
    case 'music':
      return <Music className="h-6 w-6 text-primary" />;
    case 'utensils':
      return <Utensils className="h-6 w-6 text-primary" />;
    case 'laptop':
      return <Laptop className="h-6 w-6 text-primary" />;
    case 'palette':
      return <Palette className="h-6 w-6 text-primary" />;
    case 'running':
      return <Terminal className="h-6 w-6 text-primary" />;
    case 'briefcase':
      return <Briefcase className="h-6 w-6 text-primary" />;
    case 'education':
      return <GraduationCap className="h-6 w-6 text-primary" />;
    case 'health':
      return <Heart className="h-6 w-6 text-primary" />;
    case 'entertainment':
      return <PartyPopper className="h-6 w-6 text-primary" />;
    default:
      return <MoreHorizontal className="h-6 w-6 text-primary" />;
  }
};

const CategoryFilters = () => {
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
    queryFn: async () => {
      return fetch('/api/categories').then(res => res.json());
    }
  });

  if (isLoading) {
    return (
      <section className="py-8 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <Skeleton className="w-16 h-16 rounded-full mb-2" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-6 max-w-7xl">
        <h2 className="text-2xl font-semibold mb-6">Browse by Category</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories?.map((category) => (
            <Link key={category.id} href={`/events?category=${category.id}`}>
              <a className="flex flex-col items-center group">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-2 group-hover:bg-primary/10 transition-colors">
                  <CategoryIcon icon={category.icon} />
                </div>
                <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                  {category.name}
                </span>
              </a>
            </Link>
          ))}
          
          <Link href="/events">
            <a className="flex flex-col items-center group">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-2 group-hover:bg-primary/10 transition-colors">
                <MoreHorizontal className="h-6 w-6 text-primary" />
              </div>
              <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                More
              </span>
            </a>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategoryFilters;

import { Category } from "@shared/schema";
import { 
  Music, Briefcase, Utensils, Palette, 
  Heart, Laptop, Users, Award
} from "lucide-react";

interface CategoryItemProps {
  category: Category;
  count?: number;
  onClick?: () => void;
}

const iconMap: Record<string, React.ReactNode> = {
  music: <Music className="h-10 w-10 text-primary" />,
  briefcase: <Briefcase className="h-10 w-10 text-primary" />,
  utensils: <Utensils className="h-10 w-10 text-primary" />,
  palette: <Palette className="h-10 w-10 text-primary" />,
  heart: <Heart className="h-10 w-10 text-primary" />,
  laptop: <Laptop className="h-10 w-10 text-primary" />,
  users: <Users className="h-10 w-10 text-primary" />,
  football: <Award className="h-10 w-10 text-primary" />,
};

export default function CategoryItem({ category, count, onClick }: CategoryItemProps) {
  const icon = iconMap[category.icon] || <Award className="h-10 w-10 text-primary" />;
  
  return (
    <div className="category-item" onClick={onClick}>
      <div className="category-icon">
        {icon}
      </div>
      <span className="text-secondary font-medium">{category.name}</span>
      {count !== undefined && (
        <span className="text-sm text-text/70">{count} events</span>
      )}
    </div>
  );
}

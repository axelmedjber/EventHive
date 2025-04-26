import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@shared/schema";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface CategorySelectorProps {
  onSelectCategory: (categoryId: number | null) => void;
  selectedCategoryId: number | null;
}

export default function CategorySelector({ 
  onSelectCategory, 
  selectedCategoryId 
}: CategorySelectorProps) {
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8">
        <div className="flex space-x-4 h-10">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex-shrink-0 bg-gray-200 animate-pulse h-10 w-24 rounded-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-4 pb-4">
          <button
            className={`category-button ${
              selectedCategoryId === null ? 'category-button-active' : 'category-button-inactive'
            }`}
            onClick={() => onSelectCategory(null)}
          >
            All Categories
          </button>
          {categories?.map((category) => (
            <button
              key={category.id}
              className={`category-button ${
                selectedCategoryId === category.id ? 'category-button-active' : 'category-button-inactive'
              }`}
              onClick={() => onSelectCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}

import React from 'react';
import { Category } from '../types';
import { Coffee, Utensils, Cake, Cookie } from 'lucide-react';

const iconMap: { [key: string]: React.ComponentType } = {
  coffee: Coffee,
  utensils: Utensils,
  cake: Cake,
  cookie: Cookie,
};

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <div className="flex gap-2 p-4 overflow-x-auto">
      <button
        onClick={() => onSelectCategory(null)}
        className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap
                   ${!selectedCategory 
                     ? 'bg-blue-600 text-white' 
                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
      >
        All Items
      </button>
      {categories.map((category) => {
        const Icon = iconMap[category.icon];
        return (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap
                       ${selectedCategory === category.id 
                         ? 'bg-blue-600 text-white' 
                         : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            {Icon && <Icon size={18} />}
            {category.name}
          </button>
        );
      })}
    </div>
  );
}
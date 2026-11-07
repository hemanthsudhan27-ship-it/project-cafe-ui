'use client';

import { categories } from '@/lib/data/categories';
import { CategoryId } from '@/lib/types/menu';
import { CategoryIcon } from '@/components/menu/CategoryIcon';

interface CategoryFilterProps {
  selected: CategoryId;
  onChange: (id: CategoryId) => void;
}

export function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
      {categories.map(cat => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-150 active:scale-95
            ${selected === cat.id
              ? 'bg-[#F47721] text-white border-[#F47721]'
              : 'bg-white text-[#777777] border-[#EEEEEE] hover:border-[#F47721] hover:text-[#F47721]'
            }`}
          aria-pressed={selected === cat.id}
        >
          <CategoryIcon id={cat.id} size={15} className="shrink-0" />
          <span>{cat.label}</span>
        </button>
      ))}
    </div>
  );
}


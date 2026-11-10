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
    <div className="relative w-full">
      <div
        role="tablist"
        aria-label="Filter food by category"
        className="flex gap-2 overflow-x-auto scrollbar-hide py-1 px-0.5 scroll-smooth select-none"
      >
        {categories.map(cat => {
          const isSelected = selected === cat.id;
          return (
            <button
              key={cat.id}
              role="tab"
              aria-selected={isSelected}
              onClick={() => onChange(cat.id)}
              className={`flex-shrink-0 min-h-[40px] flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold border transition-all duration-150 active:scale-95 cursor-pointer focus-ring
                ${
                  isSelected
                    ? 'bg-[#F47721] text-white border-[#F47721] shadow-xs'
                    : 'bg-white text-[#666666] border-[#EEEEEE] hover:border-[#F47721]/40 hover:text-[#F47721] hover:bg-[#FFF7F0]'
                }`}
            >
              <CategoryIcon id={cat.id} size={16} className="shrink-0" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

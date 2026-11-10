'use client';

import { Search, SlidersHorizontal, X } from 'lucide-react';
import { ChangeEvent } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  onFilterClick?: () => void;
  showFilter?: boolean;
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search dishes, drinks, snacks…',
  onFilterClick,
  showFilter = false,
}: SearchBarProps) {
  return (
    <div className="flex items-center gap-2 w-full">
      <div className="relative flex-1">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#666666] pointer-events-none"
        />
        <input
          type="search"
          role="searchbox"
          aria-label="Search cafeteria menu items"
          value={value}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full min-h-[44px] pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-[#FFF7F0] border border-[#EEEEEE] rounded-xl
            placeholder:text-[#888888] text-[#252525]
            focus:outline-none focus:border-[#F47721] focus:bg-white focus:ring-2 focus:ring-[#F47721]/20 transition-all"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#666666] hover:text-[#252525] p-1.5 rounded-full hover:bg-black/5 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Clear search input"
          >
            <X size={15} />
          </button>
        )}
      </div>
      {showFilter && onFilterClick && (
        <button
          type="button"
          onClick={onFilterClick}
          className="min-h-[44px] px-3.5 bg-[#FFF7F0] border border-[#EEEEEE] rounded-xl hover:bg-[#F47721] hover:text-white transition-colors active:scale-95 flex items-center justify-center cursor-pointer"
          aria-label="Filter menu items"
        >
          <SlidersHorizontal size={18} className="text-[#F47721] hover:text-white transition-colors" />
        </button>
      )}
    </div>
  );
}

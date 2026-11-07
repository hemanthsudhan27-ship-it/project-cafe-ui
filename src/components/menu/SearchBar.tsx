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
  placeholder = 'Search for food…',
  onFilterClick,
  showFilter = false,
}: SearchBarProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#777777]"
        />
        <input
          type="text"
          value={value}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-9 pr-4 py-3 text-sm bg-[#FFF7F0] border border-[#EEEEEE] rounded-xl
            placeholder:text-[#777777] text-[#252525]
            focus:outline-none focus:border-[#F47721] focus:bg-white transition-colors"
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#777777] hover:text-[#252525] p-1 rounded-full hover:bg-black/5 flex items-center justify-center transition-colors"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>
      {showFilter && onFilterClick && (
        <button
          onClick={onFilterClick}
          className="p-3 bg-[#FFF7F0] border border-[#EEEEEE] rounded-xl hover:bg-[#F47721] hover:text-white transition-colors active:scale-95"
          aria-label="Filters"
        >
          <SlidersHorizontal size={18} className="text-[#F47721]" />
        </button>
      )}
    </div>
  );
}


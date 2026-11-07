import { Search } from 'lucide-react';
import { MenuItem } from '@/lib/types/menu';
import { FoodCard } from './FoodCard';

interface FoodGridProps {
  items: MenuItem[];
  emptyMessage?: string;
}

export function FoodGrid({ items, emptyMessage = 'No items found' }: FoodGridProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center bg-white border border-[#EEEEEE] rounded-2xl p-8">
        <div className="w-12 h-12 rounded-full bg-[#FFF7F0] border border-[#F47721]/20 flex items-center justify-center text-[#F47721] mb-3">
          <Search size={22} />
        </div>
        <h3 className="text-base font-semibold text-[#252525]">No dishes found</h3>
        <p className="text-sm text-[#777777] mt-1 max-w-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
      {items.map(item => (
        <FoodCard key={item.id} item={item} />
      ))}
    </div>
  );
}

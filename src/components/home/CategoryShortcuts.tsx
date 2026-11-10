'use client';

import { useRouter } from 'next/navigation';
import { categories } from '@/lib/data/categories';
import { CategoryId } from '@/lib/types/menu';
import { CategoryIcon } from '@/components/menu/CategoryIcon';

export function CategoryShortcuts() {
  const router = useRouter();

  const handleClick = (id: CategoryId) => {
    router.push(`/menu?category=${id}`);
  };

  // Show all except 'all'
  const displayCats = categories.filter(c => c.id !== 'all');

  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
      {displayCats.map(cat => (
        <button
          key={cat.id}
          type="button"
          onClick={() => handleClick(cat.id)}
          className="flex flex-col items-center justify-center gap-1.5 p-2.5 sm:p-4 bg-[#FFF7F0] border border-[#EEEEEE] rounded-2xl
            hover:border-[#F47721] hover:bg-[#FEF0E0] active:scale-95 transition-all text-center group cursor-pointer focus-ring"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white border border-[#EEEEEE] flex items-center justify-center text-[#F47721] group-hover:bg-[#F47721] group-hover:text-white transition-all shadow-xs">
            <CategoryIcon id={cat.id} size={20} />
          </div>
          <span className="text-[11px] sm:text-xs font-bold text-[#252525] group-hover:text-[#F47721] leading-tight">
            {cat.label}
          </span>
        </button>
      ))}
    </div>
  );
}

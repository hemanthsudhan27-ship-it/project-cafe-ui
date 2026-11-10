'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { SearchBar } from '@/components/menu/SearchBar';
import { CategoryFilter } from '@/components/menu/CategoryFilter';
import { FoodGrid } from '@/components/menu/FoodGrid';
import { menuService } from '@/lib/services/menuService';
import { MenuItem, CategoryId } from '@/lib/types/menu';
import { PageSpinner } from '@/components/ui/Spinner';

function MenuContent() {
  const searchParams = useSearchParams();
  const initialCategory = (searchParams.get('category') as CategoryId) || 'all';

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<CategoryId>(initialCategory);
  const [items, setItems] = useState<MenuItem[]>(() => menuService.getMenuItemsSync());

  useEffect(() => {
    menuService.getMenuItems().then(setItems);
  }, []);

  const filtered = useMemo(() => {
    return items.filter(item => {
      const matchesCategory = category === 'all' || item.category === category;
      const matchesSearch =
        !search.trim() ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [items, search, category]);

  const availableCount = filtered.filter(i => i.available).length;

  return (
    <AppShell>
      <div className="flex flex-col gap-4 sm:gap-6 py-4 sm:py-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 border-b border-[#EEEEEE] pb-4 sm:pb-5">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#252525] tracking-tight">
              Cafeteria Menu
            </h1>
            <p className="text-xs sm:text-sm text-[#666666] mt-0.5 sm:mt-1">
              Showing <strong>{filtered.length}</strong> items ({availableCount} available right now)
            </p>
          </div>

          <div className="w-full md:w-80">
            <SearchBar value={search} onChange={setSearch} placeholder="Filter menu items…" />
          </div>
        </div>

        {/* Category Pills */}
        <div className="w-full">
          <CategoryFilter selected={category} onChange={setCategory} />
        </div>

        {/* Food Grid */}
        <FoodGrid
          items={filtered}
          emptyMessage={
            search
              ? `No dishes found matching "${search}". Try searching for another meal or beverage.`
              : 'No items found in this category right now.'
          }
        />
      </div>
    </AppShell>
  );
}

export default function MenuPage() {
  return (
    <Suspense fallback={<PageSpinner />}>
      <MenuContent />
    </Suspense>
  );
}

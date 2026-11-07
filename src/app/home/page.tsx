'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, UtensilsCrossed, LogIn, Flame, Star } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { SearchBar } from '@/components/menu/SearchBar';
import { FoodGrid } from '@/components/menu/FoodGrid';
import { MenuSection } from '@/components/menu/MenuSection';
import { PromoBanner } from '@/components/home/PromoBanner';
import { CategoryShortcuts } from '@/components/home/CategoryShortcuts';
import { HotMealsSection } from '@/components/home/HotMealsSection';
import { menuService } from '@/lib/services/menuService';
import { MenuItem } from '@/lib/types/menu';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';

const PREVIEW_COUNT = 8;

export default function HomePage() {
  const [search, setSearch] = useState('');
  const [greeting, setGreeting] = useState('');
  const { user, isAuthenticated, isLoading } = useAuth();
  const [allItems, setAllItems] = useState<MenuItem[]>(() => menuService.getMenuItemsSync());

  const firstName = user?.name?.split(' ')[0] || 'there';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hour = new Date().getHours();
      if (hour < 12) setGreeting('morning');
      else if (hour < 17) setGreeting('afternoon');
      else setGreeting('evening');
    }
    menuService.getMenuItems().then(setAllItems);
  }, []);

  const popularItems = useMemo(
    () => allItems.filter(i => i.popular).slice(0, PREVIEW_COUNT),
    [allItems]
  );

  const previewItems = useMemo(
    () => allItems.slice(0, PREVIEW_COUNT),
    [allItems]
  );

  const searchFilteredItems = useMemo(() => {
    if (!search.trim()) return null;
    const q = search.toLowerCase().trim();
    return allItems.filter(
      i => i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q)
    );
  }, [allItems, search]);

  return (
    <AppShell>
      <div className="flex flex-col gap-6 py-4">
        {/* Top Welcome / Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#FFF7F0] to-white p-5 sm:p-6 rounded-2xl border border-[#EEEEEE]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#F47721]/10 text-[#F47721]">
                College of Engineering Vadakara
              </span>
              {user?.role && (
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white border border-[#EEEEEE] text-[#777777] capitalize">
                  {user.role}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#252525] mt-2">
              Good {greeting || 'day'}, {firstName}!
            </h1>
            <p className="text-sm text-[#777777] mt-1">
              What would you like to have from the cafeteria today?
            </p>
          </div>

          <div className="w-full md:w-96">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search dishes, drinks, snacks…"
              showFilter={false}
            />
          </div>
        </div>

        {/* Search Results Override if actively searching */}
        {searchFilteredItems !== null ? (
          <MenuSection
            title={`Search Results for "${search}"`}
            action={
              <button
                onClick={() => setSearch('')}
                className="text-xs font-semibold text-[#F47721] hover:underline"
              >
                Clear Search
              </button>
            }
          >
            <FoodGrid items={searchFilteredItems} emptyMessage={`No dishes matching "${search}"`} />
          </MenuSection>
        ) : (
          <>
            {/* Promo Banner & Daily Special */}
            <PromoBanner />

            {/* Category Shortcuts */}
            <MenuSection
              title="Browse Categories"
              action={
                <Link
                  href="/menu"
                  className="text-xs sm:text-sm text-[#F47721] font-semibold flex items-center gap-1 hover:underline"
                >
                  View All Menu <ChevronRight size={14} />
                </Link>
              }
            >
              <CategoryShortcuts />
            </MenuSection>

            {/* Hot Meals Section */}
            <MenuSection
              title="Hot Meals"
              icon={<Flame size={18} className="text-[#F47721]" />}
            >
              <HotMealsSection />
            </MenuSection>

            {/* Popular Items */}
            <MenuSection
              title="Popular Right Now"
              icon={<Star size={18} className="text-[#F47721] fill-[#F47721]" />}
              action={
                <Link
                  href="/menu"
                  className="text-xs sm:text-sm text-[#F47721] font-semibold flex items-center gap-1 hover:underline"
                >
                  Explore All <ChevronRight size={14} />
                </Link>
              }
            >
              <FoodGrid items={popularItems} />
            </MenuSection>

            {/* Complete Menu Preview */}
            <MenuSection
              title="Cafeteria Menu Preview"
              action={
                <Link
                  href="/menu"
                  className="text-xs sm:text-sm text-[#F47721] font-semibold flex items-center gap-1 hover:underline"
                >
                  See Full Menu ({allItems.length}) <ChevronRight size={14} />
                </Link>
              }
            >
              <FoodGrid items={previewItems} />
              <div className="mt-6 flex justify-center">
                <Link href="/menu" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-80">
                    <UtensilsCrossed size={16} className="mr-2" />
                    Open Complete Menu ({allItems.length} Items)
                  </Button>
                </Link>
              </div>
            </MenuSection>
          </>
        )}
      </div>
    </AppShell>
  );
}


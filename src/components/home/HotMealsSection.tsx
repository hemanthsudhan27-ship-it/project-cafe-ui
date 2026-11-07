'use client';

import { useEffect, useState } from 'react';
import { menuService } from '@/lib/services/menuService';
import { MenuItem } from '@/lib/types/menu';
import { FoodCard } from '@/components/menu/FoodCard';

export function HotMealsSection() {
  const [hotMeals, setHotMeals] = useState<MenuItem[]>(() =>
    menuService.getMenuItemsSync({ hotOnly: true })
  );

  useEffect(() => {
    menuService.getMenuItems({ hotOnly: true }).then(setHotMeals);
  }, []);

  if (hotMeals.length === 0) return null;

  return (
    <div className="flex sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 overflow-x-auto sm:overflow-visible scrollbar-hide pb-2 sm:pb-0">
      {hotMeals.map(item => (
        <div key={item.id} className="flex-shrink-0 w-[165px] sm:w-auto">
          <FoodCard item={item} />
        </div>
      ))}
    </div>
  );
}

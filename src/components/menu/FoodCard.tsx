'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { Plus, Minus, Flame, Star, Check } from 'lucide-react';
import { MenuItem } from '@/lib/types/menu';
import { useCart } from '@/hooks/useCart';
import { formatCurrency } from '@/lib/utils/formatCurrency';

interface FoodCardProps {
  item: MenuItem;
}

export function FoodCard({ item }: FoodCardProps) {
  const { items, addItem, updateQty } = useCart();
  const [added, setAdded] = useState(false);

  const cartItem = items.find(i => i.menuItem.id === item.id);
  const qty = cartItem?.quantity ?? 0;

  const handleAdd = useCallback(() => {
    if (!item.available) return;
    addItem(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 900);
  }, [item, addItem]);

  const handleIncrease = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateQty(item.id, qty + 1);
  };

  const handleDecrease = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateQty(item.id, qty - 1);
  };

  return (
    <article
      className={`h-full bg-white rounded-2xl border border-[#EEEEEE] overflow-hidden flex flex-col justify-between group transition-all duration-200 hover:border-[#F47721]/30 hover:shadow-md
      ${!item.available ? 'opacity-65' : ''}`}
    >
      {/* Top Section: Food Image + Badges */}
      <div>
        <div className="relative w-full aspect-[4/3] bg-[#FFF7F0] overflow-hidden select-none">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 250px"
            unoptimized
          />
          {/* Status Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10 pointer-events-none">
            {item.hot && (
              <span className="inline-flex items-center gap-1 bg-[#F47721] text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-lg shadow-xs">
                <Flame size={11} className="shrink-0" />
                <span>Hot</span>
              </span>
            )}
            {item.popular && !item.hot && (
              <span className="inline-flex items-center gap-1 bg-white text-[#F47721] text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-lg border border-[#F47721]/30 shadow-xs">
                <Star size={11} className="shrink-0 fill-[#F47721]" />
                <span>Popular</span>
              </span>
            )}
          </div>

          {!item.available && (
            <div className="absolute inset-0 bg-white/75 backdrop-blur-[1px] flex items-center justify-center z-10">
              <span className="text-xs font-bold text-[#D94A43] bg-white px-2.5 py-1 rounded-xl border border-red-200 shadow-xs">
                Sold Out
              </span>
            </div>
          )}
        </div>

        {/* Text Details with consistent min-heights across rows */}
        <div className="p-3 sm:p-3.5">
          <h3 className="text-xs sm:text-sm font-bold text-[#252525] leading-snug line-clamp-2 min-h-[2rem] sm:min-h-[2.25rem] group-hover:text-[#F47721] transition-colors">
            {item.name}
          </h3>
          <p className="text-[11px] sm:text-xs text-[#666666] mt-1 line-clamp-2 min-h-[2rem] leading-relaxed">
            {item.description}
          </p>
        </div>
      </div>

      {/* Bottom Section: Price + Accessible Touch Action Controls */}
      <div className="px-3 sm:px-3.5 pb-3 sm:pb-3.5 pt-2 border-t border-[#EEEEEE]/70 flex items-center justify-between gap-1.5 mt-auto">
        <span className="text-sm sm:text-base font-extrabold text-[#F47721]">
          {formatCurrency(item.price)}
        </span>

        {item.available ? (
          qty > 0 ? (
            /* High-accessibility Stepper with comfortable tap targets */
            <div
              role="group"
              aria-label={`Quantity controls for ${item.name}`}
              className="flex items-center gap-1 bg-[#FFF7F0] p-0.5 rounded-xl border border-[#F47721]/30"
            >
              <button
                type="button"
                onClick={handleDecrease}
                className="w-8 h-8 rounded-lg bg-white border border-[#EEEEEE] flex items-center justify-center active:scale-90 text-[#F47721] hover:bg-[#FFF7F0] transition-transform cursor-pointer"
                aria-label={`Decrease quantity of ${item.name}`}
              >
                <Minus size={13} strokeWidth={2.5} />
              </button>
              <span
                aria-live="polite"
                className="text-xs sm:text-sm font-bold text-[#252525] min-w-[20px] text-center"
              >
                {qty}
              </span>
              <button
                type="button"
                onClick={handleIncrease}
                className="w-8 h-8 rounded-lg bg-[#F47721] flex items-center justify-center active:scale-90 text-white hover:bg-[#e06310] transition-transform cursor-pointer shadow-xs"
                aria-label={`Increase quantity of ${item.name}`}
              >
                <Plus size={13} strokeWidth={2.5} />
              </button>
            </div>
          ) : (
            /* Add to Cart Button with comfortable touch height */
            <button
              type="button"
              onClick={handleAdd}
              className={`min-h-[36px] sm:min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all active:scale-95 shadow-xs flex items-center gap-1.5 cursor-pointer
                ${
                  added
                    ? 'bg-[#269B62] text-white animate-cart-pop'
                    : 'bg-[#F47721] text-white hover:bg-[#e06310]'
                }`}
              aria-label={`Add ${item.name} to cart`}
            >
              {added ? (
                <>
                  <Check size={14} className="shrink-0" strokeWidth={2.5} />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <Plus size={14} className="shrink-0" strokeWidth={2.5} />
                  <span>Add</span>
                </>
              )}
            </button>
          )
        ) : (
          <span className="text-[11px] text-[#D94A43] font-semibold py-1">Unavailable</span>
        )}
      </div>
    </article>
  );
}

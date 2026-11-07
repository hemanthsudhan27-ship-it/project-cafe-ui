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
    setTimeout(() => setAdded(false), 1000);
  }, [item, addItem]);

  const handleIncrease = () => updateQty(item.id, qty + 1);
  const handleDecrease = () => updateQty(item.id, qty - 1);

  return (
    <div
      className={`bg-white rounded-2xl border border-[#EEEEEE] overflow-hidden flex flex-col group transition-all duration-200 hover:border-[#F47721]/30 hover:shadow-md
      ${!item.available ? 'opacity-65' : ''}`}
    >
      {/* Image container */}
      <div className="relative w-full aspect-[4/3] bg-[#FFF7F0] overflow-hidden">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 250px"
          unoptimized
        />
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {item.hot && (
            <span className="inline-flex items-center gap-1 bg-[#F47721] text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-lg shadow-xs">
              <Flame size={11} className="shrink-0" />
              <span>Hot</span>
            </span>
          )}
          {item.popular && !item.hot && (
            <span className="inline-flex items-center gap-1 bg-white text-[#F47721] text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-lg border border-[#F47721] shadow-xs">
              <Star size={11} className="shrink-0 fill-[#F47721]" />
              <span>Popular</span>
            </span>
          )}
        </div>

        {!item.available && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center z-10">
            <span className="text-xs font-bold text-[#D94A43] bg-white px-2.5 py-1 rounded-xl border border-red-200 shadow-xs">
              Currently Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-3 sm:p-3.5 flex flex-col flex-1">
        <h3 className="text-xs sm:text-sm font-bold text-[#252525] leading-snug line-clamp-2 group-hover:text-[#F47721] transition-colors">
          {item.name}
        </h3>
        <p className="text-[11px] sm:text-xs text-[#777777] mt-1 line-clamp-2 flex-1 leading-relaxed">
          {item.description}
        </p>

        {/* Price + Add to cart controls */}
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#EEEEEE]/70 gap-1.5">
          <span className="text-sm sm:text-base font-extrabold text-[#F47721]">
            {formatCurrency(item.price)}
          </span>

          {item.available ? (
            qty > 0 ? (
              /* Quantity controls */
              <div className="flex items-center gap-1.5 bg-[#FFF7F0] p-0.5 rounded-xl border border-[#F47721]/30">
                <button
                  onClick={handleDecrease}
                  className="w-6 h-6 rounded-lg bg-white border border-[#EEEEEE] flex items-center justify-center active:scale-95 text-[#F47721] hover:bg-[#FFF7F0] transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus size={12} />
                </button>
                <span className="text-xs sm:text-sm font-bold text-[#252525] min-w-[18px] text-center">
                  {qty}
                </span>
                <button
                  onClick={handleIncrease}
                  className="w-6 h-6 rounded-lg bg-[#F47721] flex items-center justify-center active:scale-95 text-white hover:bg-[#e06310] transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus size={12} />
                </button>
              </div>
            ) : (
              /* Add to Cart Button */
              <button
                onClick={handleAdd}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-xs
                  ${
                    added
                      ? 'bg-[#269B62] text-white'
                      : 'bg-[#F47721] text-white hover:bg-[#e06310]'
                  }`}
                aria-label={`Add ${item.name} to cart`}
              >
                {added ? (
                  <>
                    <Check size={13} className="shrink-0" />
                    <span>Added</span>
                  </>
                ) : (
                  <>
                    <Plus size={13} />
                    <span>Add</span>
                  </>
                )}
              </button>
            )
          ) : (
            <span className="text-[11px] text-[#D94A43] font-semibold">Unavailable</span>
          )}
        </div>
      </div>
    </div>
  );
}

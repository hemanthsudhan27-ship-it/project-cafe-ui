'use client';

import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '@/lib/types/cart';
import { useCart } from '@/hooks/useCart';
import { formatCurrency } from '@/lib/utils/formatCurrency';

interface CartItemProps {
  item: CartItemType;
}

export function CartItemRow({ item }: CartItemProps) {
  const { removeItem, updateQty } = useCart();
  const { menuItem, quantity } = item;

  return (
    <div className="flex items-center gap-3 sm:gap-4 py-3.5 border-b border-[#EEEEEE] last:border-b-0">
      {/* Food Thumbnail */}
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden flex-shrink-0 bg-[#FFF7F0] border border-[#EEEEEE]">
        <Image
          src={menuItem.image}
          alt={menuItem.name}
          fill
          className="object-cover"
          sizes="80px"
          unoptimized
        />
      </div>

      {/* Title & Unit Price */}
      <div className="flex-1 min-w-0">
        <h4 className="text-xs sm:text-sm font-bold text-[#252525] leading-snug line-clamp-2">
          {menuItem.name}
        </h4>
        <p className="text-xs sm:text-sm font-extrabold text-[#F47721] mt-0.5">
          {formatCurrency(menuItem.price)}
        </p>
      </div>

      {/* Stepper & Controls */}
      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <div className="flex items-center gap-1.5">
          {/* Stepper with comfortable tap targets */}
          <div
            role="group"
            aria-label={`Quantity stepper for ${menuItem.name}`}
            className="flex items-center gap-1 bg-[#FFF7F0] p-0.5 rounded-xl border border-[#F47721]/30"
          >
            <button
              type="button"
              onClick={() => updateQty(menuItem.id, quantity - 1)}
              className="w-8 h-8 rounded-lg bg-white border border-[#EEEEEE] flex items-center justify-center active:scale-90 text-[#F47721] hover:bg-[#FFF7F0] transition-transform cursor-pointer"
              aria-label={`Decrease ${menuItem.name} quantity`}
            >
              <Minus size={13} strokeWidth={2.5} />
            </button>
            <span
              aria-live="polite"
              className="text-xs sm:text-sm font-bold text-[#252525] min-w-[20px] text-center"
            >
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => updateQty(menuItem.id, quantity + 1)}
              className="w-8 h-8 rounded-lg bg-[#F47721] flex items-center justify-center active:scale-90 text-white hover:bg-[#e06310] transition-transform cursor-pointer shadow-xs"
              aria-label={`Increase ${menuItem.name} quantity`}
            >
              <Plus size={13} strokeWidth={2.5} />
            </button>
          </div>

          {/* Remove Item */}
          <button
            type="button"
            onClick={() => removeItem(menuItem.id)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[#D94A43] hover:bg-red-50 transition-colors active:scale-90 cursor-pointer"
            aria-label={`Remove ${menuItem.name} from cart`}
          >
            <Trash2 size={16} />
          </button>
        </div>

        {/* Item subtotal */}
        <span className="text-xs font-bold text-[#666666]">
          {formatCurrency(menuItem.price * quantity)}
        </span>
      </div>
    </div>
  );
}

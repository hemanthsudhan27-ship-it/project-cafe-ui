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
    <div className="flex items-center gap-3 py-3 border-b border-[#EEEEEE] last:border-b-0">
      {/* Image */}
      <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-[#FFF7F0]">
        <Image
          src={menuItem.image}
          alt={menuItem.name}
          fill
          className="object-cover"
          sizes="64px"
          unoptimized
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-[#252525] leading-tight truncate">
          {menuItem.name}
        </h4>
        <p className="text-sm font-bold text-[#F47721] mt-0.5">
          {formatCurrency(menuItem.price)}
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-end gap-2">
        {/* Remove */}
        <button
          onClick={() => removeItem(menuItem.id)}
          className="p-1 hover:bg-red-50 rounded-lg transition-colors"
          aria-label="Remove item"
        >
          <Trash2 size={14} className="text-[#D94A43]" />
        </button>

        {/* Qty */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => updateQty(menuItem.id, quantity - 1)}
            className="w-6 h-6 rounded-full bg-[#FFF7F0] border border-[#EEEEEE] flex items-center justify-center active:scale-95"
            aria-label="Decrease"
          >
            <Minus size={12} className="text-[#F47721]" />
          </button>
          <span className="text-sm font-bold text-[#252525] min-w-[16px] text-center">
            {quantity}
          </span>
          <button
            onClick={() => updateQty(menuItem.id, quantity + 1)}
            className="w-6 h-6 rounded-full bg-[#F47721] flex items-center justify-center active:scale-95"
            aria-label="Increase"
          >
            <Plus size={12} className="text-white" />
          </button>
        </div>

        {/* Line total */}
        <span className="text-xs text-[#777777]">
          {formatCurrency(menuItem.price * quantity)}
        </span>
      </div>
    </div>
  );
}


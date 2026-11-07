'use client';

import Link from 'next/link';
import { Trash2, ArrowLeft, ShoppingBag } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { CartItemRow } from '@/components/cart/CartItem';
import { CartSummary } from '@/components/cart/CartSummary';
import { EmptyCart } from '@/components/cart/EmptyCart';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/hooks/useCart';

export default function CartPage() {
  const { items, subtotal, itemCount, clearCart } = useCart();

  return (
    <AppShell>
      <div className="py-4 sm:py-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#EEEEEE] pb-4 mb-6">
          <div className="flex items-center gap-3">
            <Link
              href="/menu"
              className="p-2 -ml-2 rounded-xl text-[#777777] hover:text-[#252525] hover:bg-gray-50 transition-colors"
              aria-label="Back to Menu"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-extrabold text-[#252525]">Shopping Cart</h1>
              {itemCount > 0 && (
                <p className="text-sm text-[#777777]">
                  {itemCount} {itemCount === 1 ? 'item' : 'items'} in your order
                </p>
              )}
            </div>
          </div>

          {itemCount > 0 && (
            <button
              onClick={clearCart}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#D94A43] hover:bg-red-50 px-3 py-1.5 rounded-xl transition-colors border border-transparent hover:border-red-200"
            >
              <Trash2 size={15} />
              Clear Cart
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          /* Responsive 2-column on desktop, single-column on mobile */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
            {/* Left 2 cols: Items list */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white border border-[#EEEEEE] rounded-2xl p-4 sm:p-5 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-[#EEEEEE] mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#777777]">Selected Food Items</span>
                  <span className="text-xs text-[#777777]">Price & Qty</span>
                </div>
                <div className="divide-y divide-[#EEEEEE]">
                  {items.map(item => (
                    <CartItemRow key={item.menuItem.id} item={item} />
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center px-1">
                <Link
                  href="/menu"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#F47721] hover:underline"
                >
                  <ArrowLeft size={16} /> Add more items from Menu
                </Link>
              </div>
            </div>

            {/* Right 1 col: Sticky Order Summary on desktop */}
            <div className="lg:col-span-1 lg:sticky lg:top-20 space-y-4">
              <CartSummary subtotal={subtotal} />

              <Link href="/checkout" className="block">
                <Button fullWidth size="lg" className="shadow-md shadow-[#F47721]/20">
                  Proceed to Checkout →
                </Button>
              </Link>

              <div className="bg-[#FFF7F0] border border-[#EEEEEE] rounded-xl p-3 text-center">
                <p className="text-xs text-[#777777]">
                  Meals are freshly prepared upon confirmation. Pay at counter on pickup.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

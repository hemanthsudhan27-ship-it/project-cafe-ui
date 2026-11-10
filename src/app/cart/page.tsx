'use client';

import Link from 'next/link';
import { Trash2, ArrowLeft, ArrowRight, ShoppingBag, CreditCard, ShieldCheck } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { CartItemRow } from '@/components/cart/CartItem';
import { CartSummary } from '@/components/cart/CartSummary';
import { EmptyCart } from '@/components/cart/EmptyCart';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/hooks/useCart';
import { formatCurrency } from '@/lib/utils/formatCurrency';

export default function CartPage() {
  const { items, subtotal, itemCount, clearCart } = useCart();
  const serviceCharge = Math.round(subtotal * 0.05);
  const total = subtotal + serviceCharge;

  return (
    <AppShell>
      <div className="py-4 sm:py-6 pb-36 sm:pb-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#EEEEEE] pb-4 mb-6">
          <div className="flex items-center gap-3">
            <Link
              href="/menu"
              className="p-2 -ml-2 rounded-xl text-[#666666] hover:text-[#252525] hover:bg-gray-50 transition-colors focus-ring"
              aria-label="Back to Menu"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[#252525]">Shopping Cart</h1>
              {itemCount > 0 && (
                <p className="text-xs sm:text-sm text-[#666666]">
                  {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cafeteria order
                </p>
              )}
            </div>
          </div>

          {itemCount > 0 && (
            <button
              onClick={clearCart}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#D94A43] hover:bg-red-50 px-3 py-1.5 rounded-xl transition-colors border border-transparent hover:border-red-200 cursor-pointer"
            >
              <Trash2 size={15} />
              Clear Cart
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <>
            {/* Responsive 2-column on desktop, single-column on mobile */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
              {/* Left 2 cols: Items list */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white border border-[#EEEEEE] rounded-2xl p-4 sm:p-5 shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-[#EEEEEE] mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#666666]">
                      Selected Items ({items.length})
                    </span>
                    <span className="text-xs text-[#666666]">Adjust Quantity</span>
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
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#F47721] hover:underline"
                  >
                    <ArrowLeft size={16} /> Add more items from Menu
                  </Link>
                </div>
              </div>

              {/* Right 1 col: Order Summary with Pay Now Button on all screens */}
              <div className="lg:col-span-1 lg:sticky lg:top-20 space-y-4">
                <CartSummary subtotal={subtotal} />

                {/* Primary Pay Now Action (Always visible on mobile & desktop) */}
                <Link href="/checkout" className="block">
                  <Button fullWidth size="lg" className="shadow-lg shadow-[#F47721]/25 font-black text-base flex items-center justify-center gap-2 py-4 active:scale-[0.98]">
                    <CreditCard size={18} />
                    <span>Pay Now · {formatCurrency(total)}</span>
                  </Button>
                </Link>

                <div className="bg-[#FFF7F0] border border-[#F47721]/20 rounded-xl p-3 text-center">
                  <p className="text-xs text-[#252525] font-semibold leading-relaxed flex items-center justify-center gap-1.5">
                    <ShieldCheck size={14} className="text-[#269B62] shrink-0" />
                    <span>Instant UPI Pay & Takeaway QR Receipt available</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile Sticky Floating Bottom Checkout Bar (Priority P0, elevated z-40 above navigation) */}
            <div className="fixed bottom-16 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#EEEEEE] p-3 px-4 shadow-[0_-4px_20px_rgba(0,0,0,0.12)] sm:hidden flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold text-[#666666] uppercase tracking-wider block leading-tight">
                  Total Bill (incl. 5% fee)
                </span>
                <span className="text-base font-black text-[#F47721] leading-tight">
                  {formatCurrency(total)}
                </span>
              </div>

              <Link href="/checkout" className="flex-1 max-w-[200px]">
                <Button fullWidth size="md" className="font-black text-xs py-2.5 shadow-md shadow-[#F47721]/20 flex items-center justify-center gap-1.5 active:scale-95">
                  <CreditCard size={14} />
                  <span>Pay Now</span>
                  <ArrowRight size={14} />
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}

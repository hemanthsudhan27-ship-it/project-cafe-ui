'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Clock, ArrowLeft, ShieldCheck, CreditCard } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { CartItemRow } from '@/components/cart/CartItem';
import { CartSummary } from '@/components/cart/CartSummary';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/components/ui/Toast';
import { orderService } from '@/lib/services/orderService';
import { Order } from '@/lib/types/order';
import { formatCurrency } from '@/lib/utils/formatCurrency';

export default function CheckoutPage() {
  const { items, subtotal, clearCart, itemCount } = useCart();
  const { showToast } = useToast();
  const router = useRouter();
  const [note, setNote] = useState('');
  const [placing, setPlacing] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);

  if (itemCount === 0 && !order) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-[#FFF7F0] flex items-center justify-center text-[#F47721] mb-4">
            <CreditCard size={32} />
          </div>
          <h2 className="text-xl font-bold text-[#252525] mb-2">Nothing to Checkout</h2>
          <p className="text-sm text-[#777777] mb-6 max-w-sm">
            Your cart is currently empty. Add dishes from the menu to proceed with your order.
          </p>
          <Link href="/menu">
            <Button size="lg">Browse Menu</Button>
          </Link>
        </div>
      </AppShell>
    );
  }

  const handlePlaceOrder = async () => {
    setPlacing(true);
    try {
      const placed = await orderService.placeOrder(items, note || undefined);
      setOrder(placed);
      clearCart();
      showToast('Order placed successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to place order', 'error');
    } finally {
      setPlacing(false);
    }
  };

  if (order) {
    return (
      <AppShell>
        <OrderConfirmation order={order} />
      </AppShell>
    );
  }

  const serviceCharge = Math.round(subtotal * 0.05);

  return (
    <AppShell>
      <div className="py-4 sm:py-6">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-[#EEEEEE] pb-4 mb-6">
          <Link
            href="/cart"
            className="p-2 -ml-2 rounded-xl text-[#777777] hover:text-[#252525] hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-[#252525]">Checkout & Confirmation</h1>
            <p className="text-sm text-[#777777]">Review items and confirm your cafeteria order</p>
          </div>
        </div>

        {/* 2-Column Responsive Layout on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
          {/* Left Column: Items & Instructions */}
          <div className="lg:col-span-2 space-y-5">
            {/* Items Card */}
            <div className="bg-white border border-[#EEEEEE] rounded-2xl p-4 sm:p-5 shadow-xs">
              <h2 className="text-base font-bold text-[#252525] mb-3">Order Items ({items.length})</h2>
              <div className="divide-y divide-[#EEEEEE]">
                {items.map(item => (
                  <CartItemRow key={item.menuItem.id} item={item} />
                ))}
              </div>
            </div>

            {/* Special Instructions */}
            <div className="bg-white border border-[#EEEEEE] rounded-2xl p-4 sm:p-5 shadow-xs">
              <label className="block text-sm font-bold text-[#252525] mb-2">
                Special Kitchen Instructions <span className="text-[#777777] font-normal text-xs">(optional)</span>
              </label>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="e.g. Less spicy, keep sambar separate, extra spoon…"
                rows={3}
                className="w-full px-4 py-3 text-sm border border-[#EEEEEE] rounded-xl resize-none
                  focus:outline-none focus:border-[#F47721] focus:ring-2 focus:ring-[#F47721]/20
                  placeholder:text-[#777777] text-[#252525] bg-[#FFF7F0]/30"
              />
            </div>
          </div>

          {/* Right Column: Billing & Confirmation */}
          <div className="lg:col-span-1 lg:sticky lg:top-20 space-y-4">
            <CartSummary subtotal={subtotal} />

            {/* Payment Notice */}
            <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-3">
              <CreditCard size={20} className="text-amber-800 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold mb-0.5">Pay at Counter on Pickup</strong>
                Cash or UPI (Google Pay, PhonePe, Paytm) accepted at the counter when collecting your order.
              </div>
            </div>

            {/* Confirmation CTA */}
            <Button
              fullWidth
              size="lg"
              loading={placing}
              onClick={handlePlaceOrder}
              className="shadow-md shadow-[#F47721]/20 text-base"
            >
              Confirm & Place Order · {formatCurrency(subtotal + serviceCharge)}
            </Button>

            <p className="text-[11px] text-center text-[#777777]">
              By confirming, your order will be sent directly to the cafeteria kitchen queue.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function OrderConfirmation({ order }: { order: Order }) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          clearInterval(interval);
          router.push('/orders');
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [router]);

  return (
    <div className="max-w-xl mx-auto py-12 px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center mx-auto mb-4 text-[#269B62]">
        <CheckCircle size={44} />
      </div>

      <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-[#269B62] text-xs font-bold uppercase tracking-wider mb-2">
        Order Confirmed
      </span>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-[#252525]">
        Order Placed Successfully!
      </h1>
      <p className="text-sm text-[#777777] mt-1">
        Your order has been queued in the cafeteria kitchen.
      </p>

      <div className="mt-6 bg-[#FFF7F0] border border-[#F47721]/20 rounded-2xl p-6 text-center space-y-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-[#777777] font-semibold">Order Token ID</span>
          <p className="font-mono text-xl font-bold text-[#F47721] mt-0.5">{order.id}</p>
        </div>

        <div className="flex items-center justify-center gap-2 text-sm text-[#252525] font-semibold bg-white rounded-xl py-2.5 px-4 border border-[#EEEEEE]">
          <Clock size={18} className="text-[#F47721]" />
          <span>Estimated wait time: <strong>{order.estimatedTime} minutes</strong></span>
        </div>

        <div className="pt-2 border-t border-[#EEEEEE] flex justify-between items-center text-sm">
          <span className="text-[#777777]">Pay at counter:</span>
          <span className="text-lg font-bold text-[#252525]">{formatCurrency(order.total)}</span>
        </div>
      </div>

      <p className="text-xs text-[#777777] mt-6">
        Redirecting to orders page in <strong>{countdown} seconds</strong>…
      </p>

      <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/orders">
          <Button size="lg" className="w-full sm:w-auto">
            View Order Status
          </Button>
        </Link>
        <Link href="/home">
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            Back to Cafeteria Home
          </Button>
        </Link>
      </div>
    </div>
  );
}

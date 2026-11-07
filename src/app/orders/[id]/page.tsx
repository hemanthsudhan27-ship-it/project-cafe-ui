'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge';
import { PageSpinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { orderService } from '@/lib/services/orderService';
import { Order } from '@/lib/types/order';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { useToast } from '@/components/ui/Toast';

function OrderDetailContent() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  const orderId = params.id as string;

  useEffect(() => {
    orderService.getOrder(orderId)
      .then(setOrder)
      .catch(() => router.push('/orders'))
      .finally(() => setLoading(false));
  }, [orderId, router]);

  if (loading) return <PageSpinner />;
  if (!order) return null;

  const handleCancel = async () => {
    setCancelling(true);
    try {
      const updated = await orderService.cancelOrder(order.id);
      setOrder(updated);
      showToast('Order cancelled', 'info');
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setCancelling(false);
    }
  };

  const date = new Date(order.placedAt).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <div className="py-4 sm:py-6">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/orders"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#777777] hover:text-[#252525] transition-colors"
        >
          <ArrowLeft size={16} /> Back to All Orders
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
        {/* Left Column: Details & Items */}
        <div className="lg:col-span-2 space-y-5">
          {/* Order Header Card */}
          <div className="bg-white border border-[#EEEEEE] rounded-2xl p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EEEEEE]">
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-[#777777]">Order Reference</span>
                <p className="text-base sm:text-lg font-mono font-bold text-[#252525]">{order.id}</p>
                <p className="text-xs text-[#777777] mt-0.5">Placed on {date}</p>
              </div>
              <OrderStatusBadge status={order.status} />
            </div>

            {order.estimatedTime && order.status !== 'completed' && order.status !== 'cancelled' && (
              <div className="mt-4 flex items-center gap-2.5 text-sm text-[#252525] bg-[#FFF7F0] p-3 rounded-xl border border-[#F47721]/20">
                <Clock size={16} className="text-[#F47721]" />
                <span>Estimated kitchen wait: <strong>{order.estimatedTime} minutes</strong></span>
              </div>
            )}

            {order.status === 'ready' && (
              <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-3 text-xs sm:text-sm text-[#269B62] font-semibold flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#269B62] shrink-0" />
                <span>Your food is ready! Please collect your meal at the cafeteria counter.</span>
              </div>
            )}
          </div>

          {/* Items List */}
          <div className="bg-white border border-[#EEEEEE] rounded-2xl p-5 shadow-xs">
            <h2 className="text-base font-bold text-[#252525] mb-3">Items in this Order ({order.items.length})</h2>
            <div className="divide-y divide-[#EEEEEE]">
              {order.items.map(({ menuItem, quantity }) => (
                <div key={menuItem.id} className="flex items-center gap-3.5 py-3.5">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-[#FFF7F0] flex-shrink-0">
                    <Image
                      src={menuItem.image}
                      alt={menuItem.name}
                      fill
                      className="object-cover"
                      unoptimized
                      sizes="56px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#252525] truncate">{menuItem.name}</p>
                    <p className="text-xs text-[#777777] mt-0.5">
                      {formatCurrency(menuItem.price)} × {quantity}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-[#252525]">
                    {formatCurrency(menuItem.price * quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Special Instructions if present */}
          {order.note && (
            <div className="bg-white border border-[#EEEEEE] rounded-2xl p-5 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#777777] mb-1.5">Special Instructions</h3>
              <p className="text-sm text-[#252525]">{order.note}</p>
            </div>
          )}
        </div>

        {/* Right Column: Bill Summary & Actions */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-[#FFF7F0] border border-[#EEEEEE] rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-[#252525] pb-2 border-b border-[#EEEEEE]">Payment Breakdown</h3>
            <div className="flex justify-between text-sm text-[#777777]">
              <span>Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-[#777777]">
              <span>Service Charge (5%)</span>
              <span>{formatCurrency(order.serviceCharge)}</span>
            </div>
            <div className="border-t border-[#EEEEEE] pt-3 flex justify-between font-bold text-base text-[#252525]">
              <span>Total Amount</span>
              <span className="text-[#F47721]">{formatCurrency(order.total)}</span>
            </div>
            <p className="text-xs text-[#777777] pt-1">
              Payment mode: Pay at counter (Cash or UPI)
            </p>
          </div>

          {/* Cancellation button if still pending */}
          {(order.status === 'pending' || order.status === 'preparing') && (
            <Button
              variant="danger"
              fullWidth
              size="lg"
              loading={cancelling}
              onClick={handleCancel}
            >
              Cancel Order
            </Button>
          )}

          <Link href="/home" className="block text-center text-sm font-semibold text-[#777777] hover:text-[#F47721] pt-2">
            Return to Cafeteria Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderDetailPage() {
  return (
    <AppShell>
      <Suspense fallback={<PageSpinner />}>
        <OrderDetailContent />
      </Suspense>
    </AppShell>
  );
}

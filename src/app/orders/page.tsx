'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowLeft, RefreshCw } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { OrderCard } from '@/components/orders/OrderCard';
import { PageSpinner } from '@/components/ui/Spinner';
import { orderService } from '@/lib/services/orderService';
import { Order } from '@/lib/types/order';
import { Button } from '@/components/ui/Button';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    setLoading(true);
    orderService.getOrders().then(data => {
      setOrders(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <AppShell>
      <div className="py-4 sm:py-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#EEEEEE] pb-4 mb-6">
          <div className="flex items-center gap-3">
            <Link
              href="/home"
              className="p-2 -ml-2 rounded-xl text-[#777777] hover:text-[#252525] hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-extrabold text-[#252525]">My Orders</h1>
              <p className="text-sm text-[#777777]">
                Track current cafeteria orders and past meal history
              </p>
            </div>
          </div>

          <button
            onClick={fetchOrders}
            className="p-2 rounded-xl border border-[#EEEEEE] text-[#777777] hover:text-[#F47721] hover:border-[#F47721] transition-colors"
            aria-label="Refresh orders"
          >
            <RefreshCw size={16} />
          </button>
        </div>

        {loading ? (
          <PageSpinner />
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white border border-[#EEEEEE] rounded-2xl p-8">
            <div className="w-16 h-16 rounded-full bg-[#FFF7F0] flex items-center justify-center mb-4 text-[#F47721]">
              <ShoppingBag size={28} />
            </div>
            <h2 className="text-lg font-bold text-[#252525] mb-2">No Orders Placed Yet</h2>
            <p className="text-sm text-[#777777] mb-6 max-w-sm">
              You haven&apos;t ordered any meals yet. Browse the cafeteria menu to place your first order.
            </p>
            <Link href="/menu">
              <Button size="lg">Browse Menu & Order</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {orders.map(order => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}

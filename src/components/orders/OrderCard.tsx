import Link from 'next/link';
import { Clock, ChevronRight } from 'lucide-react';
import { Order } from '@/lib/types/order';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { OrderStatusBadge } from './OrderStatusBadge';

interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  const date = new Date(order.placedAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const time = new Date(order.placedAt).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const itemNames = order.items
    .map(i => `${i.menuItem.name} ×${i.quantity}`)
    .join(', ');

  return (
    <Link href={`/orders/${order.id}`}>
      <div className="bg-white border border-[#EEEEEE] rounded-xl p-4 hover:border-[#F47721] transition-colors active:scale-[0.99]">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono text-[#777777]">{order.id}</span>
          <OrderStatusBadge status={order.status} />
        </div>

        {/* Items */}
        <p className="text-sm text-[#252525] font-medium line-clamp-2 mb-2">{itemNames}</p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-[#777777]">
            <Clock size={12} />
            <span>{date} · {time}</span>
          </div>
          <span className="text-sm font-bold text-[#F47721]">{formatCurrency(order.total)}</span>
        </div>
      </div>
    </Link>
  );
}


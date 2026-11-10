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
    .map(i => `${i.quantity}× ${i.menuItem.name}`)
    .join(', ');

  return (
    <Link href={`/orders/${order.id}`} className="block group">
      <div className="bg-white border border-[#EEEEEE] rounded-2xl p-4 sm:p-5 hover:border-[#F47721]/40 hover:shadow-xs transition-all active:scale-[0.99]">
        {/* Top Header: ID & Badge */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className="text-xs font-mono font-bold text-[#F47721]">#{order.id.slice(-8).toUpperCase()}</span>
          <OrderStatusBadge status={order.status} />
        </div>

        {/* Ordered Food Items */}
        <p className="text-xs sm:text-sm text-[#252525] font-semibold line-clamp-2 mb-3 leading-snug">
          {itemNames}
        </p>

        {/* Footer: Date, Time & Total Amount */}
        <div className="flex items-center justify-between pt-2 border-t border-[#EEEEEE]/80">
          <div className="flex items-center gap-1.5 text-xs text-[#666666]">
            <Clock size={13} className="text-[#F47721]" />
            <span>{date} · {time}</span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                order.paymentStatus === 'paid'
                  ? 'bg-green-100 text-[#269B62]'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {order.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
            </span>
            <span className="text-sm font-extrabold text-[#252525]">{formatCurrency(order.total)}</span>
            <ChevronRight size={14} className="text-[#666666] group-hover:text-[#F47721] transition-colors" />
          </div>
        </div>
      </div>
    </Link>
  );
}

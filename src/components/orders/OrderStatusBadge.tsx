import { OrderStatus } from '@/lib/types/order';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const config: Record<OrderStatus, { label: string; classes: string; dot: string }> = {
  pending: {
    label: 'Pending',
    classes: 'bg-amber-50 text-amber-700',
    dot: 'bg-amber-500',
  },
  preparing: {
    label: 'Preparing',
    classes: 'bg-blue-50 text-blue-700',
    dot: 'bg-blue-500',
  },
  ready: {
    label: 'Ready for pickup',
    classes: 'bg-green-50 text-[#269B62]',
    dot: 'bg-[#269B62]',
  },
  completed: {
    label: 'Completed',
    classes: 'bg-[#EEEEEE] text-[#777777]',
    dot: 'bg-[#777777]',
  },
  cancelled: {
    label: 'Cancelled',
    classes: 'bg-red-50 text-[#D94A43]',
    dot: 'bg-[#D94A43]',
  },
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const { label, classes, dot } = config[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${classes}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot} ${status === 'preparing' ? 'animate-pulse' : ''}`} />
      {label}
    </span>
  );
}


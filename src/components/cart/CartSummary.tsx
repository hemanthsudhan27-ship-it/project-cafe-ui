import { formatCurrency } from '@/lib/utils/formatCurrency';
import { Info } from 'lucide-react';

const SERVICE_CHARGE_RATE = 0.05;

interface CartSummaryProps {
  subtotal: number;
}

export function CartSummary({ subtotal }: CartSummaryProps) {
  const serviceCharge = Math.round(subtotal * SERVICE_CHARGE_RATE);
  const total = subtotal + serviceCharge;

  return (
    <div className="bg-[#FFF7F0] rounded-xl p-4 space-y-2">
      <h3 className="text-sm font-bold text-[#252525] mb-3">Order Summary</h3>

      <div className="flex justify-between text-sm text-[#777777]">
        <span>Subtotal</span>
        <span>{formatCurrency(subtotal)}</span>
      </div>

      <div className="flex justify-between text-sm text-[#777777]">
        <span>Service charge (5%)</span>
        <span>{formatCurrency(serviceCharge)}</span>
      </div>

      <div className="border-t border-[#EEEEEE] pt-2 flex justify-between text-base font-bold text-[#252525]">
        <span>Total</span>
        <span className="text-[#F47721]">{formatCurrency(total)}</span>
      </div>

      <div className="text-xs text-[#777777] pt-1 flex items-start gap-1.5">
        <Info size={14} className="text-[#F47721] shrink-0 mt-0.5" />
        <span>Payment is collected at the counter when you pick up your order.</span>
      </div>
    </div>
  );
}

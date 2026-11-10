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
    <div className="bg-[#FFF7F0] border border-[#F47721]/20 rounded-2xl p-4 sm:p-5 space-y-2.5">
      <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#252525] mb-2 pb-2 border-b border-[#F47721]/15">
        Order Summary
      </h3>

      <div className="flex justify-between text-xs sm:text-sm text-[#666666]">
        <span>Dishes Subtotal</span>
        <span className="font-semibold text-[#252525]">{formatCurrency(subtotal)}</span>
      </div>

      <div className="flex justify-between text-xs sm:text-sm text-[#666666]">
        <span>Service & Packing fee (5%)</span>
        <span className="font-semibold text-[#252525]">{formatCurrency(serviceCharge)}</span>
      </div>

      <div className="border-t border-[#F47721]/20 pt-2.5 flex justify-between text-sm sm:text-base font-extrabold text-[#252525]">
        <span>Grand Total</span>
        <span className="text-[#F47721] text-lg">{formatCurrency(total)}</span>
      </div>

      <div className="text-[11px] text-[#666666] pt-1 flex items-start gap-1.5 leading-snug">
        <Info size={14} className="text-[#F47721] shrink-0 mt-0.5" />
        <span>Cash or UPI (Google Pay, PhonePe, Paytm) collected at the counter.</span>
      </div>
    </div>
  );
}

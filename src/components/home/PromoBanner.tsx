import Link from 'next/link';
import { UtensilsCrossed, ArrowRight, Sparkles } from 'lucide-react';

export function PromoBanner() {
  return (
    <div className="bg-gradient-to-r from-[#F47721] to-[#e06310] rounded-2xl p-5 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 overflow-hidden relative shadow-md shadow-[#F47721]/15">
      {/* Text Info */}
      <div className="relative z-10 max-w-lg">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold mb-1.5">
          <Sparkles size={12} />
          <span>Today&apos;s Cafeteria Special</span>
        </div>
        <h2 className="text-white font-extrabold text-xl sm:text-2xl lg:text-3xl leading-tight">
          Kerala Meals Combo at only ₹80
        </h2>
        <p className="text-white/90 text-xs sm:text-sm mt-1.5">
          Rice, sambar, rasam, 2 curries, papad, pickle & curd. Available 12:00 PM – 2:30 PM at the main meal counter.
        </p>
      </div>

      {/* Action / Icon on right */}
      <div className="relative z-10 flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
        <Link
          href="/menu?category=lunch"
          className="px-4 py-2.5 bg-white text-[#F47721] hover:bg-[#FFF7F0] font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm active:scale-95 inline-flex items-center gap-1.5"
        >
          Order Meal Now <ArrowRight size={14} />
        </Link>
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center flex-shrink-0 text-white">
          <UtensilsCrossed size={26} />
        </div>
      </div>

      {/* Background ambient decorative shapes */}
      <div className="absolute -right-8 -top-8 w-48 h-48 rounded-full bg-white/10 pointer-events-none" />
      <div className="absolute right-32 -bottom-10 w-28 h-28 rounded-full bg-black/5 pointer-events-none" />
    </div>
  );
}

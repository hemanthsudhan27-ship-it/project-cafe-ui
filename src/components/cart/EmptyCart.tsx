import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-[#FFF7F0] flex items-center justify-center mb-4">
        <ShoppingCart size={36} className="text-[#F47721]" />
      </div>
      <h2 className="text-lg font-bold text-[#252525] mb-2">Your cart is empty</h2>
      <p className="text-sm text-[#777777] mb-6 max-w-xs">
        Browse our menu and add your favourite items to get started.
      </p>
      <Link href="/menu">
        <Button>Browse Menu</Button>
      </Link>
    </div>
  );
}


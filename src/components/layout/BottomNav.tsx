'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, UtensilsCrossed, ShoppingCart, User } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

const navItems = [
  { href: '/home', label: 'Home', Icon: Home },
  { href: '/menu', label: 'Menu', Icon: UtensilsCrossed },
  { href: '/cart', label: 'Cart', Icon: ShoppingCart },
  { href: '/profile', label: 'Profile', Icon: User },
];

function BottomNavContent() {
  const pathname = usePathname();
  const { itemCount } = useCart();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#EEEEEE] h-[64px] sm:hidden shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
      <div className="w-full h-full flex items-center px-2">
        {navItems.map(({ href, label, Icon }) => {
          const isActive =
            href === '/home' ? pathname === '/home' : pathname.startsWith(href);
          const isCart = href === '/cart';

          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center gap-1 h-full relative
                transition-colors duration-150 active:scale-95
                ${isActive ? 'text-[#F47721]' : 'text-[#777777] hover:text-[#252525]'}
              `}
              aria-label={label}
            >
              <div className="relative">
                <Icon size={22} strokeWidth={isActive ? 2.5 : 1.9} />
                {isCart && itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-[18px] h-4 bg-[#F47721] text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1 shadow-sm">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </div>
              <span className={`text-[11px] font-semibold tracking-tight ${isActive ? 'text-[#F47721]' : 'text-[#777777]'}`}>
                {label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 rounded-full bg-[#F47721]" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function BottomNav() {
  return (
    <Suspense
      fallback={
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#EEEEEE] h-[64px] sm:hidden">
          <div className="w-full h-full flex items-center px-2">
            {navItems.map(({ href, label, Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex-1 flex flex-col items-center justify-center gap-1 h-full text-[#777777]"
              >
                <Icon size={22} strokeWidth={1.9} />
                <span className="text-[11px] font-medium">{label}</span>
              </Link>
            ))}
          </div>
        </nav>
      }
    >
      <BottomNavContent />
    </Suspense>
  );
}

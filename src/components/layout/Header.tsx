'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, UtensilsCrossed, Home, ClipboardList } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';

function HeaderContent() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const { user, isAuthenticated } = useAuth();

  const initials = user?.name
    ? user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '?';

  const homeTarget = isAuthenticated ? '/home' : '/';

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#EEEEEE] h-16 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="w-full max-w-7xl mx-auto h-full flex items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo / Brand */}
        <Link href={homeTarget} className="flex items-center gap-2.5 select-none group focus-ring rounded-xl p-1 -ml-1">
          <div className="w-9 h-9 rounded-xl bg-[#F47721] flex items-center justify-center shadow-xs group-hover:bg-[#e06310] transition-colors">
            <span className="text-white text-base font-black tracking-tight">C</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="text-[#252525] font-black text-base tracking-wider uppercase">CAFETERIA</span>
            </div>
            <span className="text-[11px] text-[#666666] font-medium leading-tight hidden sm:inline">
              College of Engineering Vadakara
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links (Tablet / Desktop) */}
        {isAuthenticated && (
          <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              href="/home"
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                pathname === '/home'
                  ? 'text-[#F47721] bg-[#FFF7F0]'
                  : 'text-[#666666] hover:text-[#252525] hover:bg-gray-50'
              }`}
            >
              <Home size={16} />
              Home
            </Link>
            <Link
              href="/menu"
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                pathname.startsWith('/menu')
                  ? 'text-[#F47721] bg-[#FFF7F0]'
                  : 'text-[#666666] hover:text-[#252525] hover:bg-gray-50'
              }`}
            >
              <UtensilsCrossed size={16} />
              Menu
            </Link>
            <Link
              href="/orders"
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                pathname.startsWith('/orders')
                  ? 'text-[#F47721] bg-[#FFF7F0]'
                  : 'text-[#666666] hover:text-[#252525] hover:bg-gray-50'
              }`}
            >
              <ClipboardList size={16} />
              My Orders
            </Link>
          </nav>
        )}

        {/* Right actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Cart with pop badge */}
          <Link
            href="/cart"
            className="relative p-2.5 rounded-xl hover:bg-[#FFF7F0] border border-transparent hover:border-[#F47721]/30 transition-all text-[#252525] focus-ring"
            aria-label={`Shopping cart, ${itemCount} items`}
          >
            <ShoppingCart size={20} />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-[#F47721] text-white text-[11px] font-bold rounded-full flex items-center justify-center px-1 shadow-xs animate-cart-pop">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </Link>

          {/* User profile button / Auth CTA */}
          {isAuthenticated ? (
            <Link
              href="/profile"
              className="flex items-center gap-2 pl-1 pr-1 sm:pr-3 py-1 rounded-full sm:rounded-xl hover:bg-gray-50 transition-colors border border-transparent sm:border-[#EEEEEE] focus-ring"
              aria-label="User Profile"
            >
              <div className="w-8 h-8 rounded-full bg-[#F47721] flex items-center justify-center text-white text-xs font-bold shadow-xs">
                {initials}
              </div>
              <div className="hidden sm:flex flex-col text-left text-xs">
                <span className="font-bold text-[#252525] leading-tight truncate max-w-[120px]">
                  {user?.name}
                </span>
                <span className="text-[10px] text-[#666666] capitalize leading-tight">
                  {user?.role}
                </span>
              </div>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-3 py-2 text-xs sm:text-sm font-semibold text-[#252525] hover:text-[#F47721] transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-3.5 py-2 text-xs sm:text-sm font-bold bg-[#F47721] text-white rounded-xl hover:bg-[#e06310] transition-colors shadow-xs"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export function Header() {
  return (
    <Suspense
      fallback={
        <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-[#EEEEEE] h-16">
          <div className="w-full max-w-7xl mx-auto h-full flex items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#F47721] flex items-center justify-center">
                <span className="text-white text-base font-extrabold">C</span>
              </div>
              <span className="text-[#252525] font-extrabold text-base tracking-wider uppercase">CAFETERIA</span>
            </div>
          </div>
        </header>
      }
    >
      <HeaderContent />
    </Suspense>
  );
}

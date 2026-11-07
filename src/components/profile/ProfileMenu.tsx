'use client';

import Link from 'next/link';
import { ChevronRight, LucideIcon } from 'lucide-react';

interface MenuItem {
  href?: string;
  label: string;
  icon: LucideIcon;
  badge?: string | number;
  danger?: boolean;
  onClick?: () => void;
}

interface MenuGroupProps {
  items: MenuItem[];
}

export function ProfileMenuGroup({ items }: MenuGroupProps) {
  return (
    <div className="bg-white rounded-xl border border-[#EEEEEE] overflow-hidden">
      {items.map((item, i) => {
        const content = (
          <div
            className={`flex items-center gap-3 px-4 py-3.5 ${
              i < items.length - 1 ? 'border-b border-[#EEEEEE]' : ''
            } ${item.danger ? 'hover:bg-red-50' : 'hover:bg-[#FFF7F0]'} transition-colors active:scale-[0.99]`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              item.danger ? 'bg-red-50' : 'bg-[#FFF7F0]'
            }`}>
              <item.icon size={16} className={item.danger ? 'text-[#D94A43]' : 'text-[#F47721]'} />
            </div>
            <span className={`flex-1 text-sm font-medium ${item.danger ? 'text-[#D94A43]' : 'text-[#252525]'}`}>
              {item.label}
            </span>
            {item.badge && (
              <span className="bg-[#F47721] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
            <ChevronRight size={16} className="text-[#EEEEEE]" />
          </div>
        );

        if (item.href) {
          return (
            <Link key={item.label} href={item.href} className="block">
              {content}
            </Link>
          );
        }

        return (
          <button key={item.label} className="w-full text-left" onClick={item.onClick}>
            {content}
          </button>
        );
      })}
    </div>
  );
}


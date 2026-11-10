import { ReactNode } from 'react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { Footer } from './Footer';

interface AppShellProps {
  children: ReactNode;
  hideNav?: boolean;
}

export function AppShell({ children, hideNav = false }: AppShellProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-between selection:bg-[#F47721]/20 selection:text-[#F47721]">
      <Header />
      <main className="w-full max-w-7xl mx-auto pt-16 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8 flex-1">
        {children}
      </main>

      {/* Global Footer visible on all screens (desktop & mobile) */}
      <Footer hasBottomNav={!hideNav} />

      {!hideNav && <BottomNav />}
    </div>
  );
}

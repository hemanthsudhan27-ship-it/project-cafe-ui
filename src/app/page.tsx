'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Logo } from '@/components/ui/Logo';

export default function LandingPage() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between selection:bg-[#F47721]/20 selection:text-[#F47721] overflow-x-hidden">
      {/* ── 1. Top Header: Clean Institutional Identity ─────────────── */}
      <header className="w-full bg-white sticky top-0 z-30 h-16 sm:h-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          {/* Logo & College Identity */}
          <Link href="/" className="flex items-center gap-3 select-none group">
            <Logo size={42} priority className="group-hover:scale-105 transition-transform" />
            <div className="flex flex-col text-left">
              <span className="text-[#252525] font-black text-base sm:text-lg tracking-wider uppercase leading-none">
                CAFETERIA
              </span>
              <span className="text-[11px] sm:text-xs text-[#777777] font-semibold tracking-tight mt-0.5">
                College of Engineering Vadakara
              </span>
            </div>
          </Link>

          {/* Quick Sign In / Dashboard Action */}
          <div>
            {isAuthenticated ? (
              <Link
                href="/home"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#F47721] hover:underline"
              >
                <span>Dashboard</span>
                <ArrowRight size={14} />
              </Link>
            ) : (
              <Link
                href="/login"
                className="text-xs sm:text-sm font-bold text-[#252525] hover:text-[#F47721] transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* ── 2. Hero Section: Clean & Minimalist ──────────────────────── */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* Left Column: Direct Title, Description & Actions */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#252525] tracking-tight leading-[1.1] max-w-xl">
              Skip the queue. <span className="text-[#F47721]">Order ahead.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#666666] mt-4 sm:mt-5 max-w-lg leading-relaxed font-normal">
              Order your favorite snacks, meals, and drinks between classes. Walk up to the counter and collect with your instant token.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Link
                href="/signup"
                className="w-full sm:w-auto min-h-[50px] px-8 py-3.5 bg-[#F47721] hover:bg-[#e06310] active:scale-95 text-white font-bold text-base rounded-xl shadow-md shadow-[#F47721]/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Create Account</span>
                <ArrowRight size={18} />
              </Link>

              <Link
                href="/login"
                className="w-full sm:w-auto min-h-[50px] px-8 py-3.5 bg-white hover:bg-gray-50 border border-[#DDDDDD] hover:border-[#F47721] text-[#252525] hover:text-[#F47721] font-bold text-base rounded-xl transition-all flex items-center justify-center active:scale-95"
              >
                Sign In
              </Link>
            </div>

            {/* Guest Menu Browsing */}
            <div className="mt-5">
              <Link
                href="/menu"
                className="text-xs sm:text-sm font-semibold text-[#777777] hover:text-[#F47721] transition-colors underline underline-offset-4"
              >
                Explore today&apos;s menu as guest →
              </Link>
            </div>

            {/* Authenticated user indicator */}
            {isAuthenticated && user && (
              <p className="mt-4 text-xs text-[#269B62] font-semibold">
                Signed in as {user.name} ·{' '}
                <Link href="/home" className="underline font-bold">
                  Go to Menu →
                </Link>
              </p>
            )}
          </div>

          {/* Right Column: Pure Clean Visual of Student with Egg Puff */}
          <div className="lg:col-span-5 flex justify-center order-1 lg:order-2">
            <div className="relative w-full max-w-[280px] sm:max-w-[360px] lg:max-w-[420px] aspect-square flex items-center justify-center">
              <Image
                src="/student-egg-puff.png"
                alt="College student enjoying canteen snack"
                fill
                priority
                className="object-contain"
                sizes="(max-width: 640px) 280px, (max-width: 1024px) 360px, 420px"
                unoptimized
              />
            </div>
          </div>

        </div>
      </main>

      {/* ── 3. Bottom Wavy Orange Vector with Blended Footer ─────────── */}
      <div className="relative w-full mt-auto">
        {/* Curved SVG Wave */}
        <div className="w-full overflow-hidden leading-none">
          <svg
            className="relative block w-full h-14 sm:h-20 lg:h-28"
            viewBox="0 0 1440 160"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path
              d="M0,60 C280,10 500,120 780,55 C1060,-10 1260,95 1440,50 L1440,160 L0,160 Z"
              fill="#F47721"
            />
          </svg>
        </div>

        {/* Footer Blended Seamlessly Inside Orange Vector */}
        <footer className="w-full bg-[#F47721] text-white pt-2 pb-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-white/90">
              <span className="font-extrabold text-sm tracking-widest uppercase">
                CAFETERIA
              </span>
              <span className="text-white/60">·</span>
              <span className="text-xs font-medium text-white/90">
                College of Engineering Vadakara
              </span>
            </div>

            {/* MANDATORY ATTRIBUTION */}
            <div className="text-xs sm:text-sm font-semibold text-white">
              Designed and Developed by IEDC CEV
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

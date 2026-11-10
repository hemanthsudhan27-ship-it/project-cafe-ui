'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, UtensilsCrossed, Clock, ShieldCheck, GraduationCap, Sparkles, CheckCircle2, BookOpen, Users, Flame } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Footer } from '@/components/layout/Footer';

export default function LandingPage() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between selection:bg-[#F47721]/20 selection:text-[#F47721]">
      {/* ── 1. Official Institutional Header ──────────────────────────── */}
      <header className="w-full bg-white/95 backdrop-blur-sm border-b border-[#EEEEEE] sticky top-0 z-30 h-16 sm:h-[72px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          {/* Logo & College Identity */}
          <Link href="/" className="flex items-center gap-3 select-none group">
            <div className="w-10 h-10 rounded-xl bg-[#F47721] flex items-center justify-center shadow-sm group-hover:bg-[#e06310] transition-colors">
              <span className="text-white text-lg font-black tracking-tight">C</span>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[#252525] font-extrabold text-base tracking-wider uppercase leading-tight">
                CAFETERIA
              </span>
              <span className="text-[11px] sm:text-xs text-[#777777] font-medium leading-tight">
                College of Engineering Vadakara
              </span>
            </div>
          </Link>

          {/* Right Header Navigation Action */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                href="/home"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#F47721] text-white text-xs sm:text-sm font-bold rounded-xl hover:bg-[#e06310] active:scale-95 transition-all shadow-sm"
              >
                <span>Enter Dashboard</span>
                <ArrowRight size={15} />
              </Link>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-bold text-[#252525] hover:text-[#F47721] hover:bg-[#FFF7F0] border border-[#EEEEEE] hover:border-[#F47721]/30 rounded-xl transition-all"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* ── 2. Hero Section: Balanced Two-Column Desktop & Clean Mobile ── */}
      <main className="flex-1 flex flex-col justify-center py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* ── Left Column: Typography & CTAs ──────────────────────── */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              {/* Institutional Label Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF7F0] border border-[#F47721]/30 text-[#F47721] text-xs font-bold tracking-wide uppercase mb-4 sm:mb-5">
                <GraduationCap size={15} className="text-[#F47721]" />
                <span>Official Campus Dining Portal</span>
              </div>

              {/* Main Heading Hierarchy */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#252525] tracking-tight uppercase leading-[1.08]">
                CAFETERIA
              </h1>
              <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-[#F47721] mt-1.5 sm:mt-2 tracking-tight">
                College of Engineering Vadakara
              </p>

              {/* Welcoming Description */}
              <p className="text-sm sm:text-base lg:text-lg text-[#666666] mt-3.5 sm:mt-5 max-w-xl leading-relaxed">
                Order freshly prepared campus meals in advance, bypass the break-time counter rush, and collect your food without waiting in line.
              </p>

              {/* Action Buttons: Create Account as distinctive glazed CTA + Sign In as quieter action */}
              <div className="mt-7 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                <Link
                  href="/signup"
                  className="btn-glazed-orange w-full sm:w-auto px-7 py-3.5 sm:py-4 rounded-xl text-sm sm:text-base font-bold text-center flex items-center justify-center gap-2"
                >
                  <span>Create Account</span>
                  <ArrowRight size={18} />
                </Link>

                <Link
                  href="/login"
                  className="w-full sm:w-auto min-h-[46px] px-7 py-3 sm:py-4 bg-white border-2 border-[#EEEEEE] hover:border-[#F47721] hover:text-[#F47721] hover:bg-[#FFF7F0] text-[#252525] font-bold text-sm sm:text-base rounded-xl transition-all duration-200 text-center flex items-center justify-center active:scale-95"
                >
                  Sign In
                </Link>
              </div>

              {/* Authenticated user notification if already logged in */}
              {isAuthenticated && user && (
                <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-xl text-xs text-[#269B62]">
                  <CheckCircle2 size={15} />
                  <span>Signed in as <strong>{user.name}</strong> ({user.role})</span>
                  <Link href="/home" className="underline font-bold ml-1 text-[#269B62]">
                    Go to Menu →
                  </Link>
                </div>
              )}

              {/* Campus Community Indicator */}
              <div className="mt-7 pt-5 border-t border-[#EEEEEE] flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-semibold text-[#666666]">
                <span className="text-[#252525] font-bold">Campus Community Access:</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FFF7F0] text-[#252525] border border-[#F47721]/15">
                  <GraduationCap size={14} className="text-[#F47721]" /> Students
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FFF7F0] text-[#252525] border border-[#F47721]/15">
                  <BookOpen size={14} className="text-[#F47721]" /> Faculty (Teacher ID)
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FFF7F0] text-[#252525] border border-[#F47721]/15">
                  <Users size={14} className="text-[#F47721]" /> Campus Guests
                </span>
              </div>
            </div>

            {/* ── Right Column: Food Visual Composition ───────────────── */}
            <div className="lg:col-span-5 w-full">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Food Showcase Card */}
                <div className="bg-gradient-to-b from-[#FFF7F0] to-white border border-[#EEEEEE] rounded-3xl p-3.5 sm:p-4 shadow-[0_16px_40px_rgba(0,0,0,0.06)] relative overflow-hidden">
                  
                  {/* Primary Feature Image: Kerala Meals & Biryani */}
                  <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#FFF7F0]">
                    <Image
                      src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&h=450&fit=crop"
                      alt="Kerala Meals and Campus Specials"
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 450px"
                      priority
                      unoptimized
                    />

                    {/* Operational Status Pill */}
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-full border border-[#EEEEEE] shadow-xs flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#269B62] animate-pulse" />
                      <span className="text-xs font-bold text-[#252525]">Cafeteria Counter Open</span>
                    </div>

                    {/* Wait Time Pill */}
                    <div className="absolute top-3 right-3 bg-[#252525]/85 backdrop-blur-xs text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-xs">
                      <Clock size={13} className="text-[#F47721]" />
                      <span>~10-15m prep</span>
                    </div>
                  </div>

                  {/* Food Highlights Card Banner */}
                  <div className="mt-3.5 pt-1 px-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#F47721]">
                          Today&apos;s Special Meal
                        </span>
                        <h3 className="text-sm sm:text-base font-extrabold text-[#252525]">
                          Full Kerala Meals Combo
                        </h3>
                        <p className="text-xs text-[#777777]">
                          Rice, sambar, rasam, 2 curries, papad & curd
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-base sm:text-lg font-black text-[#F47721]">
                          ₹80
                        </span>
                        <span className="block text-[10px] text-[#269B62] font-semibold">
                          Available Daily
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Overlapping Secondary Accent: Hot Breakfast & Beverage Pill */}
                  <div className="mt-3 bg-white border border-[#EEEEEE] rounded-2xl p-2.5 flex items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-[#FFF7F0] flex-shrink-0">
                        <Image
                          src="https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=150&h=150&fit=crop"
                          alt="Masala Dosa"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#252525] leading-tight">Crispy Masala Dosa</p>
                        <p className="text-[11px] text-[#777777]">With hot sambar & chutney · ₹55</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FFF7F0] text-[#F47721] text-[11px] font-bold">
                      <Flame size={12} className="text-[#F47721]" /> Hot
                    </span>
                  </div>
                </div>

                {/* Subtle soft warm glow backdrop */}
                <div className="absolute -inset-2 bg-gradient-to-r from-[#F47721]/10 to-amber-500/10 rounded-[32px] -z-10 blur-xl opacity-70 pointer-events-none" />
              </div>
            </div>

          </div>

          {/* ── 3. Three Refined Feature Cards ─────────────────────────── */}
          <div className="mt-14 sm:mt-18 pt-10 border-t border-[#EEEEEE]">
            <div className="text-center sm:text-left mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F47721]">
                Campus Dining Experience
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#252525] mt-0.5">
                Engineered for College of Engineering Vadakara
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
              {/* Card 1: Fresh Campus Meals */}
              <div className="bg-[#FFF7F0]/60 hover:bg-[#FFF7F0] border border-[#EEEEEE] hover:border-[#F47721]/30 rounded-2xl p-6 transition-all duration-200 flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white border border-[#EEEEEE] flex items-center justify-center text-[#F47721] shadow-xs group-hover:scale-105 transition-transform">
                      <UtensilsCrossed size={22} />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white border border-[#EEEEEE] text-[#777777]">
                      Daily Menu
                    </span>
                  </div>
                  <h3 className="font-extrabold text-base text-[#252525] group-hover:text-[#F47721] transition-colors">
                    Fresh Campus Meals
                  </h3>
                  <p className="text-xs sm:text-sm text-[#777777] mt-2 leading-relaxed">
                    Breakfast dosas, nutritious lunch meals, freshly cooked biryani, afternoon snacks, and hot beverages served daily at student-friendly pricing.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#EEEEEE]/70 text-[11px] font-semibold text-[#F47721]">
                  Breakfast · Lunch · Snacks · Drinks
                </div>
              </div>

              {/* Card 2: Quick Counter Pickup */}
              <div className="bg-[#FFF7F0]/60 hover:bg-[#FFF7F0] border border-[#EEEEEE] hover:border-[#F47721]/30 rounded-2xl p-6 transition-all duration-200 flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white border border-[#EEEEEE] flex items-center justify-center text-[#F47721] shadow-xs group-hover:scale-105 transition-transform">
                      <Clock size={22} />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white border border-[#EEEEEE] text-[#777777]">
                      Skip the Queue
                    </span>
                  </div>
                  <h3 className="font-extrabold text-base text-[#252525] group-hover:text-[#F47721] transition-colors">
                    Quick Counter Pickup
                  </h3>
                  <p className="text-xs sm:text-sm text-[#777777] mt-2 leading-relaxed">
                    Place orders between periods and break intervals. Watch live preparation updates on your screen and pick up packaged food without standing in line.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#EEEEEE]/70 text-[11px] font-semibold text-[#F47721]">
                  Order Ahead · Live Token Tracking
                </div>
              </div>

              {/* Card 3: Campus Community */}
              <div className="bg-[#FFF7F0]/60 hover:bg-[#FFF7F0] border border-[#EEEEEE] hover:border-[#F47721]/30 rounded-2xl p-6 transition-all duration-200 flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white border border-[#EEEEEE] flex items-center justify-center text-[#F47721] shadow-xs group-hover:scale-105 transition-transform">
                      <ShieldCheck size={22} />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white border border-[#EEEEEE] text-[#777777]">
                      CEV Exclusive
                    </span>
                  </div>
                  <h3 className="font-extrabold text-base text-[#252525] group-hover:text-[#F47721] transition-colors">
                    Campus Community
                  </h3>
                  <p className="text-xs sm:text-sm text-[#777777] mt-2 leading-relaxed">
                    Role-tailored experience for enrolled students, teaching faculty with Teacher ID confirmation, and campus visitors with hassle-free counter payment.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#EEEEEE]/70 text-[11px] font-semibold text-[#F47721]">
                  Student · Faculty · Guest Support
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* ── 4. Integrated Footer with Mandatory Attribution ───────────── */}
      <Footer />
    </div>
  );
}

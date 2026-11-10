'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, ArrowLeft, MailCheck } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/Toast';
import { authService } from '@/lib/services/authService';
import { PageSpinner } from '@/components/ui/Spinner';
import { Footer } from '@/components/layout/Footer';

const RESEND_COOLDOWN = 30;

function OtpVerificationContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const router = useRouter();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [verified, setVerified] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [redirectCountdown, setRedirectCountdown] = useState(10);

  // Resend cooldown timer
  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [countdown]);

  // Redirect after verification to /home
  useEffect(() => {
    if (verified) {
      if (redirectCountdown <= 0) {
        router.push('/home');
        return;
      }
      const t = setTimeout(() => setRedirectCountdown(c => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [verified, redirectCountdown, router]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError('Enter the 6-digit verification code');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const user = await authService.verifyRegistrationOtp(email, otp);
      login(user);
      setVerified(true);
      showToast('Email verified! Welcome to CEV Cafeteria', 'success');
    } catch (err: any) {
      setError(err.message || 'Invalid or expired OTP code');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await authService.resendOtp(email);
      setCountdown(RESEND_COOLDOWN);
      showToast('New OTP sent! (Demo: use 123456)', 'info');
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setResending(false);
    }
  };

  if (verified) {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-between">
        <div className="h-1.5 bg-[#269B62]" />
        <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-12 max-w-md mx-auto text-center w-full">
          <div className="w-20 h-20 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center mb-5 text-[#269B62]">
            <CheckCircle size={44} />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#269B62] bg-green-100 px-3 py-1 rounded-full mb-2">
            Verification Successful
          </span>
          <h1 className="text-2xl font-extrabold text-[#252525]">Email Verified!</h1>
          <p className="text-sm text-[#777777] mt-2 mb-6">
            Your account is confirmed. Entering the cafeteria food ordering dashboard in:
          </p>
          <div className="text-5xl font-black text-[#F47721] font-mono">{redirectCountdown}</div>
          <p className="text-xs text-[#777777] mt-1">seconds</p>
          <button
            onClick={() => router.push('/home')}
            className="mt-8 px-6 py-3 bg-[#F47721] text-white font-bold text-sm rounded-xl hover:bg-[#e06310] transition-colors shadow-sm"
          >
            Enter Cafeteria Now →
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <div className="h-1.5 bg-[#F47721]" />

      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 py-10 max-w-md mx-auto w-full">
        <Link
          href="/signup"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#777777] hover:text-[#252525] mb-6 w-fit transition-colors"
        >
          <ArrowLeft size={16} /> Back to Sign Up
        </Link>

        {/* Icon & Title */}
        <div className="text-center mb-7">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-[#FFF7F0] border border-[#EEEEEE] items-center justify-center mb-3 text-[#F47721] shadow-xs">
            <MailCheck size={32} />
          </div>
          <span className="text-[11px] font-bold tracking-widest text-[#F47721] uppercase block">
            College of Engineering Vadakara
          </span>
          <h1 className="text-2xl font-black text-[#252525] mt-1">Verify Your Email</h1>
          <p className="text-xs sm:text-sm text-[#666666] mt-2">
            We sent a 6-digit confirmation code to:
          </p>
          <p className="text-sm font-bold text-[#252525] mt-0.5">{email || 'your email'}</p>
          <p className="text-xs text-[#F47721] mt-1.5 font-bold">(Quick Demo Code: 123456)</p>
        </div>

        <form onSubmit={handleVerify} className="flex flex-col gap-4">
          <Input
            label="Enter 6-Digit OTP Code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            value={otp}
            onChange={e => {
              setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
              setError('');
            }}
            placeholder="······"
            maxLength={6}
            error={error}
            className="tracking-[0.4em] text-center text-xl font-mono font-bold"
            required
          />

          <Button type="submit" fullWidth size="lg" loading={loading} className="shadow-md shadow-[#F47721]/20 font-bold">
            Confirm & Enter Cafeteria
          </Button>
        </form>

        {/* Resend options */}
        <div className="text-center mt-6">
          <p className="text-xs text-[#666666]">Didn&apos;t get the code?</p>
          {countdown > 0 ? (
            <p className="text-xs text-[#666666] mt-1">
              You can request another code in <strong>{countdown}s</strong>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="mt-1 text-xs font-bold text-[#F47721] hover:underline disabled:opacity-50 cursor-pointer"
            >
              {resending ? 'Sending…' : 'Resend OTP Code'}
            </button>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function OtpVerificationPage() {
  return (
    <Suspense fallback={<PageSpinner />}>
      <OtpVerificationContent />
    </Suspense>
  );
}

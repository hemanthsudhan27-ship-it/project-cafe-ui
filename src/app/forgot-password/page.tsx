'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { authService } from '@/lib/services/authService';
import { isValidEmail } from '@/lib/utils/validators';
import { Footer } from '@/components/layout/Footer';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { showToast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setError('Enter a valid email address');
      return;
    }
    setLoading(true);
    try {
      await authService.sendPasswordResetOtp(email);
      setSent(true);
      showToast('Password reset OTP sent! (Demo code: 123456)', 'info');
    } catch (err: any) {
      showToast(err.message, 'error');
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <div className="h-1.5 bg-[#F47721]" />

      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 py-10 max-w-md mx-auto w-full">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#666666] mb-6 w-fit hover:text-[#252525] transition-colors min-h-[38px] py-1 px-1 -ml-1 rounded-lg focus-ring"
        >
          <ArrowLeft size={16} /> Back to Sign In
        </Link>

        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-[#FFF7F0] border border-[#EEEEEE] items-center justify-center mb-4 text-[#F47721] shadow-xs">
            <KeyRound size={32} />
          </div>
          <span className="text-[11px] font-bold tracking-widest text-[#F47721] uppercase block">
            College of Engineering Vadakara
          </span>
          <h1 className="text-2xl font-black text-[#252525] mt-1">Forgot Password?</h1>
          <p className="text-xs sm:text-sm text-[#666666] mt-2">
            Enter your registered college email and we&apos;ll send you a password reset code.
          </p>
        </div>

        {sent ? (
          <div className="flex flex-col gap-4">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-[#269B62]">
              <div className="flex items-center gap-2 font-medium">
                <CheckCircle2 size={16} className="text-[#269B62] shrink-0" />
                <span>Reset code sent to <strong>{email}</strong></span>
              </div>
              <span className="text-xs text-[#777777] mt-1 block">
                Quick Demo: use <strong>123456</strong> as the reset code
              </span>
            </div>
            <Button
              fullWidth
              size="lg"
              onClick={() =>
                router.push(`/reset-password?email=${encodeURIComponent(email)}`)
              }
            >
              Enter Reset Code →
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Registered Email Address"
              type="email"
              value={email}
              onChange={e => {
                setEmail(e.target.value);
                setError('');
              }}
              placeholder="you@college.edu or email@example.com"
              leftIcon={<Mail size={16} />}
              error={error}
              required
            />
            <Button type="submit" fullWidth size="lg" loading={loading} className="shadow-md shadow-[#F47721]/20">
              Send Password Reset Code
            </Button>
          </form>
        )}
      </div>

      <Footer />
    </div>
  );
}

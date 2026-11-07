'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Lock, ArrowLeft, CheckCircle, ShieldCheck } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { authService } from '@/lib/services/authService';
import { isValidPassword } from '@/lib/utils/validators';
import { PageSpinner } from '@/components/ui/Spinner';
import { Footer } from '@/components/layout/Footer';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const router = useRouter();
  const { showToast } = useToast();

  const [step, setStep] = useState<'otp' | 'password' | 'done'>('otp');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setErrors({ otp: 'Enter the 6-digit code' });
      return;
    }
    setLoading(true);
    try {
      await authService.verifyResetOtp(email, otp);
      setStep('password');
      setErrors({});
    } catch (err: any) {
      setErrors({ otp: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    const pwErr = isValidPassword(newPassword);
    if (pwErr) errs.newPassword = pwErr;
    if (newPassword !== confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    try {
      await authService.resetPassword(email, newPassword);
      setStep('done');
      showToast('Password reset successfully!', 'success');
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <div className="h-1.5 bg-[#F47721]" />

      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 py-10 max-w-md mx-auto w-full">
        <Link
          href="/forgot-password"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#777777] mb-6 w-fit hover:text-[#252525] transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </Link>

        {step === 'otp' && (
          <>
            <div className="text-center mb-8">
              <span className="text-[11px] font-bold tracking-widest text-[#F47721] uppercase block">
                College of Engineering Vadakara
              </span>
              <h1 className="text-2xl font-extrabold text-[#252525] mt-1">Enter Reset Code</h1>
              <p className="text-sm text-[#777777] mt-2">
                We sent a 6-digit reset code to <strong>{email || 'your email'}</strong>
              </p>
              <p className="text-xs text-[#F47721] mt-1 font-semibold">(Quick Demo Code: <strong>123456</strong>)</p>
            </div>
            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
              <Input
                label="6-Digit Reset Code (OTP)"
                type="text"
                value={otp}
                onChange={e => {
                  setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
                  setErrors({});
                }}
                placeholder="123456"
                maxLength={6}
                error={errors.otp}
                required
              />
              <Button type="submit" fullWidth size="lg" loading={loading} className="shadow-md shadow-[#F47721]/20">
                Verify Code & Continue
              </Button>
            </form>
          </>
        )}

        {step === 'password' && (
          <>
            <div className="text-center mb-8">
              <span className="text-[11px] font-bold tracking-widest text-[#F47721] uppercase block">
                College of Engineering Vadakara
              </span>
              <h1 className="text-2xl font-extrabold text-[#252525] mt-1">Set New Password</h1>
              <p className="text-sm text-[#777777] mt-2">
                Create a strong password for your cafeteria account.
              </p>
            </div>
            <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
              <Input
                label="New Password"
                type={showPw ? 'text' : 'password'}
                value={newPassword}
                onChange={e => {
                  setNewPassword(e.target.value);
                  setErrors(er => ({ ...er, newPassword: '' }));
                }}
                placeholder="Min 8 chars with a number"
                leftIcon={<Lock size={16} />}
                error={errors.newPassword}
                required
                rightElement={
                  <button type="button" onClick={() => setShowPw(s => !s)} className="text-[#777777]">
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />
              <Input
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={e => {
                  setConfirmPassword(e.target.value);
                  setErrors(er => ({ ...er, confirmPassword: '' }));
                }}
                placeholder="Re-enter new password"
                leftIcon={<Lock size={16} />}
                error={errors.confirmPassword}
                required
              />
              <Button type="submit" fullWidth size="lg" loading={loading} className="shadow-md shadow-[#F47721]/20">
                Save New Password
              </Button>
            </form>
          </>
        )}

        {step === 'done' && (
          <div className="flex flex-col items-center text-center py-6">
            <div className="w-20 h-20 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center mb-4 text-[#269B62]">
              <CheckCircle size={44} />
            </div>
            <h2 className="text-2xl font-extrabold text-[#252525]">Password Reset Complete!</h2>
            <p className="text-sm text-[#777777] mt-2 mb-6">
              Your password has been securely updated. You can now sign in with your new credentials.
            </p>
            <Button onClick={() => router.push('/login')} fullWidth size="lg" className="shadow-md shadow-[#F47721]/20">
              Sign In to Cafeteria
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<PageSpinner />}>
      <ResetPasswordContent />
    </Suspense>
  );
}

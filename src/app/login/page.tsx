'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, ArrowLeft, GraduationCap, BookOpen, Users } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/Toast';
import { authService } from '@/lib/services/authService';
import { isValidEmail } from '@/lib/utils/validators';
import { Footer } from '@/components/layout/Footer';

type LoginMode = 'password' | 'otp';

export default function LoginPage() {
  const [mode, setMode] = useState<LoginMode>('password');
  const router = useRouter();
  const { login } = useAuth();
  const { showToast } = useToast();

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      {/* Top accent */}
      <div className="h-1.5 bg-[#F47721]" />

      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 py-8 sm:py-12 max-w-md mx-auto w-full">
        {/* Back to landing */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#666666] hover:text-[#252525] mb-6 w-fit transition-colors min-h-[38px] py-1 px-1 -ml-1 rounded-lg focus-ring"
        >
          <ArrowLeft size={16} /> Back to Cafeteria
        </Link>

        {/* Logo & College Header */}
        <div className="text-center mb-6">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-[#F47721] items-center justify-center mb-3 shadow-md shadow-[#F47721]/20">
            <span className="text-white text-2xl font-black">C</span>
          </div>
          <span className="text-[11px] font-bold tracking-widest text-[#F47721] uppercase block">
            College of Engineering Vadakara
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#252525] mt-1">Sign In</h1>
          <p className="text-xs sm:text-sm text-[#666666] mt-1">Access your campus cafeteria account</p>
        </div>

        {/* Mode tabs */}
        <div className="flex bg-[#FFF7F0] rounded-xl p-1 mb-6 border border-[#EEEEEE]">
          <button
            type="button"
            className={`flex-1 min-h-[44px] py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
              mode === 'password'
                ? 'bg-white text-[#F47721] shadow-xs'
                : 'text-[#666666] hover:text-[#252525]'
            }`}
            onClick={() => setMode('password')}
          >
            Password Login
          </button>
          <button
            type="button"
            className={`flex-1 min-h-[44px] py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
              mode === 'otp'
                ? 'bg-white text-[#F47721] shadow-xs'
                : 'text-[#666666] hover:text-[#252525]'
            }`}
            onClick={() => setMode('otp')}
          >
            Email OTP
          </button>
        </div>

        {mode === 'password' ? (
          <PasswordLoginForm login={login} router={router} showToast={showToast} />
        ) : (
          <OtpLoginForm router={router} showToast={showToast} />
        )}

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-[#EEEEEE]" />
          <span className="text-xs text-[#777777]">or continue with</span>
          <div className="flex-1 h-px bg-[#EEEEEE]" />
        </div>

        <GoogleAuthButton
          label="Sign in with Google"
          onClick={async () => {
            try {
              const user = await authService.googleSignIn();
              login(user);
              showToast('Signed in with Google!', 'success');
              router.push('/home');
            } catch (err: any) {
              showToast(err.message, 'error');
            }
          }}
        />

        {/* Sign up link */}
        <p className="text-center text-sm text-[#777777] mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-[#F47721] font-semibold hover:underline">
            Create an Account
          </Link>
        </p>
      </div>

      {/* Attribution Footer */}
      <Footer />
    </div>
  );
}

// ── Password Login Form ─────────────────────────────────────────────────────
function PasswordLoginForm({ login, router, showToast }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!email) errs.email = 'Email is required';
    else if (!isValidEmail(email)) errs.email = 'Enter a valid email address';
    if (!password) errs.password = 'Password is required';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    try {
      const user = await authService.login({ email, password });
      login(user);
      showToast('Welcome back to the Cafeteria!', 'success');
      router.push('/home');
    } catch (err: any) {
      showToast(err.message, 'error');
      setErrors({ password: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="College Email Address"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="you@college.edu or email@example.com"
        leftIcon={<Mail size={16} />}
        error={errors.email}
        required
      />
      <Input
        label="Password"
        type={showPw ? 'text' : 'password'}
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Enter your password"
        leftIcon={<Lock size={16} />}
        error={errors.password}
        required
        rightElement={
          <button
            type="button"
            onClick={() => setShowPw(s => !s)}
            className="text-[#777777] hover:text-[#252525]"
          >
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        }
      />

      {/* Forgot password */}
      <div className="flex justify-end -mt-2">
        <Link href="/forgot-password" className="text-xs text-[#F47721] hover:underline font-medium">
          Forgot password?
        </Link>
      </div>

      <Button type="submit" fullWidth size="lg" loading={loading} className="shadow-md shadow-[#F47721]/20">
        Sign In to Cafeteria
      </Button>

      {/* Demo credentials hint */}
      <div className="bg-[#FFF7F0] border border-[#EEEEEE] rounded-xl p-3 text-xs text-[#777777]">
        <p className="font-bold text-[#252525] mb-1.5">Quick Demo Credentials (Password: password1)</p>
        <div className="space-y-1">
          <p className="flex items-center gap-1.5"><GraduationCap size={14} className="text-[#F47721] shrink-0" /> Student: <code>student@college.edu</code></p>
          <p className="flex items-center gap-1.5"><BookOpen size={14} className="text-[#F47721] shrink-0" /> Faculty: <code>faculty@college.edu</code></p>
          <p className="flex items-center gap-1.5"><Users size={14} className="text-[#F47721] shrink-0" /> Guest: <code>guest@example.com</code></p>
        </div>
      </div>
    </form>
  );
}

// ── OTP Login Form ──────────────────────────────────────────────────────────
function OtpLoginForm({ router, showToast }: any) {
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { login } = useAuth();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setErrors({ email: 'Enter a valid email address' });
      return;
    }
    setLoading(true);
    try {
      await authService.sendLoginOtp(email);
      setOtpSent(true);
      showToast('OTP code sent! Check your inbox (use 123456 in demo)', 'info');
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setErrors({ otp: 'Enter a 6-digit OTP' });
      return;
    }
    setLoading(true);
    try {
      const user = await authService.verifyLoginOtp(email, otp);
      login(user);
      showToast('Signed in successfully!', 'success');
      router.push('/home');
    } catch (err: any) {
      setErrors({ otp: err.message });
    } finally {
      setLoading(false);
    }
  };

  if (!otpSent) {
    return (
      <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
        <Input
          label="Registered Email Address"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Enter your registered email"
          leftIcon={<Mail size={16} />}
          error={errors.email}
          required
        />
        <Button type="submit" fullWidth size="lg" loading={loading}>
          Send Verification OTP
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={handleVerify} className="flex flex-col gap-4">
      <div className="bg-[#FFF7F0] border border-[#EEEEEE] rounded-xl p-3 text-sm text-[#777777] text-center">
        Code sent to <strong className="text-[#252525]">{email}</strong>
        <br /><span className="text-xs text-[#F47721] font-semibold">(Demo: use 123456)</span>
      </div>
      <Input
        label="Enter 6-Digit OTP"
        type="text"
        value={otp}
        onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
        placeholder="123456"
        maxLength={6}
        error={errors.otp}
        required
      />
      <Button type="submit" fullWidth size="lg" loading={loading}>
        Verify & Enter Cafeteria
      </Button>
      <button
        type="button"
        onClick={() => { setOtpSent(false); setOtp(''); }}
        className="text-xs text-[#777777] hover:text-[#F47721] text-center underline"
      >
        Change email address
      </button>
    </form>
  );
}

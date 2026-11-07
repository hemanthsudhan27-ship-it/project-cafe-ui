'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, User, Phone, Building2, BadgeCheck, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton';
import { RoleSelector } from '@/components/auth/RoleSelector';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/Toast';
import { authService } from '@/lib/services/authService';
import { UserRole } from '@/lib/types/auth';
import { isValidEmail, isValidPassword, isValidName, isValidPhone } from '@/lib/utils/validators';
import { Footer } from '@/components/layout/Footer';

export default function SignUpPage() {
  const [role, setRole] = useState<UserRole>('student');
  const [step, setStep] = useState<'form' | 'google-teacher'>('form');
  const [googleUser, setGoogleUser] = useState<any>(null);
  const [teacherId, setTeacherId] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();
  const { showToast } = useToast();

  // Form state
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    teacherId: '',
    password: '',
    confirmPassword: '',
  });
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setField = (field: string, value: string) => {
    setForm(f => ({ ...f, [field]: value }));
    setErrors(e => ({ ...e, [field]: '' }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};

    const nameErr = isValidName(form.name);
    if (nameErr) errs.name = nameErr;

    if (!form.email) errs.email = 'Email is required';
    else if (!isValidEmail(form.email)) errs.email = 'Enter a valid email address';

    if (form.phone) {
      const phoneErr = isValidPhone(form.phone);
      if (phoneErr) errs.phone = phoneErr;
    }

    if (role === 'faculty' && !form.teacherId.trim()) {
      errs.teacherId = 'Teacher ID is mandatory for faculty members';
    }

    const pwErr = isValidPassword(form.password);
    if (pwErr) errs.password = pwErr;

    if (form.password !== form.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    try {
      await authService.register({
        name: form.name,
        email: form.email,
        password: form.password,
        role,
        phone: form.phone || undefined,
        department: role !== 'guest' ? form.department || undefined : undefined,
        teacherId: role === 'faculty' ? form.teacherId : undefined,
      });

      // Navigate to OTP verification
      router.push(`/verify-otp?email=${encodeURIComponent(form.email)}&mode=register`);
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      const user = await authService.googleSignIn(role);

      if (role === 'faculty') {
        setGoogleUser(user);
        setStep('google-teacher');
        return;
      }

      login(user);
      showToast('Account created with Google!', 'success');
      router.push('/home');
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleFacultySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherId.trim()) {
      return;
    }
    const updatedUser = { ...googleUser, teacherId };
    login(updatedUser);
    showToast('Welcome to CEV Cafeteria!', 'success');
    router.push('/home');
  };

  if (step === 'google-teacher') {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-between">
        <div className="h-1.5 bg-[#F47721]" />
        <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 py-10 max-w-md mx-auto w-full">
          <div className="text-center mb-6">
            <div className="inline-flex w-12 h-12 rounded-xl bg-[#FFF7F0] items-center justify-center text-[#F47721] mb-2">
              <BadgeCheck size={28} />
            </div>
            <h2 className="text-xl font-bold text-[#252525]">Faculty Verification</h2>
            <p className="text-sm text-[#777777] mt-1">
              Please enter your official College Teacher ID to finalize faculty registration.
            </p>
          </div>
          <form onSubmit={handleGoogleFacultySubmit} className="flex flex-col gap-4">
            <Input
              label="Teacher ID"
              value={teacherId}
              onChange={e => setTeacherId(e.target.value)}
              placeholder="e.g. FAC-CEV-2024"
              leftIcon={<BadgeCheck size={16} />}
              required
            />
            <Button type="submit" fullWidth size="lg">
              Complete Faculty Registration
            </Button>
          </form>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <div className="h-1.5 bg-[#F47721]" />

      <div className="flex-1 px-4 sm:px-6 py-8 sm:py-12 max-w-md mx-auto w-full">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#777777] hover:text-[#252525] mb-4 w-fit transition-colors"
        >
          <ArrowLeft size={16} /> Back to Cafeteria
        </Link>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-[#F47721] items-center justify-center mb-2 shadow-md shadow-[#F47721]/20">
            <span className="text-white text-xl font-extrabold">C</span>
          </div>
          <span className="text-[11px] font-bold tracking-widest text-[#F47721] uppercase block">
            College of Engineering Vadakara
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#252525] mt-1">Create Account</h1>
          <p className="text-sm text-[#777777] mt-1">Join the campus cafeteria ordering platform</p>
        </div>

        {/* Role selector */}
        <div className="mb-5">
          <RoleSelector selected={role} onChange={setRole} />
        </div>

        {/* Google Registration */}
        <GoogleAuthButton
          label={`Register as ${role.charAt(0).toUpperCase() + role.slice(1)} with Google`}
          onClick={handleGoogle}
          loading={loading}
        />

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-[#EEEEEE]" />
          <span className="text-xs text-[#777777]">or register with email</span>
          <div className="flex-1 h-px bg-[#EEEEEE]" />
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Full Name"
            value={form.name}
            onChange={e => setField('name', e.target.value)}
            placeholder="Enter your full name"
            leftIcon={<User size={16} />}
            error={errors.name}
            required
          />
          <Input
            label="Email Address"
            type="email"
            value={form.email}
            onChange={e => setField('email', e.target.value)}
            placeholder="you@college.edu or email@example.com"
            leftIcon={<Mail size={16} />}
            error={errors.email}
            required
          />
          <Input
            label="Phone Number"
            type="tel"
            value={form.phone}
            onChange={e => setField('phone', e.target.value)}
            placeholder="10-digit mobile number"
            leftIcon={<Phone size={16} />}
            error={errors.phone}
            hint="Optional for order notifications"
          />

          {/* Department shown only for student and faculty, never for guest */}
          {role !== 'guest' && (
            <Input
              label="Department"
              value={form.department}
              onChange={e => setField('department', e.target.value)}
              placeholder="e.g. Computer Science, Mechanical…"
              leftIcon={<Building2 size={16} />}
              hint="Optional"
            />
          )}

          {/* Teacher ID mandatory for Faculty only */}
          {role === 'faculty' && (
            <Input
              label="Teacher ID"
              value={form.teacherId}
              onChange={e => setField('teacherId', e.target.value)}
              placeholder="e.g. FAC-2024-001"
              leftIcon={<BadgeCheck size={16} />}
              error={errors.teacherId}
              required
            />
          )}

          <Input
            label="Password"
            type={showPw ? 'text' : 'password'}
            value={form.password}
            onChange={e => setField('password', e.target.value)}
            placeholder="At least 8 characters with a number"
            leftIcon={<Lock size={16} />}
            error={errors.password}
            required
            rightElement={
              <button type="button" onClick={() => setShowPw(s => !s)} className="text-[#777777]">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
          />
          <Input
            label="Confirm Password"
            type="password"
            value={form.confirmPassword}
            onChange={e => setField('confirmPassword', e.target.value)}
            placeholder="Re-enter password"
            leftIcon={<Lock size={16} />}
            error={errors.confirmPassword}
            required
          />

          <Button type="submit" fullWidth size="lg" loading={loading} className="shadow-md shadow-[#F47721]/20">
            Create Account & Verify
          </Button>
        </form>

        <p className="text-center text-sm text-[#777777] mt-6">
          Already registered?{' '}
          <Link href="/login" className="text-[#F47721] font-semibold hover:underline">
            Sign In Here
          </Link>
        </p>
      </div>

      <Footer />
    </div>
  );
}

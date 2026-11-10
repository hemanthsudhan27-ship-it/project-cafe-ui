'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ShoppingBag, Settings, LogOut, ChevronRight,
  Phone, Building2, BadgeCheck, Pencil, ArrowLeft, Mail, Shield, QrCode
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileMenuGroup } from '@/components/profile/ProfileMenu';
import { TakeawayQRPass } from '@/components/profile/TakeawayQRPass';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/Toast';
import { authService } from '@/lib/services/authService';
import { orderService } from '@/lib/services/orderService';
import { Order } from '@/lib/types/order';

export default function ProfilePage() {
  const { user, logout, updateUser } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    orderService.getOrders().then(setOrders);
  }, []);

  // Edit form state
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    department: user?.department || '',
  });

  if (!user) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-[#FFF7F0] flex items-center justify-center text-[#F47721] mb-4">
            <Shield size={32} />
          </div>
          <h2 className="text-xl font-bold text-[#252525] mb-2">Sign In Required</h2>
          <p className="text-sm text-[#777777] mb-6">
            Please sign in with your college account to view and manage your cafeteria profile.
          </p>
          <Button size="lg" onClick={() => router.push('/login')}>
            Sign In Now
          </Button>
        </div>
      </AppShell>
    );
  }

  const handleLogout = () => {
    logout();
    showToast('Signed out successfully', 'info');
    router.push('/');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await authService.updateProfile(user.id, form);
      updateUser(form);
      setEditOpen(false);
      showToast('Profile updated!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to save', 'error');
    } finally {
      setSaving(false);
    }
  };

  const menuGroups = [
    [
      { href: '/orders', label: 'My Order History', icon: ShoppingBag },
    ],
    [
      { href: '#', label: 'Cafeteria Notifications & Settings', icon: Settings, onClick: () => {} },
      { label: 'Sign Out of Account', icon: LogOut, danger: true, onClick: handleLogout },
    ],
  ];

  return (
    <AppShell>
      <div className="py-4 sm:py-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-[#EEEEEE] pb-4 mb-6">
          <Link
            href="/home"
            className="p-2 -ml-2 rounded-xl text-[#777777] hover:text-[#252525] hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-[#252525]">User Profile</h1>
            <p className="text-sm text-[#777777]">College of Engineering Vadakara Cafeteria</p>
          </div>
        </div>

        {/* Responsive Grid on Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Left Column: Profile Card */}
          <div className="md:col-span-1 bg-white border border-[#EEEEEE] rounded-2xl p-5 shadow-xs text-center">
            <ProfileHeader
              name={user.name}
              email={user.email}
              role={user.role}
            />

            {/* Profile details */}
            <div className="mt-4 pt-4 border-t border-[#EEEEEE] text-left space-y-2.5 text-xs text-[#777777]">
              <div className="flex items-center gap-2.5">
                <Mail size={15} className="text-[#F47721] flex-shrink-0" />
                <span className="truncate">{user.email}</span>
              </div>
              {user.phone && (
                <div className="flex items-center gap-2.5">
                  <Phone size={15} className="text-[#F47721] flex-shrink-0" />
                  <span>{user.phone}</span>
                </div>
              )}
              {user.department && user.role !== 'guest' && (
                <div className="flex items-center gap-2.5">
                  <Building2 size={15} className="text-[#F47721] flex-shrink-0" />
                  <span>Dept: {user.department}</span>
                </div>
              )}
              {user.teacherId && user.role === 'faculty' && (
                <div className="flex items-center gap-2.5">
                  <BadgeCheck size={15} className="text-[#F47721] flex-shrink-0" />
                  <span>Teacher ID: <strong>{user.teacherId}</strong></span>
                </div>
              )}
            </div>

            <div className="mt-5">
              <Button
                variant="outline"
                fullWidth
                size="sm"
                onClick={() => {
                  setForm({
                    name: user.name,
                    phone: user.phone || '',
                    department: user.department || '',
                  });
                  setEditOpen(true);
                }}
              >
                <Pencil size={14} className="mr-1.5" />
                Edit Profile
              </Button>
            </div>
          </div>

          {/* Right Column: QR Takeaway Pass, Menu Options & Settings */}
          <div className="md:col-span-2 space-y-5">
            {/* Takeaway QR Code & Order Save Component */}
            <TakeawayQRPass orders={orders} />

            {menuGroups.map((group, i) => (
              <ProfileMenuGroup key={i} items={group} />
            ))}

            <div className="bg-[#FFF7F0] border border-[#EEEEEE] rounded-2xl p-4 text-xs text-[#777777] flex items-center justify-between">
              <div>
                <strong className="block text-[#252525] font-semibold">Campus Dining Account</strong>
                College of Engineering Vadakara · CEV Cafeteria
              </div>
              <span className="text-[11px] font-bold text-[#F47721] px-2.5 py-1 bg-white rounded-lg border border-[#F47721]/30">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Profile">
        <div className="space-y-4">
          <Input
            label="Full Name"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            required
          />
          <Input
            label="Phone Number"
            value={form.phone}
            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            type="tel"
            placeholder="10-digit number"
          />
          {user.role !== 'guest' && (
            <Input
              label="Department"
              value={form.department}
              onChange={e => setForm(f => ({ ...f, department: e.target.value }))}
              placeholder="e.g. Computer Science"
            />
          )}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" fullWidth onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button fullWidth loading={saving} onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
    </AppShell>
  );
}

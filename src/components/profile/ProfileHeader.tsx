import { User, GraduationCap, BookOpen, Users } from 'lucide-react';
import { UserRole } from '@/lib/types/auth';

interface ProfileHeaderProps {
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

const roleConfig: Record<UserRole, { label: string; color: string; Icon: React.ElementType }> = {
  student: {
    label: 'Student',
    color: 'bg-blue-50 text-blue-700',
    Icon: GraduationCap,
  },
  faculty: {
    label: 'Faculty',
    color: 'bg-purple-50 text-purple-700',
    Icon: BookOpen,
  },
  guest: {
    label: 'Guest',
    color: 'bg-[#FFF7F0] text-[#F47721]',
    Icon: Users,
  },
};

export function ProfileHeader({ name, email, role, avatar }: ProfileHeaderProps) {
  const config = roleConfig[role];
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="flex flex-col items-center pt-6 pb-4">
      {/* Avatar */}
      <div className="w-20 h-20 rounded-full bg-[#F47721] flex items-center justify-center mb-3 shadow-sm">
        <span className="text-white text-2xl font-bold">{initials}</span>
      </div>

      <h2 className="text-lg font-bold text-[#252525]">{name}</h2>
      <p className="text-sm text-[#777777] mt-0.5">{email}</p>

      {/* Role badge */}
      <span className={`mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}>
        <config.Icon size={12} />
        {config.label}
      </span>
    </div>
  );
}


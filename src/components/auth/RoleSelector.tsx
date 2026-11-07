'use client';

import { UserRole } from '@/lib/types/auth';
import { GraduationCap, BookOpen, Users, LucideIcon } from 'lucide-react';

interface RoleSelectorProps {
  selected: UserRole;
  onChange: (role: UserRole) => void;
}

const roles: { id: UserRole; label: string; icon: LucideIcon; desc: string }[] = [
  { id: 'student', label: 'Student', icon: GraduationCap, desc: 'Currently enrolled' },
  { id: 'faculty', label: 'Faculty', icon: BookOpen, desc: 'Teaching staff' },
  { id: 'guest', label: 'Guest', icon: Users, desc: 'Campus visitor' },
];

export function RoleSelector({ selected, onChange }: RoleSelectorProps) {
  return (
    <div>
      <p className="text-xs font-medium text-[#777777] mb-2">I am a</p>
      <div className="grid grid-cols-3 gap-2">
        {roles.map(role => {
          const IconComponent = role.icon;
          const isSelected = selected === role.id;
          return (
            <button
              key={role.id}
              type="button"
              onClick={() => onChange(role.id)}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-center transition-all active:scale-95
                ${isSelected
                  ? 'border-[#F47721] bg-[#FFF7F0]'
                  : 'border-[#EEEEEE] bg-white hover:border-[#F47721]/40'
                }`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors
                ${isSelected ? 'bg-[#F47721] text-white' : 'bg-[#FFF7F0] text-[#777777]'}`}
              >
                <IconComponent size={20} />
              </div>
              <span className={`text-xs font-semibold ${isSelected ? 'text-[#F47721]' : 'text-[#252525]'}`}>
                {role.label}
              </span>
              <span className="text-[10px] text-[#777777]">{role.desc}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

'use client';

import { UserRole } from '@/lib/types/auth';
import { GraduationCap, BookOpen, Users, LucideIcon } from 'lucide-react';

interface RoleSelectorProps {
  selected: UserRole;
  onChange: (role: UserRole) => void;
}

const roles: { id: UserRole; label: string; icon: LucideIcon; desc: string }[] = [
  { id: 'student', label: 'Student', icon: GraduationCap, desc: 'Enrolled' },
  { id: 'faculty', label: 'Faculty', icon: BookOpen, desc: 'Teacher ID' },
  { id: 'guest', label: 'Guest', icon: Users, desc: 'Visitor' },
];

export function RoleSelector({ selected, onChange }: RoleSelectorProps) {
  return (
    <fieldset className="border-0 p-0 m-0">
      <legend className="text-xs font-bold text-[#666666] mb-2 uppercase tracking-wider">
        Select Campus Role
      </legend>
      <div
        role="radiogroup"
        aria-label="Campus Role"
        className="grid grid-cols-3 gap-2 sm:gap-2.5"
      >
        {roles.map(role => {
          const IconComponent = role.icon;
          const isSelected = selected === role.id;
          return (
            <button
              key={role.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChange(role.id)}
              className={`min-h-[52px] flex flex-col items-center gap-1.5 p-2.5 sm:p-3 rounded-2xl border-2 text-center transition-all active:scale-95 cursor-pointer focus-ring
                ${
                  isSelected
                    ? 'border-[#F47721] bg-[#FFF7F0] shadow-xs'
                    : 'border-[#EEEEEE] bg-white hover:border-[#F47721]/30 hover:bg-[#FFF7F0]/50'
                }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors
                ${isSelected ? 'bg-[#F47721] text-white shadow-xs' : 'bg-[#FFF7F0] text-[#666666]'}`}
              >
                <IconComponent size={19} />
              </div>
              <span className={`text-xs font-bold ${isSelected ? 'text-[#F47721]' : 'text-[#252525]'}`}>
                {role.label}
              </span>
              <span className="text-[10px] text-[#666666] font-medium leading-tight">{role.desc}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

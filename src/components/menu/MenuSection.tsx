import { ReactNode } from 'react';

interface MenuSectionProps {
  title: string;
  icon?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
}

export function MenuSection({ title, icon, action, children }: MenuSectionProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base sm:text-lg font-bold text-[#252525] inline-flex items-center gap-2">
          {icon}
          <span>{title}</span>
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

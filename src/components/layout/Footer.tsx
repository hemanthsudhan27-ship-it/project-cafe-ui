interface FooterProps {
  className?: string;
  hasBottomNav?: boolean;
}

export function Footer({ className = '', hasBottomNav = false }: FooterProps) {
  return (
    <footer
      className={`w-full border-t border-[#EEEEEE] bg-[#FFF7F0] py-5 px-4 sm:px-6 lg:px-8 mt-auto ${
        hasBottomNav ? 'pb-24 sm:pb-5' : ''
      } ${className}`}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 text-center sm:text-left">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
          <span className="font-extrabold text-sm text-[#252525] uppercase tracking-wider">
            CAFETERIA
          </span>
          <span className="text-xs text-[#777777]">·</span>
          <span className="text-xs font-medium text-[#777777]">
            College of Engineering Vadakara
          </span>
        </div>

        {/* EXACT MANDATORY ATTRIBUTION */}
        <div className="text-xs sm:text-sm font-semibold text-[#252525]">
          Designed and Developed by IEDC CEV
        </div>
      </div>
    </footer>
  );
}


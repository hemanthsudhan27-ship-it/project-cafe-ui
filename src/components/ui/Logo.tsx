import Image from 'next/image';

interface LogoProps {
  size?: number | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  priority?: boolean;
}

const sizeMap = {
  sm: 28,
  md: 36,
  lg: 48,
  xl: 64,
};

export function Logo({ size = 'md', className = '', priority = false }: LogoProps) {
  const pixelSize = typeof size === 'number' ? size : sizeMap[size];

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: pixelSize, height: pixelSize }}
    >
      <Image
        src="/logo.svg"
        alt="College Cafeteria Logo"
        width={pixelSize}
        height={pixelSize}
        className="w-full h-full object-contain"
        priority={priority}
        unoptimized
      />
    </div>
  );
}


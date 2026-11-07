'use client';

interface GoogleAuthButtonProps {
  onClick: () => void;
  loading?: boolean;
  label?: string;
}

export function GoogleAuthButton({ onClick, loading = false, label = 'Continue with Google' }: GoogleAuthButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-[#EEEEEE] rounded-xl
        text-sm font-medium text-[#252525] hover:bg-gray-50 active:scale-95 transition-all
        disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {/* Google G logo */}
      <svg width="18" height="18" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M47.532 24.552c0-1.636-.146-3.2-.418-4.698H24.48v8.883h13.02c-.561 3.024-2.265 5.588-4.825 7.306v6.07h7.808c4.566-4.207 7.049-10.4 7.049-17.56z" fill="#4285F4"/>
        <path d="M24.48 48c6.54 0 12.027-2.167 16.036-5.887l-7.808-6.07c-2.165 1.452-4.937 2.31-8.228 2.31-6.329 0-11.69-4.274-13.608-10.013H2.782v6.264C6.772 42.618 15.028 48 24.48 48z" fill="#34A853"/>
        <path d="M10.872 28.34A14.46 14.46 0 0 1 10.1 24c0-1.502.258-2.955.772-4.34V13.4H2.782A23.945 23.945 0 0 0 .48 24c0 3.864.924 7.517 2.302 10.6l8.09-6.26z" fill="#FBBC05"/>
        <path d="M24.48 9.647c3.565 0 6.763 1.226 9.279 3.63l6.959-6.959C36.5 2.388 31.016 0 24.48 0 15.028 0 6.772 5.382 2.782 13.4l8.09 6.26c1.918-5.74 7.279-10.013 13.608-10.013z" fill="#EA4335"/>
      </svg>
      {loading ? 'Please wait…' : label}
    </button>
  );
}


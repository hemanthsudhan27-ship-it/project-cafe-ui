'use client';

import { useEffect, ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      {/* Sheet / Modal */}
      <div className="relative w-full sm:max-w-md bg-white sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto">
        {title && (
          <div className="flex items-center justify-between p-4 border-b border-[#EEEEEE]">
            <h3 className="text-base font-semibold text-[#252525]">{title}</h3>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-[#EEEEEE] transition-colors"
            >
              <X size={18} className="text-[#777777]" />
            </button>
          </div>
        )}
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}


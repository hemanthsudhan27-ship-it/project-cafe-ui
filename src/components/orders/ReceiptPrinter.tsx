'use client';

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { CheckCircle2, Loader2, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { Order } from '@/lib/types/order';

export type ReceiptPrinterStage = 'processing' | 'printing' | 'complete';
export type ReceiptFeedMotion = 'smooth' | 'stepped';

export interface ReceiptPrinterProps {
  order: Order;
  onComplete?: () => void;
}

type ReceiptPrinterContextValue = {
  animate: boolean;
  feedMotion: ReceiptFeedMotion;
  shouldMove: boolean;
  stage: ReceiptPrinterStage;
};

const ReceiptPrinterContext = createContext<ReceiptPrinterContextValue | null>(null);

const easeOut = [0.23, 1, 0.32, 1] as const;
const easeInOut = [0.77, 0, 0.175, 1] as const;

// Serrated zig-zag edge for receipt bottom
const receiptToothCount = 36;
const receiptToothDepth = 5;
const receiptToothPoints = Array.from({ length: receiptToothCount * 2 }, (_, index) => {
  const x = 100 - ((index + 1) * 100) / (receiptToothCount * 2);
  const y = index % 2 === 0 ? '100%' : `calc(100% - ${receiptToothDepth}px)`;
  return `${x}% ${y}`;
}).join(', ');
const receiptClipPath = `polygon(0 0, 100% 0, 100% calc(100% - ${receiptToothDepth}px), ${receiptToothPoints})`;

const printingTransformKeyframes = [
  'translateY(calc(-100% + 2px))',
  'translateY(-88%)',
  'translateY(-88%)',
  'translateY(-72%)',
  'translateY(-72%)',
  'translateY(-55%)',
  'translateY(-55%)',
  'translateY(-38%)',
  'translateY(-38%)',
  'translateY(-22%)',
  'translateY(-22%)',
  'translateY(-8%)',
  'translateY(-8%)',
  'translateY(0%)',
];

const printingKeyframeTimes = [
  0, 0.08, 0.12, 0.22, 0.26, 0.40, 0.44, 0.58, 0.62, 0.76, 0.80, 0.92, 0.95, 1,
];

function useReceiptPrinter(component: string) {
  const context = useContext(ReceiptPrinterContext);
  if (!context) {
    throw new Error(`${component} must be used inside ReceiptPrinterRoot.`);
  }
  return context;
}

function ReceiptPrinterRoot({
  stage,
  animate = true,
  feedMotion = 'stepped',
  children,
  className = '',
}: {
  stage: ReceiptPrinterStage;
  animate?: boolean;
  feedMotion?: ReceiptFeedMotion;
  children: ReactNode;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();
  const context = {
    animate,
    feedMotion,
    shouldMove: animate && !shouldReduceMotion,
    stage,
  };

  return (
    <ReceiptPrinterContext.Provider value={context}>
      <section
        aria-label="Campus Cafeteria Receipt Printer"
        className={`relative isolate flex w-full max-w-sm flex-col items-center mx-auto ${className}`}
      >
        {children}
      </section>
    </ReceiptPrinterContext.Provider>
  );
}

function ReceiptPrinterMachine({ children }: { children: ReactNode }) {
  return (
    <div className="relative isolate w-full overflow-hidden rounded-3xl border border-[#252525] bg-gradient-to-b from-[#2e2e2e] to-[#1a1a1a] p-3.5 pb-7 shadow-2xl shadow-black/25">
      {children}
      {/* Printer slot */}
      <div
        aria-hidden="true"
        className="absolute inset-x-8 bottom-3 z-40 h-2 rounded-full border border-black/80 bg-black shadow-inner"
      />
    </div>
  );
}

function ReceiptPrinterScreen({ children }: { children: ReactNode }) {
  return (
    <div className="relative z-10 isolate overflow-hidden rounded-2xl border border-white/10 bg-[#121212] p-3 text-white shadow-inner">
      <div className="relative z-10">{children}</div>
    </div>
  );
}

function ReceiptPrinterStatus({ orderId }: { orderId: string }) {
  const { stage } = useReceiptPrinter('ReceiptPrinterStatus');
  const isComplete = stage === 'complete';

  const labels: Record<ReceiptPrinterStage, string> = {
    processing: 'Verifying Token & Kitchen…',
    printing: 'Printing Takeaway Token…',
    complete: 'Takeaway Receipt Ready!',
  };

  return (
    <div className="flex items-center justify-between text-xs font-mono">
      <div className="flex items-center gap-2">
        <span className="relative grid size-4 place-items-center">
          <AnimatePresence initial={false} mode="sync">
            {isComplete ? (
              <motion.span
                key="done"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-[#269B62]"
              >
                <CheckCircle2 size={16} />
              </motion.span>
            ) : (
              <motion.span
                key="spin"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-[#F47721]"
              >
                <Loader2 size={15} className="animate-spin" />
              </motion.span>
            )}
          </AnimatePresence>
        </span>
        <span className="text-gray-300 font-sans font-medium text-xs">
          {labels[stage]}
        </span>
      </div>

      <span className="text-[10px] text-[#F47721] bg-[#F47721]/15 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
        #{orderId.slice(-4).toUpperCase()}
      </span>
    </div>
  );
}

function ReceiptPrinterOutput({ children }: { children: ReactNode }) {
  const { stage, feedMotion, shouldMove, animate } = useReceiptPrinter('ReceiptPrinterOutput');
  const isReceiptVisible = stage !== 'processing';
  const shouldUseSteppedFeed = feedMotion === 'stepped' && stage === 'printing' && shouldMove;

  return (
    <div className="relative z-50 -mt-3 w-full overflow-hidden px-4">
      {/* Paper exit gradient shadow */}
      {isReceiptVisible && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-4 top-0 z-20 h-3 bg-gradient-to-b from-black/60 to-transparent blur-xs"
        />
      )}

      <motion.div
        initial={false}
        animate={{
          opacity: isReceiptVisible ? 1 : 0,
          transform:
            stage === 'printing' && shouldMove
              ? shouldUseSteppedFeed
                ? printingTransformKeyframes
                : 'translateY(0%)'
              : isReceiptVisible || !shouldMove
              ? 'translateY(0%)'
              : 'translateY(calc(-100% + 2px))',
        }}
        transition={{
          opacity: { duration: animate ? 0.18 : 0, ease: easeOut },
          transform: {
            duration: shouldMove ? 2.4 : 0,
            ease: shouldUseSteppedFeed ? 'linear' : easeInOut,
            times: shouldUseSteppedFeed ? printingKeyframeTimes : undefined,
          },
        }}
        className="relative drop-shadow-xl"
      >
        {children}
      </motion.div>
    </div>
  );
}

function ThermalReceiptPaper({ order }: { order: Order }) {
  const serviceCharge = order.serviceCharge ?? Math.round(order.subtotal * 0.05);
  const grandTotal = order.total ?? (order.subtotal + serviceCharge);

  return (
    <article
      style={{ clipPath: receiptClipPath }}
      className="relative z-10 bg-[#FAFAFA] border-x border-t border-[#E5E5E5] px-6 pt-6 pb-9 font-mono text-[#252525] shadow-sm select-none"
    >
      {/* Header */}
      <div className="text-center pb-3 border-b border-dashed border-gray-300">
        <span className="text-[10px] font-bold text-[#F47721] tracking-widest uppercase block font-sans">
          College of Engineering Vadakara
        </span>
        <h3 className="text-base font-extrabold tracking-wider text-[#252525] uppercase mt-0.5 font-sans">
          CAFETERIA
        </h3>
        <p className="text-[10px] text-gray-500 mt-0.5">Takeaway Pickup Receipt</p>
      </div>

      {/* Token & Status */}
      <div className="flex justify-between items-center py-2 text-xs border-b border-dashed border-gray-300">
        <div>
          <span className="text-[10px] text-gray-500 block uppercase">Order Token</span>
          <span className="font-bold text-sm text-[#F47721]">
            #{order.id.slice(0, 8).toUpperCase()}
          </span>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-gray-500 block uppercase">Payment</span>
          <span className={`font-bold text-[11px] uppercase ${order.paymentStatus === 'paid' ? 'text-[#269B62]' : 'text-[#F47721]'}`}>
            {order.paymentStatus === 'paid' ? 'PAID ONLINE (UPI)' : 'PAY AT COUNTER'}
          </span>
        </div>
      </div>

      {/* Item Summary */}
      <div className="py-2.5 space-y-1 text-xs border-b border-dashed border-gray-300">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center text-[11px]">
            <span className="truncate max-w-[170px]">
              {item.quantity}× {item.menuItem.name}
            </span>
            <span className="font-medium text-gray-700">
              {formatCurrency(item.menuItem.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      {/* Bill Amount Breakdown */}
      <div className="py-2.5 space-y-1 border-b border-dashed border-gray-300 text-xs">
        <div className="flex justify-between text-gray-500 text-[11px]">
          <span>Subtotal</span>
          <span>{formatCurrency(order.subtotal)}</span>
        </div>
        <div className="flex justify-between text-gray-500 text-[11px]">
          <span>Service Charge (5%)</span>
          <span>{formatCurrency(serviceCharge)}</span>
        </div>
        <div className="flex justify-between font-extrabold text-sm text-[#252525] pt-1 border-t border-gray-200">
          <span>Total Amount</span>
          <span className="text-[#F47721]">{formatCurrency(grandTotal)}</span>
        </div>
      </div>

      {/* Takeaway QR Code Box */}
      <div className="pt-4 pb-2 text-center flex flex-col items-center">
        <div className="p-2.5 bg-white border border-gray-300 rounded-xl shadow-xs inline-block">
          <QRCodeSVG
            value={JSON.stringify({
              app: 'CEV-CAFETERIA',
              token: order.id,
              total: grandTotal,
            })}
            size={110}
            level="H"
            includeMargin={false}
            fgColor="#252525"
          />
        </div>
        <span className="text-[9px] font-bold text-[#F47721] mt-1.5 font-sans uppercase tracking-wider block">
          SCAN AT DELIVERY COUNTER
        </span>
        <p className="text-[10px] text-gray-500 mt-1 font-sans leading-tight max-w-[210px]">
          Show this QR token to collect your takeaway order.
        </p>
      </div>

      {/* Footer stamp */}
      <div className="text-center pt-2.5 border-t border-dashed border-gray-300 text-[9px] text-gray-400 font-sans">
        Designed & Developed by IEDC CEV
      </div>
    </article>
  );
}

export function ReceiptPrinterAnimation({ order, onComplete }: ReceiptPrinterProps) {
  const [stage, setStage] = useState<ReceiptPrinterStage>('processing');

  useEffect(() => {
    // Stage 1: Processing verification (900ms)
    const t1 = setTimeout(() => {
      setStage('printing');
    }, 900);

    // Stage 2: Mechanical printing duration (2.4s) -> Completed
    const t2 = setTimeout(() => {
      setStage('complete');
      onComplete?.();
    }, 3300);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onComplete]);

  return (
    <ReceiptPrinterRoot stage={stage} feedMotion="stepped">
      <ReceiptPrinterMachine>
        <ReceiptPrinterScreen>
          <ReceiptPrinterStatus orderId={order.id} />
        </ReceiptPrinterScreen>
      </ReceiptPrinterMachine>

      <ReceiptPrinterOutput>
        <ThermalReceiptPaper order={order} />
      </ReceiptPrinterOutput>
    </ReceiptPrinterRoot>
  );
}

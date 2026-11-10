'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircle,
  Clock,
  ArrowLeft,
  ShieldCheck,
  CreditCard,
  QrCode,
  Smartphone,
  Banknote,
  Lock,
  Loader2,
  Check,
  X,
  Sparkles,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { CartItemRow } from '@/components/cart/CartItem';
import { CartSummary } from '@/components/cart/CartSummary';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/components/ui/Toast';
import { orderService } from '@/lib/services/orderService';
import { Order, PaymentMethod } from '@/lib/types/order';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { ReceiptPrinterAnimation } from '@/components/orders/ReceiptPrinter';

export default function CheckoutPage() {
  const { items, subtotal, clearCart, itemCount } = useCart();
  const { showToast } = useToast();
  const router = useRouter();

  const [note, setNote] = useState('');
  const [placing, setPlacing] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);

  // Payment method selection: 'online_upi' (default/recommended) vs 'pay_at_counter'
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('online_upi');

  // Online Payment Gateway Modal state
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'other'>('gpay');
  const [upiId, setUpiId] = useState('');
  const [paymentStage, setPaymentStage] = useState<'select' | 'processing' | 'success'>('select');

  if (itemCount === 0 && !order) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-[#FFF7F0] flex items-center justify-center text-[#F47721] mb-4">
            <CreditCard size={32} />
          </div>
          <h2 className="text-xl font-bold text-[#252525] mb-2">Nothing to Checkout</h2>
          <p className="text-sm text-[#777777] mb-6 max-w-sm">
            Your cart is currently empty. Add dishes from the menu to proceed with your order.
          </p>
          <Link href="/menu">
            <Button size="lg">Browse Menu</Button>
          </Link>
        </div>
      </AppShell>
    );
  }

  const serviceCharge = Math.round(subtotal * 0.05);
  const grandTotal = subtotal + serviceCharge;

  // Handle direct cash order or opening the Pay Now modal
  const handleInitiateOrder = () => {
    if (paymentMethod === 'online_upi') {
      setPaymentStage('select');
      setPayModalOpen(true);
    } else {
      executeOrderPlacement('pay_at_counter');
    }
  };

  const executeOrderPlacement = async (method: PaymentMethod) => {
    setPlacing(true);
    try {
      const placed = await orderService.placeOrder(items, note || undefined, method);
      setOrder(placed);
      clearCart();
      if (method === 'online_upi') {
        showToast('Payment successful! Printing takeaway receipt…', 'success');
      } else {
        showToast('Order confirmed! Pay cash at the counter.', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to place order', 'error');
    } finally {
      setPlacing(false);
    }
  };

  // Simulates online authorization through the selected UPI app
  const handleAuthorizeOnlinePay = async () => {
    setPaymentStage('processing');
    try {
      // Realistic gateway simulation
      await new Promise(resolve => setTimeout(resolve, 1400));
      setPaymentStage('success');
      await new Promise(resolve => setTimeout(resolve, 600));

      setPayModalOpen(false);
      await executeOrderPlacement('online_upi');
    } catch (err: any) {
      setPaymentStage('select');
      showToast('Payment authorization failed. Please try again.', 'error');
    }
  };

  if (order) {
    return (
      <AppShell hideNav>
        <OrderConfirmation order={order} />
      </AppShell>
    );
  }

  return (
    <AppShell hideNav>
      <div className="py-4 sm:py-6 pb-36 sm:pb-8">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-[#EEEEEE] pb-4 mb-6">
          <Link
            href="/cart"
            className="p-2 -ml-2 rounded-xl text-[#666666] hover:text-[#252525] hover:bg-gray-50 transition-colors focus-ring"
            aria-label="Back to Cart"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#252525]">Checkout & Payment</h1>
            <p className="text-xs sm:text-sm text-[#666666]">
              Pay online for instant takeaway token or choose pay at counter
            </p>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
          {/* Left Column: Items, Notes & Payment Method */}
          <div className="lg:col-span-2 space-y-5">
            {/* Payment Method Selector */}
            <div className="bg-white border-2 border-[#F47721]/30 rounded-2xl p-4 sm:p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#FFF7F0] flex items-center justify-center text-[#F47721]">
                    <CreditCard size={16} />
                  </div>
                  <h2 className="text-sm sm:text-base font-extrabold text-[#252525]">
                    Payment Mode
                  </h2>
                </div>
                <span className="text-[11px] font-bold text-[#269B62] bg-green-50 border border-green-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles size={11} /> 100% Secure
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Option 1: Online Pay (UPI) - Recommended */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('online_upi')}
                  className={`text-left p-3.5 rounded-xl border-2 transition-all relative flex flex-col justify-between ${
                    paymentMethod === 'online_upi'
                      ? 'border-[#F47721] bg-[#FFF7F0]/60 ring-2 ring-[#F47721]/20 shadow-xs'
                      : 'border-[#EEEEEE] bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                          paymentMethod === 'online_upi'
                            ? 'bg-[#F47721] text-white'
                            : 'bg-gray-100 text-[#666666]'
                        }`}
                      >
                        <Smartphone size={18} />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-sm text-[#252525]">Online Pay (UPI)</span>
                          <span className="text-[9px] font-extrabold bg-[#F47721] text-white px-1.5 py-0.2 rounded uppercase">
                            Fast
                          </span>
                        </div>
                        <p className="text-[11px] text-[#666666]">GPay · PhonePe · Paytm · UPI</p>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                        paymentMethod === 'online_upi'
                          ? 'border-[#F47721] bg-[#F47721]'
                          : 'border-gray-300'
                      }`}
                    >
                      {paymentMethod === 'online_upi' && <Check size={12} className="text-white" />}
                    </div>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-dashed border-[#EEEEEE] text-[10px] text-[#269B62] font-semibold flex items-center gap-1">
                    <QrCode size={12} /> Instant Takeaway QR Receipt Printed Immediately
                  </div>
                </button>

                {/* Option 2: Pay at Counter (Cash) */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('pay_at_counter')}
                  className={`text-left p-3.5 rounded-xl border-2 transition-all relative flex flex-col justify-between ${
                    paymentMethod === 'pay_at_counter'
                      ? 'border-[#F47721] bg-[#FFF7F0]/60 ring-2 ring-[#F47721]/20 shadow-xs'
                      : 'border-[#EEEEEE] bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                          paymentMethod === 'pay_at_counter'
                            ? 'bg-[#F47721] text-white'
                            : 'bg-gray-100 text-[#666666]'
                        }`}
                      >
                        <Banknote size={18} />
                      </div>
                      <div>
                        <span className="font-bold text-sm text-[#252525] block">Pay at Counter</span>
                        <p className="text-[11px] text-[#666666]">Cash or Counter Card</p>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                        paymentMethod === 'pay_at_counter'
                          ? 'border-[#F47721] bg-[#F47721]'
                          : 'border-gray-300'
                      }`}
                    >
                      {paymentMethod === 'pay_at_counter' && <Check size={12} className="text-white" />}
                    </div>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-dashed border-[#EEEEEE] text-[10px] text-[#666666]">
                    Pay cash at window before picking up your food
                  </div>
                </button>
              </div>
            </div>

            {/* Order Items Card */}
            <div className="bg-white border border-[#EEEEEE] rounded-2xl p-4 sm:p-5 shadow-xs">
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#666666] mb-3">
                Order Items ({items.length})
              </h2>
              <div className="divide-y divide-[#EEEEEE]">
                {items.map(item => (
                  <CartItemRow key={item.menuItem.id} item={item} />
                ))}
              </div>
            </div>

            {/* Special Instructions */}
            <div className="bg-white border border-[#EEEEEE] rounded-2xl p-4 sm:p-5 shadow-xs">
              <label htmlFor="kitchen-notes" className="block text-sm font-bold text-[#252525] mb-1.5">
                Kitchen Instructions <span className="text-[#666666] font-normal text-xs">(optional)</span>
              </label>
              <textarea
                id="kitchen-notes"
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="e.g. Less spicy, keep sambar separate, extra spoon…"
                rows={3}
                className="w-full px-4 py-3 text-sm border border-[#EEEEEE] rounded-xl resize-none
                  focus:outline-none focus:border-[#F47721] focus:ring-2 focus:ring-[#F47721]/20
                  placeholder:text-[#888888] text-[#252525] bg-[#FFF7F0]/30 transition-all"
              />
            </div>
          </div>

          {/* Right Column: Billing & Prominent "Pay Now" CTA */}
          <div className="lg:col-span-1 lg:sticky lg:top-20 space-y-4">
            <CartSummary subtotal={subtotal} />

            {/* Dynamic Payment Banner */}
            {paymentMethod === 'online_upi' ? (
              <div className="bg-[#FFF7F0] border border-[#F47721]/30 rounded-2xl p-4 text-xs text-[#252525] flex items-start gap-3">
                <ShieldCheck size={20} className="text-[#F47721] shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold text-[#F47721] mb-0.5">
                    Online Payment Active
                  </strong>
                  Clicking <strong>Pay Now</strong> authorizes payment via UPI. Your takeaway receipt with QR code will print out immediately.
                </div>
              </div>
            ) : (
              <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-3">
                <Banknote size={20} className="text-amber-800 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold mb-0.5">Pay at Counter</strong>
                  Present your order token at the cash counter to complete payment upon receiving your order.
                </div>
              </div>
            )}

            {/* Primary Confirmation / Pay Now CTA (Always visible inline on mobile & desktop) */}
            <div className="pt-2">
              <Button
                fullWidth
                size="lg"
                loading={placing}
                onClick={handleInitiateOrder}
                className="shadow-lg shadow-[#F47721]/25 text-base sm:text-lg font-black py-4 flex items-center justify-center gap-2.5 active:scale-[0.98] transition-all"
              >
                {paymentMethod === 'online_upi' ? (
                  <>
                    <CreditCard size={20} />
                    <span>Pay Now · {formatCurrency(grandTotal)}</span>
                  </>
                ) : (
                  <>
                    <Banknote size={20} />
                    <span>Place Order (Pay Cash) · {formatCurrency(grandTotal)}</span>
                  </>
                )}
              </Button>
            </div>

            <div className="flex items-center justify-center gap-2 text-[11px] text-[#777777] pt-1">
              <Lock size={12} className="text-[#269B62]" />
              <span>256-bit SSL encrypted cafeteria checkout</span>
            </div>
          </div>
        </div>

        {/* Mobile Sticky Floating Order Confirmation Bar (Priority P0, elevated z-50 above everything) */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-[#EEEEEE] p-3.5 px-4 shadow-[0_-4px_20px_rgba(0,0,0,0.12)] sm:hidden flex items-center justify-between gap-3 pb-[calc(0.875rem+env(safe-area-inset-bottom,0px))]">
          <div>
            <span className="text-[10px] font-bold text-[#666666] uppercase tracking-wider block leading-tight">
              Total to Pay
            </span>
            <span className="text-base font-black text-[#F47721] leading-tight">
              {formatCurrency(grandTotal)}
            </span>
          </div>

          <Button
            size="md"
            loading={placing}
            onClick={handleInitiateOrder}
            className="flex-1 max-w-[220px] shadow-md shadow-[#F47721]/25 font-black text-xs py-3 flex items-center justify-center gap-1.5 active:scale-95"
          >
            {paymentMethod === 'online_upi' ? (
              <>
                <CreditCard size={15} />
                <span>Pay Now ({formatCurrency(grandTotal)})</span>
              </>
            ) : (
              <>Confirm Order</>
            )}
          </Button>
        </div>
      </div>

      {/* Online Payment (UPI) Gateway Modal */}
      {payModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-gray-100 overflow-hidden relative">
            {/* Modal Header */}
            <div className="bg-linear-to-r from-[#F47721] to-[#E0630D] p-5 text-white relative">
              <button
                onClick={() => paymentStage !== 'processing' && setPayModalOpen(false)}
                disabled={paymentStage === 'processing'}
                className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors disabled:opacity-40"
                aria-label="Close"
              >
                <X size={20} />
              </button>

              <span className="text-[10px] font-bold uppercase tracking-widest text-white/80 block">
                College of Engineering Vadakara
              </span>
              <h2 className="text-lg font-black mt-0.5">Cafeteria Online Pay</h2>
              <p className="text-xs text-white/90 mt-0.5">Instant Takeaway Billed via UPI</p>

              <div className="mt-4 bg-white/15 backdrop-blur-xs rounded-xl p-3 flex justify-between items-center border border-white/20">
                <span className="text-xs font-semibold text-white/90">Amount Payable:</span>
                <span className="text-xl font-black text-white">{formatCurrency(grandTotal)}</span>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              {paymentStage === 'select' && (
                <>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#666666] mb-2">
                      Choose Your UPI App
                    </label>

                    <div className="grid grid-cols-3 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setSelectedUpiApp('gpay')}
                        className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1.5 transition-all ${
                          selectedUpiApp === 'gpay'
                            ? 'border-[#F47721] bg-[#FFF7F0] ring-2 ring-[#F47721]/20'
                            : 'border-[#EEEEEE] hover:border-gray-300'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 font-black text-xs flex items-center justify-center">
                          G
                        </div>
                        <span className="text-xs font-bold text-[#252525]">Google Pay</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedUpiApp('phonepe')}
                        className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1.5 transition-all ${
                          selectedUpiApp === 'phonepe'
                            ? 'border-[#F47721] bg-[#FFF7F0] ring-2 ring-[#F47721]/20'
                            : 'border-[#EEEEEE] hover:border-gray-300'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 font-black text-xs flex items-center justify-center">
                          Pe
                        </div>
                        <span className="text-xs font-bold text-[#252525]">PhonePe</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedUpiApp('paytm')}
                        className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1.5 transition-all ${
                          selectedUpiApp === 'paytm'
                            ? 'border-[#F47721] bg-[#FFF7F0] ring-2 ring-[#F47721]/20'
                            : 'border-[#EEEEEE] hover:border-gray-300'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-full bg-sky-50 text-sky-600 font-black text-xs flex items-center justify-center">
                          Pt
                        </div>
                        <span className="text-xs font-bold text-[#252525]">Paytm</span>
                      </button>
                    </div>
                  </div>

                  {/* UPI ID input */}
                  <div>
                    <label className="block text-xs font-bold text-[#252525] mb-1">
                      Or Enter Student UPI ID
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={e => setUpiId(e.target.value)}
                      placeholder="e.g. rollno@okhdfcbank or 9876543210@paytm"
                      className="w-full px-3.5 py-2.5 text-xs border border-[#EEEEEE] rounded-xl focus:outline-none focus:border-[#F47721] focus:ring-2 focus:ring-[#F47721]/20 text-[#252525] bg-gray-50/50"
                    />
                  </div>

                  {/* Authorization Button */}
                  <Button
                    size="lg"
                    fullWidth
                    onClick={handleAuthorizeOnlinePay}
                    className="shadow-md shadow-[#F47721]/25 text-sm font-black py-3.5 flex items-center justify-center gap-2"
                  >
                    <ShieldCheck size={18} />
                    Authorize & Pay {formatCurrency(grandTotal)}
                  </Button>

                  <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-500 pt-1">
                    <Lock size={11} className="text-[#269B62]" />
                    <span>Verified Cafeteria Merchant: <strong>IEDC CEV Food Services</strong></span>
                  </div>
                </>
              )}

              {paymentStage === 'processing' && (
                <div className="py-8 text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-[#FFF7F0] border-2 border-[#F47721]/30 flex items-center justify-center mx-auto text-[#F47721] animate-spin">
                    <Loader2 size={28} />
                  </div>
                  <h3 className="text-base font-bold text-[#252525]">
                    Contacting UPI Gateway…
                  </h3>
                  <p className="text-xs text-[#777777] max-w-xs mx-auto">
                    Approving student payment with bank. Please do not close or refresh this window.
                  </p>
                </div>
              )}

              {paymentStage === 'success' && (
                <div className="py-8 text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center mx-auto text-[#269B62]">
                    <CheckCircle size={32} />
                  </div>
                  <h3 className="text-base font-black text-[#269B62]">
                    Payment Approved!
                  </h3>
                  <p className="text-xs text-[#777777]">
                    Transaction Ref: CEV-UPI-{Math.floor(100000 + Math.random() * 900000)}
                  </p>
                  <p className="text-xs font-semibold text-[#F47721]">
                    Printing your takeaway receipt…
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}

function OrderConfirmation({ order }: { order: Order }) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(25);
  const [printDone, setPrintDone] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          clearInterval(interval);
          router.push('/orders');
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [router]);

  const isPaid = order.paymentStatus === 'paid';

  return (
    <div className="max-w-xl mx-auto py-8 px-4 text-center">
      <div className="w-14 h-14 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center mx-auto mb-3 text-[#269B62]">
        <CheckCircle size={32} />
      </div>

      <div className="flex items-center justify-center gap-1.5 mb-2">
        <span
          className={`inline-block px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
            isPaid
              ? 'bg-green-100 text-[#269B62] border border-green-200'
              : 'bg-amber-100 text-amber-800 border border-amber-200'
          }`}
        >
          {isPaid ? 'PAID ONLINE (UPI) · ORDER BILLED' : 'ORDER PLACED · PAY CASH AT COUNTER'}
        </span>
      </div>

      <h1 className="text-xl sm:text-2xl font-black text-[#252525]">
        {isPaid ? 'Payment Confirmed & Order Billed!' : 'Order Placed Successfully!'}
      </h1>
      <p className="text-xs sm:text-sm text-[#777777] mt-1 max-w-md mx-auto">
        Your order has been queued in the cafeteria kitchen. Your thermal takeaway receipt is printing below.
      </p>

      {/* ── Animated POS Thermal Receipt Printing Machine ──────────────────────────── */}
      <div className="my-6">
        <ReceiptPrinterAnimation
          order={order}
          onComplete={() => setPrintDone(true)}
        />
      </div>

      {/* Order Status & Wait Info */}
      <div className="bg-[#FFF7F0] border border-[#F47721]/20 rounded-2xl p-4 text-center max-w-sm mx-auto space-y-3 shadow-xs">
        <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-[#252525] font-semibold bg-white rounded-xl py-2 px-3 border border-[#EEEEEE]">
          <Clock size={16} className="text-[#F47721]" />
          <span>
            Estimated kitchen wait: <strong>{order.estimatedTime} minutes</strong>
          </span>
        </div>

        <div className="flex justify-between items-center text-xs text-[#777777] pt-1">
          <span>
            Token: <strong className="text-[#F47721]">#{order.id.slice(0, 8).toUpperCase()}</strong>
          </span>
          <span>
            Billed:{' '}
            <strong className="text-[#252525]">{formatCurrency(order.total)}</strong>
          </span>
        </div>
      </div>

      <p className="text-xs text-[#777777] mt-5">
        Redirecting to orders page in <strong>{countdown} seconds</strong>…
      </p>

      <div className="mt-4 flex flex-col sm:flex-row gap-2.5 justify-center max-w-sm mx-auto">
        <Link href={`/orders/${order.id}`} className="flex-1">
          <Button size="md" fullWidth>
            Track Order Live
          </Button>
        </Link>
        <Link href="/home" className="flex-1">
          <Button variant="outline" size="md" fullWidth>
            Cafeteria Home
          </Button>
        </Link>
      </div>
    </div>
  );
}

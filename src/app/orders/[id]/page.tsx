'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  Clock,
  AlertCircle,
  CheckCircle2,
  QrCode,
  CreditCard,
  ShieldCheck,
  Check,
  X,
  Loader2,
  Smartphone,
  Printer,
  Sparkles,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge';
import { PageSpinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { orderService } from '@/lib/services/orderService';
import { Order } from '@/lib/types/order';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { useToast } from '@/components/ui/Toast';
import { ReceiptPrinterAnimation } from '@/components/orders/ReceiptPrinter';

function OrderDetailContent() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  // Online Pay Now Modal state
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'other'>('gpay');
  const [upiId, setUpiId] = useState('');
  const [paymentStage, setPaymentStage] = useState<'select' | 'processing' | 'success'>('select');

  // Thermal Receipt Printer view state
  const [showReceiptAnimation, setShowReceiptAnimation] = useState(false);

  const orderId = params.id as string;

  useEffect(() => {
    orderService.getOrder(orderId)
      .then(setOrder)
      .catch(() => router.push('/orders'))
      .finally(() => setLoading(false));
  }, [orderId, router]);

  if (loading) return <PageSpinner />;
  if (!order) return null;

  const handleCancel = async () => {
    setCancelling(true);
    try {
      const updated = await orderService.cancelOrder(order.id);
      setOrder(updated);
      showToast('Order cancelled', 'info');
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setCancelling(false);
    }
  };

  const handleAuthorizeOnlinePay = async () => {
    setPaymentStage('processing');
    try {
      await new Promise(resolve => setTimeout(resolve, 1400));
      setPaymentStage('success');
      await new Promise(resolve => setTimeout(resolve, 600));

      const updated = await orderService.payOrder(order.id, 'online_upi');
      setOrder(updated);
      setPayModalOpen(false);
      setShowReceiptAnimation(true);
      showToast('Payment successful! Thermal takeaway receipt printing…', 'success');
    } catch (err: any) {
      setPaymentStage('select');
      showToast('Payment failed. Please try again.', 'error');
    }
  };

  const date = new Date(order.placedAt).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const isPaid = order.paymentStatus === 'paid';

  return (
    <div className="py-4 sm:py-6">
      {/* Back button */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/orders"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#777777] hover:text-[#252525] transition-colors"
        >
          <ArrowLeft size={16} /> Back to All Orders
        </Link>

        {isPaid && (
          <button
            type="button"
            onClick={() => setShowReceiptAnimation(!showReceiptAnimation)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F47721] hover:text-[#E0630D] bg-[#FFF7F0] border border-[#F47721]/30 px-3 py-1.5 rounded-xl transition-all"
          >
            <Printer size={14} />
            <span>{showReceiptAnimation ? 'Hide Receipt' : 'View Takeaway Receipt'}</span>
          </button>
        )}
      </div>

      {/* Optional Thermal Receipt Printing View */}
      {showReceiptAnimation && (
        <div className="mb-8 p-4 sm:p-6 bg-[#FFF7F0]/40 border-2 border-dashed border-[#F47721]/30 rounded-3xl text-center">
          <div className="flex items-center justify-between max-w-xl mx-auto mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F47721]">
              Live POS Receipt Printer
            </span>
            <button
              onClick={() => setShowReceiptAnimation(false)}
              className="text-xs text-[#777777] hover:text-[#252525] font-semibold underline"
            >
              Close
            </button>
          </div>
          <ReceiptPrinterAnimation order={order} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
        {/* Left Column: Details & Items */}
        <div className="lg:col-span-2 space-y-5">
          {/* Order Header Card */}
          <div className="bg-white border border-[#EEEEEE] rounded-2xl p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EEEEEE]">
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-[#777777]">Order Reference</span>
                <p className="text-base sm:text-lg font-mono font-bold text-[#252525]">{order.id}</p>
                <p className="text-xs text-[#777777] mt-0.5">Placed on {date}</p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                    isPaid
                      ? 'bg-green-100 text-[#269B62] border border-green-200'
                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}
                >
                  {isPaid ? 'PAID ONLINE (UPI)' : 'PAY AT COUNTER'}
                </span>
                <OrderStatusBadge status={order.status} />
              </div>
            </div>

            {order.estimatedTime && order.status !== 'completed' && order.status !== 'cancelled' && (
              <div className="mt-4 flex items-center gap-2.5 text-sm text-[#252525] bg-[#FFF7F0] p-3 rounded-xl border border-[#F47721]/20">
                <Clock size={16} className="text-[#F47721]" />
                <span>Estimated kitchen wait: <strong>{order.estimatedTime} minutes</strong></span>
              </div>
            )}

            {order.status === 'ready' && (
              <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-3 text-xs sm:text-sm text-[#269B62] font-semibold flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#269B62] shrink-0" />
                <span>Your food is ready! Please collect your meal at the cafeteria counter.</span>
              </div>
            )}
          </div>

          {/* Items List */}
          <div className="bg-white border border-[#EEEEEE] rounded-2xl p-5 shadow-xs">
            <h2 className="text-base font-bold text-[#252525] mb-3">Items in this Order ({order.items.length})</h2>
            <div className="divide-y divide-[#EEEEEE]">
              {order.items.map(({ menuItem, quantity }) => (
                <div key={menuItem.id} className="flex items-center gap-3.5 py-3.5">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-[#FFF7F0] flex-shrink-0">
                    <Image
                      src={menuItem.image}
                      alt={menuItem.name}
                      fill
                      className="object-cover"
                      unoptimized
                      sizes="56px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#252525] truncate">{menuItem.name}</p>
                    <p className="text-xs text-[#777777] mt-0.5">
                      {formatCurrency(menuItem.price)} × {quantity}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-[#252525]">
                    {formatCurrency(menuItem.price * quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Special Instructions if present */}
          {order.note && (
            <div className="bg-white border border-[#EEEEEE] rounded-2xl p-5 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#777777] mb-1.5">Special Instructions</h3>
              <p className="text-sm text-[#252525]">{order.note}</p>
            </div>
          )}
        </div>

        {/* Right Column: Bill Summary & Actions */}
        <div className="lg:col-span-1 space-y-4">
          {/* Takeaway QR Code Card */}
          <div className="bg-white border border-[#EEEEEE] rounded-2xl p-5 shadow-xs text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#F47721] bg-[#FFF7F0] px-2.5 py-0.5 rounded-full inline-block mb-2">
              Takeaway Token
            </span>
            <div className="w-28 h-28 mx-auto bg-[#FFF7F0] border-2 border-dashed border-[#F47721]/40 rounded-xl flex flex-col items-center justify-center p-2">
              <QrCode size={52} className="text-[#F47721]" />
              <span className="text-[9px] font-bold text-[#F47721] mt-1 font-mono">
                #{order.id.slice(0, 8).toUpperCase()}
              </span>
            </div>
            <p className="text-[11px] text-[#777777] mt-2.5 leading-snug">
              Present this QR token at the cafeteria counter to collect your takeaway.
            </p>
          </div>

          {/* Payment Breakdown Card */}
          <div className="bg-[#FFF7F0] border border-[#EEEEEE] rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-[#252525] pb-2 border-b border-[#EEEEEE]">Payment Breakdown</h3>
            <div className="flex justify-between text-sm text-[#777777]">
              <span>Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-[#777777]">
              <span>Service Charge (5%)</span>
              <span>{formatCurrency(order.serviceCharge)}</span>
            </div>
            <div className="border-t border-[#EEEEEE] pt-3 flex justify-between font-bold text-base text-[#252525]">
              <span>Total Amount</span>
              <span className="text-[#F47721]">{formatCurrency(order.total)}</span>
            </div>
            <div className="pt-1 flex items-center justify-between text-xs">
              <span className="text-[#777777]">Status:</span>
              <span className={`font-bold ${isPaid ? 'text-[#269B62]' : 'text-amber-800'}`}>
                {isPaid ? 'Paid Online via UPI' : 'Pending (Pay at Counter)'}
              </span>
            </div>
          </div>

          {/* Prominent "Pay Now" Button if order is unpaid and still pending/preparing */}
          {!isPaid && order.status !== 'cancelled' && (
            <div className="bg-white border-2 border-[#F47721]/30 rounded-2xl p-4 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-[#F47721]" />
                <span className="text-xs font-bold text-[#252525]">Want to Pay Online now?</span>
              </div>
              <p className="text-[11px] text-[#666666]">
                Pay via UPI now to generate your verified thermal receipt instantly and skip counter payment.
              </p>
              <Button
                fullWidth
                size="lg"
                onClick={() => {
                  setPaymentStage('select');
                  setPayModalOpen(true);
                }}
                className="shadow-md shadow-[#F47721]/25 font-black text-sm flex items-center justify-center gap-2 py-3.5"
              >
                <CreditCard size={17} />
                Pay Now · {formatCurrency(order.total)}
              </Button>
            </div>
          )}

          {/* View Receipt button if already paid */}
          {isPaid && (
            <Button
              fullWidth
              size="lg"
              variant="outline"
              onClick={() => setShowReceiptAnimation(true)}
              className="border-[#F47721] text-[#F47721] font-bold text-sm flex items-center justify-center gap-2"
            >
              <Printer size={16} />
              Print / View Receipt Animation
            </Button>
          )}

          {/* Cancellation button if still pending */}
          {(order.status === 'pending' || order.status === 'preparing') && (
            <Button
              variant="danger"
              fullWidth
              size="md"
              loading={cancelling}
              onClick={handleCancel}
            >
              Cancel Order
            </Button>
          )}

          <Link href="/home" className="block text-center text-sm font-semibold text-[#777777] hover:text-[#F47721] pt-2">
            Return to Cafeteria Home
          </Link>
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
              <h2 className="text-lg font-black mt-0.5">Pay Order Online</h2>
              <p className="text-xs text-white/90 mt-0.5">Token #{order.id.slice(0, 8).toUpperCase()}</p>

              <div className="mt-4 bg-white/15 backdrop-blur-xs rounded-xl p-3 flex justify-between items-center border border-white/20">
                <span className="text-xs font-semibold text-white/90">Amount to Pay:</span>
                <span className="text-xl font-black text-white">{formatCurrency(order.total)}</span>
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

                  <Button
                    size="lg"
                    fullWidth
                    onClick={handleAuthorizeOnlinePay}
                    className="shadow-md shadow-[#F47721]/25 text-sm font-black py-3.5 flex items-center justify-center gap-2"
                  >
                    <ShieldCheck size={18} />
                    Authorize & Pay {formatCurrency(order.total)}
                  </Button>
                </>
              )}

              {paymentStage === 'processing' && (
                <div className="py-8 text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-[#FFF7F0] border-2 border-[#F47721]/30 flex items-center justify-center mx-auto text-[#F47721] animate-spin">
                    <Loader2 size={28} />
                  </div>
                  <h3 className="text-base font-bold text-[#252525]">
                    Processing Payment…
                  </h3>
                  <p className="text-xs text-[#777777] max-w-xs mx-auto">
                    Contacting bank gateway to verify online payment. Please wait.
                  </p>
                </div>
              )}

              {paymentStage === 'success' && (
                <div className="py-8 text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center mx-auto text-[#269B62]">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-base font-black text-[#269B62]">
                    Payment Successful!
                  </h3>
                  <p className="text-xs text-[#777777]">
                    Receipt is printing out below…
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrderDetailPage() {
  return (
    <AppShell>
      <Suspense fallback={<PageSpinner />}>
        <OrderDetailContent />
      </Suspense>
    </AppShell>
  );
}

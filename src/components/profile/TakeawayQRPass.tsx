'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { QRCodeCanvas } from 'qrcode.react';
import {
  Download,
  Copy,
  Check,
  ExternalLink,
  Clock,
  Sparkles,
  ShoppingBag,
  Printer,
  ChevronDown,
} from 'lucide-react';
import { Order } from '@/lib/types/order';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { useToast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';

interface TakeawayQRPassProps {
  orders: Order[];
}

export function TakeawayQRPass({ orders }: TakeawayQRPassProps) {
  const { showToast } = useToast();
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const qrCanvasRef = useRef<HTMLDivElement>(null);

  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white border border-[#EEEEEE] rounded-2xl p-6 text-center shadow-xs">
        <div className="w-12 h-12 rounded-full bg-[#FFF7F0] flex items-center justify-center text-[#F47721] mx-auto mb-3">
          <ShoppingBag size={22} />
        </div>
        <h3 className="text-sm font-bold text-[#252525]">No Takeaway Orders Found</h3>
        <p className="text-xs text-[#777777] mt-1 max-w-xs mx-auto">
          Once you place an order, your takeaway pickup QR code and bill token will appear here.
        </p>
        <div className="mt-4">
          <Link href="/menu">
            <Button size="sm">Browse Cafeteria Menu</Button>
          </Link>
        </div>
      </div>
    );
  }

  const activeOrder = orders[selectedIdx] || orders[0];
  const isReady = activeOrder.status === 'ready';
  const isPending = activeOrder.status === 'pending' || activeOrder.status === 'preparing';

  const handleCopyToken = () => {
    navigator.clipboard.writeText(activeOrder.id);
    setCopied(true);
    showToast('Order token copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveQR = () => {
    setDownloading(true);
    try {
      // Find the QR code canvas rendered inside our ref
      const canvas = qrCanvasRef.current?.querySelector('canvas');
      if (!canvas) {
        showToast('Unable to export QR code', 'error');
        setDownloading(false);
        return;
      }

      // Create a dedicated composite ticket canvas for high-res saving
      const ticketCanvas = document.createElement('canvas');
      ticketCanvas.width = 600;
      ticketCanvas.height = 840;
      const ctx = ticketCanvas.getContext('2d');

      if (!ctx) {
        // Fallback: download bare QR canvas
        const dataUrl = canvas.toDataURL('image/png');
        triggerDownload(dataUrl, `CEV-Takeaway-${activeOrder.id}.png`);
        setDownloading(false);
        return;
      }

      // Draw background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, ticketCanvas.width, ticketCanvas.height);

      // Draw outer border
      ctx.strokeStyle = '#EEEEEE';
      ctx.lineWidth = 4;
      ctx.strokeRect(16, 16, ticketCanvas.width - 32, ticketCanvas.height - 32);

      // Top Header band
      ctx.fillStyle = '#F47721';
      ctx.fillRect(16, 16, ticketCanvas.width - 32, 100);

      // Header Text
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
      ctx.fillText('COLLEGE OF ENGINEERING VADAKARA', ticketCanvas.width / 2, 54);
      ctx.font = 'bold 15px system-ui, -apple-system, sans-serif';
      ctx.fillText('CAFETERIA TAKEAWAY PASS', ticketCanvas.width / 2, 86);

      // Order Token Box
      ctx.fillStyle = '#FFF7F0';
      ctx.fillRect(60, 140, ticketCanvas.width - 120, 70);
      ctx.strokeStyle = '#F47721';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(60, 140, ticketCanvas.width - 120, 70);

      ctx.fillStyle = '#777777';
      ctx.font = 'bold 12px system-ui, sans-serif';
      ctx.fillText('TOKEN IDENTIFIER', ticketCanvas.width / 2, 164);
      ctx.fillStyle = '#F47721';
      ctx.font = 'bold 24px monospace';
      ctx.fillText(activeOrder.id, ticketCanvas.width / 2, 196);

      // Draw the QR Code in center
      const qrSize = 260;
      const qrX = (ticketCanvas.width - qrSize) / 2;
      const qrY = 240;

      // QR white frame
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20);
      ctx.strokeStyle = '#DDDDDD';
      ctx.lineWidth = 2;
      ctx.strokeRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20);

      // Draw actual QR image from rendered canvas
      ctx.drawImage(canvas, qrX, qrY, qrSize, qrSize);

      // Scan instruction
      ctx.fillStyle = '#252525';
      ctx.font = 'bold 14px system-ui, sans-serif';
      ctx.fillText('PRESENT AT CAFE DELIVERY COUNTER', ticketCanvas.width / 2, 545);

      // Items summary and Total
      ctx.fillStyle = '#F9F9F9';
      ctx.fillRect(60, 570, ticketCanvas.width - 120, 130);
      ctx.strokeStyle = '#EEEEEE';
      ctx.lineWidth = 1;
      ctx.strokeRect(60, 570, ticketCanvas.width - 120, 130);

      ctx.fillStyle = '#777777';
      ctx.textAlign = 'left';
      ctx.font = '13px system-ui, sans-serif';
      ctx.fillText(`Status: ${activeOrder.status.toUpperCase()}`, 80, 605);
      ctx.fillText(`Items Ordered: ${activeOrder.items.length} items`, 80, 635);
      ctx.fillText(`Date: ${new Date(activeOrder.placedAt).toLocaleString()}`, 80, 665);

      ctx.textAlign = 'right';
      ctx.fillStyle = '#252525';
      ctx.font = 'bold 14px system-ui, sans-serif';
      ctx.fillText('Total Billed:', ticketCanvas.width - 80, 615);
      ctx.fillStyle = '#F47721';
      ctx.font = 'bold 22px system-ui, sans-serif';
      ctx.fillText(`₹${activeOrder.total}`, ticketCanvas.width - 80, 650);

      // Footer Attribution
      ctx.fillStyle = '#777777';
      ctx.textAlign = 'center';
      ctx.font = '11px system-ui, sans-serif';
      ctx.fillText('Designed and Developed by IEDC CEV', ticketCanvas.width / 2, 740);

      // Download
      const dataUrl = ticketCanvas.toDataURL('image/png');
      triggerDownload(dataUrl, `CEV-Takeaway-${activeOrder.id}.png`);
      showToast('Takeaway QR Pass saved to downloads!', 'success');
    } catch (err: any) {
      showToast('Failed to save QR pass image', 'error');
    } finally {
      setDownloading(false);
    }
  };

  const triggerDownload = (uri: string, filename: string) => {
    const link = document.createElement('a');
    link.download = filename;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white border border-[#EEEEEE] rounded-2xl p-5 shadow-xs">
      {/* Card Header & Order Selector if multiple */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EEEEEE]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F47721] animate-pulse" />
            <h2 className="text-base font-bold text-[#252525]">Takeaway Pickup QR Pass</h2>
          </div>
          <p className="text-xs text-[#777777] mt-0.5">
            Display or save this pass to collect your food at the cafeteria counter
          </p>
        </div>

        {orders.length > 1 && (
          <div className="relative">
            <select
              value={selectedIdx}
              onChange={e => setSelectedIdx(Number(e.target.value))}
              aria-label="Select Takeaway Order"
              className="appearance-none bg-[#FFF7F0] border border-[#F47721]/30 text-[#252525] text-xs font-semibold py-1.5 pl-3 pr-8 rounded-xl focus:outline-none focus:border-[#F47721] cursor-pointer"
            >
              {orders.map((ord, idx) => (
                <option key={ord.id} value={idx}>
                  #{ord.id.slice(-6)} · ₹{ord.total} ({ord.status})
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#F47721] pointer-events-none"
            />
          </div>
        )}
      </div>

      {/* Main QR Ticket Container */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
        {/* Left: Scannable QR Code Canvas */}
        <div className="sm:col-span-5 flex flex-col items-center justify-center p-4 bg-[#FFF7F0] border border-[#F47721]/20 rounded-2xl text-center">
          <div
            ref={qrCanvasRef}
            className="p-3 bg-white rounded-xl shadow-xs border border-[#EEEEEE] inline-block"
          >
            {/* Real scannable 2D QR Code targeting this order */}
            <QRCodeCanvas
              value={JSON.stringify({
                app: 'CEV-CAFETERIA',
                orderId: activeOrder.id,
                total: activeOrder.total,
                status: activeOrder.status,
              })}
              size={160}
              level="H"
              includeMargin={false}
              bgColor="#FFFFFF"
              fgColor="#252525"
            />
          </div>

          <span className="text-[10px] font-bold text-[#F47721] uppercase tracking-wider mt-2.5">
            Scan at Counter
          </span>
          <p className="text-[10px] text-[#666666] mt-0.5">
            Token: <strong className="font-mono text-[#252525]">#{activeOrder.id.slice(-6)}</strong>
          </p>
        </div>

        {/* Right: Order details & Save Actions */}
        <div className="sm:col-span-7 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#666666]">
                Order Token
              </span>
              <span
                className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                  isReady
                    ? 'bg-green-100 text-[#269B62]'
                    : isPending
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-gray-100 text-[#666666]'
                }`}
              >
                {activeOrder.status}
              </span>
            </div>

            <p className="font-mono text-base font-bold text-[#252525] mt-0.5 flex items-center gap-2">
              <span>{activeOrder.id}</span>
              <button
                type="button"
                onClick={handleCopyToken}
                title="Copy Token ID"
                className="p-1.5 rounded-lg text-[#666666] hover:text-[#F47721] hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label="Copy Token ID"
              >
                {copied ? <Check size={14} className="text-[#269B62]" /> : <Copy size={14} />}
              </button>
            </p>

            <div className="mt-3 space-y-1.5 text-xs text-[#666666] bg-[#FAFAFA] p-3 rounded-xl border border-[#EEEEEE]">
              <div className="flex justify-between">
                <span>Items:</span>
                <span className="font-semibold text-[#252525] truncate max-w-[180px]">
                  {activeOrder.items.map(i => `${i.quantity}× ${i.menuItem.name}`).join(', ')}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Billed Total:</span>
                <span className="font-extrabold text-sm text-[#F47721]">
                  {formatCurrency(activeOrder.total)}
                </span>
              </div>
              {activeOrder.estimatedTime && isPending && (
                <div className="flex items-center gap-1.5 text-[#252525] font-medium pt-1 border-t border-[#EEEEEE]">
                  <Clock size={13} className="text-[#F47721]" />
                  <span>Estimated wait: <strong>{activeOrder.estimatedTime} mins</strong></span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons to Save / Download / Print */}
          <div className="space-y-2 pt-1">
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                size="sm"
                onClick={handleSaveQR}
                loading={downloading}
                className="flex-1 shadow-xs"
              >
                <Download size={14} className="mr-1.5" />
                Save QR Pass (PNG)
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="sm:w-auto"
                title="Print Order Receipt"
              >
                <Printer size={14} className="mr-1" />
                Print
              </Button>
            </div>

            <Link
              href={`/orders/${activeOrder.id}`}
              className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-[#F47721] hover:underline w-full py-1"
            >
              <span>View Full Order Details & Timeline</span>
              <ExternalLink size={12} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


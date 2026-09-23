import React, { useState } from 'react';
import { useStore, formatINR } from '../../context/StoreContext';
import { EmailLog, Order } from '../../types';
import {
  Mail,
  Send,
  Eye,
  CheckCircle2,
  Clock,
  Smartphone,
  Monitor,
  ExternalLink,
  ShieldCheck,
  Truck,
  Package,
  BellRing,
  TrendingDown,
} from 'lucide-react';

export const EmailNotificationsTab: React.FC = () => {
  const { emailLogs, orders, products, priceDropSubscriptions, sendAutomatedEmail, showToast } = useStore();

  const [previewTemplate, setPreviewTemplate] = useState<
    'Order Confirmation' | 'Tracking Information' | 'Delivery Confirmed' | 'Price Drop Alert'
  >('Tracking Information');
  const [devicePreview, setDevicePreview] = useState<'desktop' | 'mobile'>('desktop');

  // Test sender state
  const [selectedOrderForTest, setSelectedOrderForTest] = useState<string>(
    orders[0]?.id || ''
  );
  const [testEmailType, setTestEmailType] = useState<EmailLog['type']>(
    'Tracking Information'
  );

  const sampleOrder = orders.find((o) => o.id === selectedOrderForTest) || orders[0];
  const sampleProduct = products[0];

  const handleSendTest = () => {
    if (!sampleOrder) return;
    sendAutomatedEmail(sampleOrder, testEmailType);
    showToast('Test Notification Triggered', `Sent ${testEmailType} to ${sampleOrder.customer.email}`);
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Automated Customer Email Engine
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time automated transaction emails triggered by checkout, supplier fulfillment, and courier tracking scans.
          </p>
        </div>

        {/* Quick Send Test Button */}
        <div className="flex items-center gap-2">
          <select
            value={testEmailType}
            onChange={(e) => setTestEmailType(e.target.value as EmailLog['type'])}
            className="p-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none"
          >
            <option value="Order Confirmation">Order Confirmation</option>
            <option value="Tracking Information">Tracking Information</option>
            <option value="Delivery Confirmed">Delivery Confirmed</option>
            <option value="Price Drop Alert">Price Drop Alert</option>
            <option value="Price Drop Subscription">Price Drop Subscription</option>
          </select>
          <button
            onClick={handleSendTest}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#6D28D9] hover:bg-[#5b21b6] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Test Email</span>
          </button>
        </div>
      </div>

      {/* 4 Core Workflow Rules Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Rule 1 */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900">1. Order Confirmation</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <p className="text-xs text-slate-500">
            Fires instantly upon checkout. Includes itemized invoice and sourcing lead-time.
          </p>
          <div className="text-[11px] text-[#6D28D9] font-medium flex items-center gap-1 pt-1">
            <span>Trigger: order.created</span>
          </div>
        </div>

        {/* Rule 2 */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900">2. Tracking Dispatched</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <p className="text-xs text-slate-500">
            Fires when carrier tracking number is generated (YunExpress, DHL, Yanwen).
          </p>
          <div className="text-[11px] text-[#2563EB] font-medium flex items-center gap-1 pt-1">
            <span>Trigger: supplier.dispatched</span>
          </div>
        </div>

        {/* Rule 3 */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900">3. Delivery Confirmed</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <p className="text-xs text-slate-500">
            Fires when local postal carrier scans item delivered. Prompts customer review.
          </p>
          <div className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 pt-1">
            <span>Trigger: carrier.delivered</span>
          </div>
        </div>

        {/* Rule 4 */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900">4. Price Drop Alerts</span>
            <span className="w-2 h-2 rounded-full bg-[#6D28D9]" />
          </div>
          <p className="text-xs text-slate-500">
            Fires instantly when retail price is lowered below customer alert thresholds.
          </p>
          <div className="text-[11px] text-[#6D28D9] font-medium flex items-center gap-1 pt-1">
            <span>Trigger: product.price_reduced</span>
          </div>
        </div>

      </div>

      {/* Visual Email Previewer Stage */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        
        {/* Controls Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#6D28D9]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Live Responsive Email Preview
            </h3>
          </div>

          <div className="flex items-center gap-3">
            {/* Template selector */}
            <div className="flex flex-wrap items-center gap-1 p-0.5 bg-slate-200/70 rounded-lg text-xs font-semibold">
              <button
                onClick={() => setPreviewTemplate('Order Confirmation')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  previewTemplate === 'Order Confirmation' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Confirmation
              </button>
              <button
                onClick={() => setPreviewTemplate('Tracking Information')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  previewTemplate === 'Tracking Information' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tracking Update
              </button>
              <button
                onClick={() => setPreviewTemplate('Delivery Confirmed')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  previewTemplate === 'Delivery Confirmed' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Delivered
              </button>
              <button
                onClick={() => setPreviewTemplate('Price Drop Alert')}
                className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1 ${
                  previewTemplate === 'Price Drop Alert' ? 'bg-[#6D28D9] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BellRing className="w-3 h-3" />
                <span>Price Drop</span>
              </button>
            </div>

            {/* Desktop / Mobile view toggle */}
            <div className="flex items-center gap-1 p-0.5 bg-slate-200/70 rounded-lg text-xs">
              <button
                onClick={() => setDevicePreview('desktop')}
                aria-label="Desktop preview"
                className={`p-1.5 rounded-md transition-colors ${
                  devicePreview === 'desktop' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                }`}
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDevicePreview('mobile')}
                aria-label="Mobile preview"
                className={`p-1.5 rounded-md transition-colors ${
                  devicePreview === 'mobile' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                }`}
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Email Rendering Sandbox */}
        <div className="p-6 sm:p-12 bg-slate-100 flex items-center justify-center">
          <div
            className={`bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden transition-all duration-300 ${
              devicePreview === 'mobile' ? 'w-full max-w-sm' : 'w-full max-w-2xl'
            }`}
          >
            {/* Email Header */}
            <div className="bg-[#2874F0] text-white p-6 sm:p-8 text-center space-y-2">
              <div className="text-xl font-black tracking-tight">AURA FASHION RESELLING</div>
              <p className="text-xs text-amber-300 uppercase tracking-widest font-semibold">
                Direct Loom Dispatch & Safe Delivery
              </p>
            </div>

            {/* Email Body */}
            <div className="p-6 sm:p-8 space-y-6 text-xs text-slate-700">
              
              {/* Headline */}
              <div>
                <h4 className="text-lg font-bold text-slate-900">
                  {previewTemplate === 'Order Confirmation' && `Order Confirmed #${sampleOrder?.orderNumber}`}
                  {previewTemplate === 'Tracking Information' && `Your Parcel Is In Transit (${sampleOrder?.trackingNumber || 'DEL289410984IN'})`}
                  {previewTemplate === 'Delivery Confirmed' && `Delivered: Order #${sampleOrder?.orderNumber}`}
                  {previewTemplate === 'Price Drop Alert' && `🔥 Price Drop: ${sampleProduct?.name || 'Pure Cotton Kurta'} is now ${formatINR(sampleProduct ? sampleProduct.price - 200 : 799)}`}
                </h4>
                <p className="text-slate-500 mt-1 leading-relaxed">
                  {previewTemplate === 'Order Confirmation' &&
                    `Namaste ${sampleOrder?.customer.firstName || 'Customer'}, thank you for ordering with AURA. Your apparel parcel is being hand-finished at our master weaving loom cluster in Surat/Jaipur.`}
                  {previewTemplate === 'Tracking Information' &&
                    `Namaste ${sampleOrder?.customer.firstName || 'Customer'}, your package has been handed over to ${sampleOrder?.courier} with active SMS delivery tracking.`}
                  {previewTemplate === 'Delivery Confirmed' &&
                    `Namaste ${sampleOrder?.customer.firstName || 'Customer'}, delivery partner records confirm your order was handed over at ${sampleOrder?.customer.address}, Near ${sampleOrder?.customer.landmark || 'Landmark'}.`}
                  {previewTemplate === 'Price Drop Alert' &&
                    `Special festive update! The price of ${sampleProduct?.name || 'Ethnic Wear'} just dropped. Direct loom weavers have offered special volume discounts.`}
                </p>
              </div>

              {/* Action Button */}
              <div className="text-center py-2">
                <div className="inline-block px-6 py-3 bg-[#2874F0] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer hover:bg-[#1b63d6] transition-colors">
                  {previewTemplate === 'Tracking Information'
                    ? 'Track Live on Delhivery / BlueDart'
                    : previewTemplate === 'Price Drop Alert'
                    ? `Claim at ${formatINR(sampleProduct ? sampleProduct.price - 200 : 799)}`
                    : 'View Tax Invoice'}
                </div>
              </div>

              {/* Detail Callout */}
              {previewTemplate === 'Price Drop Alert' ? (
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Target Apparel:</span>
                    <span className="font-semibold text-slate-800">{sampleProduct?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Original M.R.P.:</span>
                    <span className="text-slate-400 line-through tabular-nums">{formatINR(sampleProduct?.originalMrp || 2499)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">New Festive Price:</span>
                    <span className="font-bold text-[#2874F0] tabular-nums text-sm">{formatINR(sampleProduct ? sampleProduct.price - 200 : 799)} (-20%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Alert Trigger Status:</span>
                    <span className="font-semibold text-emerald-700">Threshold Met · Direct SMS sent</span>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Courier Partner:</span>
                    <span className="font-semibold text-slate-800">{sampleOrder?.courier}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">AWB Tracking Number:</span>
                    <span className="font-mono font-bold text-slate-900">
                      {sampleOrder?.trackingNumber || 'DEL289410984IN'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Mobile & Landmark:</span>
                    <span className="font-semibold text-slate-800 text-right truncate max-w-[220px]">
                      {sampleOrder?.customer.phone} · {sampleOrder?.customer.landmark || sampleOrder?.customer.city}
                    </span>
                  </div>
                </div>
              )}

              {/* Items Table (hidden for price drop email) */}
              {previewTemplate !== 'Price Drop Alert' && (
                <div className="border-t border-slate-200 pt-4 space-y-2">
                  <div className="font-bold text-slate-900">Apparel Items Ordered</div>
                  {sampleOrder?.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between items-center py-1">
                      <span>
                        {it.name} <span className="text-slate-400">×{it.quantity}</span>
                      </span>
                      <span className="font-bold tabular-nums">{formatINR(it.price * it.quantity)}</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-slate-900">
                    <span>Total Amount</span>
                    <span className="text-[#2874F0] tabular-nums font-sans">{formatINR(sampleOrder?.total || 0)}</span>
                  </div>
                </div>
              )}

              {/* Email Footer */}
              <div className="pt-6 border-t border-slate-200 text-center text-[10px] text-slate-400 space-y-1">
                <p>AURA Indian Fashion Reselling Platform · GST Compliant Invoice</p>
                <p>Automated transactional update sent with 2-Factor OTP verification.</p>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* Automated Email Dispatch Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900">Live Automated Dispatch Logs</h3>
            <span className="text-xs text-slate-400">({emailLogs.length} transmissions)</span>
          </div>
          <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Webhook Worker Active</span>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Order / Event</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Recipient</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {emailLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                    {log.sentAt}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">
                    {log.orderNumber}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                        log.type === 'Price Drop Alert'
                          ? 'bg-violet-100 text-[#6D28D9]'
                          : log.type === 'Price Drop Subscription'
                          ? 'bg-blue-100 text-[#2563EB]'
                          : log.type === 'Tracking Information'
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {log.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                    {log.recipientEmail}
                  </td>
                  <td className="py-3 px-4 text-slate-700 truncate max-w-[260px]">
                    {log.subject}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{log.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Price Drop Subscriptions Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BellRing className="w-4 h-4 text-[#6D28D9]" />
            <h3 className="text-sm font-bold text-slate-900">Customer Price Drop Alert Subscriptions</h3>
            <span className="text-xs text-slate-400">({priceDropSubscriptions.length} subscribers)</span>
          </div>
          <span className="text-xs text-[#6D28D9] font-semibold flex items-center gap-1">
            <span>Threshold Automation Ready</span>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
              <tr>
                <th className="py-3 px-4">Subscribed Date</th>
                <th className="py-3 px-4">Customer Email</th>
                <th className="py-3 px-4">Monitored Product</th>
                <th className="py-3 px-4">Subscribed At</th>
                <th className="py-3 px-4">Target Trigger Price</th>
                <th className="py-3 px-4">Current Price</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {priceDropSubscriptions.map((sub) => {
                const prod = products.find((p) => p.id === sub.productId);
                return (
                  <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                      {sub.createdAt}
                    </td>
                    <td className="py-3 px-4 text-slate-800 font-mono font-medium">
                      {sub.email}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900 max-w-[200px] truncate">
                      {sub.productName}
                    </td>
                    <td className="py-3 px-4 text-slate-500 tabular-nums">
                      ${sub.currentPriceAtSubscription.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#6D28D9] tabular-nums">
                      {sub.targetPrice ? `$${sub.targetPrice.toFixed(2)}` : 'Any Decrease'}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 tabular-nums">
                      ${prod ? prod.price.toFixed(2) : sub.currentPriceAtSubscription.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded ${
                          sub.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {sub.status === 'Active' && <CheckCircle2 className="w-3 h-3" />}
                        <span>{sub.status}</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

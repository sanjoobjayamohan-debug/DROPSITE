import React, { useState } from 'react';
import { useStore, formatINR } from '../../context/StoreContext';
import { Order, OrderStatus, CourierType } from '../../types';
import {
  Truck,
  CheckCircle2,
  Clock,
  Send,
  Eye,
  ExternalLink,
  ChevronDown,
  X,
  Mail,
  Copy,
  Smartphone,
  MapPin,
  Sparkles,
} from 'lucide-react';

const INDIAN_COURIERS: CourierType[] = [
  'Delhivery Express',
  'BlueDart Air',
  'Ekart Logistics',
  'Shadowfax Superfast',
  'DTDC Premium',
];

export const OrdersTab: React.FC = () => {
  const {
    orders,
    updateOrderStatus,
    assignTracking,
    fulfillWithSupplier,
    setCurrentView,
    setActiveTrackingOrder,
    showToast,
  } = useStore();

  const [statusFilter, setStatusFilter] = useState<'All' | OrderStatus>('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  // Tracking assignment modal
  const [trackingModalOrder, setTrackingModalOrder] = useState<Order | null>(null);
  const [manualTracking, setManualTracking] = useState('');
  const [manualCourier, setManualCourier] = useState<CourierType>('Delhivery Express');

  const filteredOrders = orders.filter((o) => {
    if (statusFilter === 'All') return true;
    return o.status === statusFilter;
  });

  const handleOpenTrackingModal = (order: Order) => {
    setTrackingModalOrder(order);
    setManualCourier(order.courier);
    setManualTracking(order.trackingNumber || `DEL${Math.floor(100000000 + Math.random() * 900000000)}IN`);
  };

  const handleSaveTracking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingModalOrder || !manualTracking.trim()) return;
    assignTracking(trackingModalOrder.id, manualTracking.trim(), manualCourier);
    setTrackingModalOrder(null);
  };

  const handleViewInPortal = (order: Order) => {
    setActiveTrackingOrder(order);
    setCurrentView('tracking');
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#2874F0] uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-[#FF9F00]" />
            <span>Pan-India Order Operations & COD Verification</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            Reseller Orders & Courier Logistics
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Review customer mobile numbers, landmark delivery coordinates, dispatch from Surat & Jaipur looms, and trigger automated SMS/email alerts.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-slate-100 rounded-xl max-w-full">
          {(['All', 'Unfulfilled', 'Supplier Placed', 'In Transit', 'Delivered'] as const).map(
            (status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap transition-colors ${
                  statusFilter === status
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {status}
              </button>
            )
          )}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/75 border-b border-slate-200 text-[10px] uppercase tracking-wider text-slate-700 font-bold">
              <tr>
                <th className="py-3.5 px-4">Order #</th>
                <th className="py-3.5 px-4">Customer & Mobile</th>
                <th className="py-3.5 px-4">Landmark & PIN</th>
                <th className="py-3.5 px-4">Apparel Items</th>
                <th className="py-3.5 px-4">Sale / Reseller Profit</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Courier & Payment</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredOrders.map((order) => {
                const isUnfulfilled = order.status === 'Unfulfilled';
                return (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    
                    {/* Order # & Date */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 font-mono">
                        {order.orderNumber}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </td>

                    {/* Customer & Mobile */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">
                        {order.customer.firstName} {order.customer.lastName}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] font-mono text-[#2874F0] font-bold">
                        <Smartphone className="w-3 h-3 text-emerald-600" />
                        <span>{order.customer.phone}</span>
                      </div>
                    </td>

                    {/* Landmark & PIN */}
                    <td className="py-3.5 px-4 max-w-[160px]">
                      <div className="font-semibold text-slate-800 text-[11px] truncate flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-orange-600 shrink-0" />
                        <span title={order.customer.landmark || 'No landmark specified'}>
                          {order.customer.landmark || 'Nearby landmark'}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {order.customer.city}, {order.customer.state} ({order.customer.pincode || order.customer.zip})
                      </div>
                    </td>

                    {/* Items */}
                    <td className="py-3.5 px-4 max-w-[150px]">
                      <div className="text-slate-800 font-semibold truncate">
                        {order.items.map((i) => i.name).join(', ')}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {order.items.reduce((s, i) => s + i.quantity, 0)} pcs total
                      </div>
                    </td>

                    {/* Financials (INR ₹) */}
                    <td className="py-3.5 px-4">
                      <div className="font-black text-slate-900 font-sans">
                        {formatINR(order.total)}
                      </div>
                      <div className="text-[10px] font-bold text-emerald-700">
                        +{formatINR(order.netProfit)} profit
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className={`text-xs font-bold px-2.5 py-1 rounded-md border appearance-none cursor-pointer focus:outline-none ${
                          order.status === 'Delivered'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : order.status === 'In Transit'
                            ? 'bg-blue-50 text-blue-700 border-blue-300'
                            : order.status === 'Supplier Placed'
                            ? 'bg-purple-50 text-purple-700 border-purple-300'
                            : 'bg-amber-50 text-amber-800 border-amber-300'
                        }`}
                      >
                        <option value="Unfulfilled">Unfulfilled</option>
                        <option value="Supplier Placed">Supplier Placed</option>
                        <option value="In Transit">In Transit</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    {/* Courier & Payment */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800 text-[11px] truncate max-w-[130px]">
                        {order.courier}
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium truncate max-w-[130px]">
                        {order.paymentMethod}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {isUnfulfilled && (
                          <button
                            onClick={() => fulfillWithSupplier(order.id)}
                            className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg text-[10px] shadow-xs"
                            title="Transmit order to loom weaver"
                          >
                            Send to Loom
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenTrackingModal(order)}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-[10px]"
                          title="Assign AWB Tracking Number"
                        >
                          AWB #
                        </button>
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-1.5 text-slate-500 hover:text-[#2874F0] hover:bg-slate-100 rounded-lg"
                          title="View Full Address & Landmark"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* TRACKING ASSIGNMENT MODAL */}
      {trackingModalOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">
                Assign Domestic Courier AWB
              </h3>
              <button
                onClick={() => setTrackingModalOrder(null)}
                className="p-1 text-slate-400 hover:text-slate-800 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTracking} className="pt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Courier Partner</label>
                <select
                  value={manualCourier}
                  onChange={(e) => setManualCourier(e.target.value as CourierType)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-800"
                >
                  {INDIAN_COURIERS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">AWB / Consignment Tracking Number</label>
                <input
                  type="text"
                  required
                  value={manualTracking}
                  onChange={(e) => setManualTracking(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-mono text-slate-900 font-bold focus:border-[#2874F0]"
                />
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-[11px] text-blue-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <Smartphone className="w-3.5 h-3.5 text-blue-700" />
                  <span>SMS to {trackingModalOrder.customer.phone}</span>
                </div>
                <p className="text-blue-800">
                  Instant live tracking link and dispatch SMS will be triggered to the buyer.
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setTrackingModalOrder(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2874F0] hover:bg-[#1b63d6] text-white font-bold rounded-xl"
                >
                  Dispatch & Send SMS
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INSPECT ORDER DRAWER (SHOWING LANDMARK & MOBILE NUMBER) */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end">
          <div
            className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Order Details: {selectedOrder.orderNumber}
                </h3>
                <span className="text-xs text-slate-500 font-medium">
                  Created {new Date(selectedOrder.createdAt).toLocaleString()}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 flex-1 text-xs">
              
              {/* Financial summary in INR ₹ */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between text-slate-600">
                  <span>Gross Storefront Order Value</span>
                  <span className="font-bold text-slate-900 font-sans">{formatINR(selectedOrder.total)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Loom Wholesale Cost (COGS)</span>
                  <span className="text-rose-600 font-bold font-sans">-{formatINR(selectedOrder.totalSupplierCost)}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-sm">
                  <span>Net Reseller Margin</span>
                  <span className="text-emerald-700 font-sans">+{formatINR(selectedOrder.netProfit)}</span>
                </div>
              </div>

              {/* Customer & Indian Delivery Coordinates */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Indian Delivery Coordinates & Buyer Contacts
                </h4>
                <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2 text-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">
                      {selectedOrder.customer.firstName} {selectedOrder.customer.lastName}
                    </span>
                    <span className="font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {selectedOrder.customer.phone}
                    </span>
                  </div>
                  <div>Email: <span className="font-mono text-slate-800">{selectedOrder.customer.email}</span></div>
                  <div>Address: <span className="font-semibold text-slate-900">{selectedOrder.customer.address}</span></div>
                  
                  {/* Landmark prominently displayed */}
                  <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 font-medium">
                    <span className="font-bold block text-[11px] text-amber-800">Delivery Landmark:</span>
                    <span>{selectedOrder.customer.landmark || 'Opposite Metro Station Gate 2, Near City Mall'}</span>
                  </div>

                  <div className="text-[11px] text-slate-500">
                    City / State: <strong>{selectedOrder.customer.city}, {selectedOrder.customer.state}</strong> (PIN: {selectedOrder.customer.pincode || selectedOrder.customer.zip})
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Apparel Items
                </h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-14 object-cover rounded-lg border border-slate-200"
                        />
                        <div>
                          <div className="font-bold text-slate-900">{item.name}</div>
                          <div className="text-[11px] text-slate-500">
                            Size: {item.selectedSize || 'Free Size'} · Qty: {item.quantity} · Cost: {formatINR(item.supplierCost)}
                          </div>
                        </div>
                      </div>
                      <div className="font-black text-slate-900 font-sans">
                        {formatINR(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Courier Timeline */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Domestic Logistics Status ({selectedOrder.courier})
                </h4>
                <div className="space-y-2">
                  {selectedOrder.trackingHistory.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-[11px]">
                      <span className={`w-2 h-2 rounded-full mt-1 shrink-0 ${step.completed ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                      <div className="flex-1">
                        <div className="font-bold text-slate-900">{step.status}</div>
                        <div className="text-slate-500">{step.location} · {step.timestamp}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            <div className="p-6 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <button
                onClick={() => handleViewInPortal(selectedOrder)}
                className="px-4 py-2.5 bg-[#2874F0] hover:bg-[#1b63d6] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>Track Package in Customer Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2.5 bg-white border border-slate-200 text-xs font-bold rounded-xl text-slate-700 hover:bg-slate-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

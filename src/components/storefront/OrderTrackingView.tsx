import React, { useState } from 'react';
import { useStore, formatINR } from '../../context/StoreContext';
import {
  Search,
  Truck,
  CheckCircle2,
  MapPin,
  Package,
  ArrowRight,
  Smartphone,
} from 'lucide-react';
import { Order } from '../../types';

export const OrderTrackingView: React.FC = () => {
  const {
    orders,
    activeTrackingOrder,
    setActiveTrackingOrder,
    setCurrentView,
    trackOrderLookup,
  } = useStore();

  const [inputQuery, setInputQuery] = useState(
    activeTrackingOrder ? activeTrackingOrder.orderNumber : orders[0]?.orderNumber || 'AUR-IND-94821'
  );
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(
    activeTrackingOrder || orders[0] || null
  );
  const [errorMessage, setErrorMessage] = useState('');

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    const match = trackOrderLookup(inputQuery);
    if (match) {
      setSearchedOrder(match);
      setActiveTrackingOrder(match);
    } else {
      setErrorMessage(
        `No consignment found matching "${inputQuery}". Please check your order reference or 10-digit mobile number.`
      );
    }
  };

  const selectSampleOrder = (ordNum: string) => {
    setInputQuery(ordNum);
    const match = trackOrderLookup(ordNum);
    if (match) {
      setSearchedOrder(match);
      setActiveTrackingOrder(match);
      setErrorMessage('');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center justify-center gap-2 text-xs font-medium tracking-[0.25em] uppercase text-stone-500">
          <Truck className="w-4 h-4 text-stone-700" />
          <span>Consignment Dispatch & Logistics</span>
        </div>
        <h1 className="font-editorial text-3xl sm:text-4xl font-medium tracking-tight text-stone-900">
          Track Your Handloom Consignment
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 font-light">
          Real-time transit updates from our Varanasi, Jaipur, and Surat ateliers directly to your doorstep.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-lg mx-auto mb-10">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Enter Order # (AUR-IND-94821) or Mobile #"
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-300 rounded-full text-xs text-stone-900 focus:outline-none focus:border-stone-800 shadow-2xs"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs tracking-wider uppercase font-medium rounded-full transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Track</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Quick Samples */}
        <div className="mt-3 flex items-center justify-center gap-2 text-xs text-stone-500 font-light">
          <span>Recent Consignments:</span>
          {orders.slice(0, 3).map((o) => (
            <button
              key={o.id}
              onClick={() => selectSampleOrder(o.orderNumber)}
              className="font-mono text-stone-800 hover:underline cursor-pointer"
            >
              {o.orderNumber}
            </button>
          ))}
        </div>

        {errorMessage && (
          <div className="mt-4 p-3 bg-stone-100 border border-stone-200 text-stone-800 rounded-xl text-xs text-center font-light">
            {errorMessage}
          </div>
        )}
      </div>

      {/* Tracking Card */}
      {searchedOrder && (
        <div className="bg-white rounded-2xl border border-stone-200/80 shadow-md overflow-hidden animate-in fade-in">
          {/* Header Bar */}
          <div className="p-6 bg-stone-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-sm font-medium tracking-wider text-stone-100">
                  {searchedOrder.orderNumber}
                </span>
                <span className="text-stone-600">·</span>
                <span className="text-xs text-stone-300 font-light">
                  {searchedOrder.courier}
                </span>
              </div>
              <div className="text-xs text-stone-400 mt-1 font-light">
                Consignment AWB: <span className="font-mono text-white">{searchedOrder.trackingNumber}</span>
              </div>
            </div>

            <div>
              <span
                className={`px-3 py-1 rounded-full text-xs tracking-wider uppercase font-medium ${
                  searchedOrder.status === 'Delivered'
                    ? 'bg-emerald-900/60 text-emerald-200 border border-emerald-700'
                    : searchedOrder.status === 'In Transit'
                    ? 'bg-stone-800 text-stone-200 border border-stone-700'
                    : 'bg-stone-800 text-stone-300 border border-stone-700'
                }`}
              >
                {searchedOrder.status}
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            {/* Visual Route Stages */}
            <div className="border border-stone-200 rounded-xl p-6 bg-[#FAF9F6]">
              <h3 className="text-xs font-medium tracking-[0.2em] uppercase text-stone-400 mb-6">
                Transit Milestones
              </h3>

              <div className="relative">
                <div className="hidden sm:block absolute top-1/2 left-0 right-0 h-[1.5px] bg-stone-200 -translate-y-1/2 z-0" />

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 relative z-10">
                  {/* Step 1: Order Confirmed */}
                  <div className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2">
                    <div className="w-9 h-9 rounded-full bg-stone-900 text-white flex items-center justify-center shadow-xs">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-stone-900">Order Confirmed</div>
                      <div className="text-[11px] text-stone-500 font-light">Atelier Logged</div>
                    </div>
                  </div>

                  {/* Step 2: Loom Dispatched */}
                  <div className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center shadow-xs ${
                        searchedOrder.status !== 'Unfulfilled'
                          ? 'bg-stone-900 text-white'
                          : 'bg-white border border-stone-300 text-stone-400'
                      }`}
                    >
                      <Package className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-stone-900">Tailored & Packed</div>
                      <div className="text-[11px] text-stone-500 font-light">Muslin Bag Enclosed</div>
                    </div>
                  </div>

                  {/* Step 3: Courier In Transit */}
                  <div className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center shadow-xs ${
                        searchedOrder.status === 'In Transit' || searchedOrder.status === 'Delivered'
                          ? 'bg-stone-900 text-white'
                          : 'bg-white border border-stone-300 text-stone-400'
                      }`}
                    >
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-stone-900">In Express Transit</div>
                      <div className="text-[11px] text-stone-500 font-light">Regional Sort Hub</div>
                    </div>
                  </div>

                  {/* Step 4: Final Delivery */}
                  <div className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center shadow-xs ${
                        searchedOrder.status === 'Delivered'
                          ? 'bg-stone-900 text-white'
                          : 'bg-white border border-stone-300 text-stone-400'
                      }`}
                    >
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-stone-900">Delivered</div>
                      <div className="text-[11px] text-stone-500 font-light">Handover Completed</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Checkpoint logs & Package details */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Checkpoints timeline */}
              <div className="md:col-span-7 space-y-4">
                <h3 className="text-xs font-medium tracking-[0.2em] uppercase text-stone-400">
                  Detailed Checkpoints
                </h3>

                <div className="space-y-4 relative before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[1.5px] before:bg-stone-200">
                  {searchedOrder.trackingHistory.map((item, idx) => (
                    <div key={idx} className="relative flex items-start gap-4 pl-7">
                      <div
                        className={`absolute left-1.5 top-1 w-2.5 h-2.5 rounded-full -translate-x-1/2 ring-4 ring-white ${
                          item.completed ? 'bg-stone-900' : 'bg-stone-300'
                        }`}
                      />
                      <div>
                        <div className="text-xs font-semibold text-stone-900">{item.status}</div>
                        <div className="text-[11px] text-stone-600 font-light">{item.location}</div>
                        <div className="text-[10px] text-stone-400 font-mono mt-0.5">{item.timestamp}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Item Package Details */}
              <div className="md:col-span-5 bg-[#FAF9F6] rounded-xl p-5 border border-stone-200 space-y-4">
                <h3 className="text-xs font-medium tracking-[0.2em] uppercase text-stone-400">
                  Consignment Contents
                </h3>

                <div className="divide-y divide-stone-200 text-xs">
                  {searchedOrder.items.map((it, idx) => (
                    <div key={idx} className="py-2.5 flex items-center gap-3">
                      <img
                        src={it.image}
                        alt={it.name}
                        className="w-12 h-14 object-cover rounded-md bg-stone-100 border border-stone-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-stone-900 truncate">{it.name}</div>
                        <div className="text-[11px] text-stone-500 font-light">
                          Size: {it.selectedSize || 'Standard'} · Qty: {it.quantity}
                        </div>
                      </div>
                      <div className="font-medium text-stone-900 tabular-nums">
                        {formatINR(it.price * it.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-stone-200 text-xs space-y-1.5">
                  <div className="flex justify-between text-stone-600 font-light">
                    <span>Payment Mode</span>
                    <span className="font-medium text-stone-900">{searchedOrder.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between text-stone-600 font-light">
                    <span>Delivery Contact</span>
                    <span className="font-mono text-stone-900">{searchedOrder.customer.phone}</span>
                  </div>
                  <div className="pt-1 text-stone-600 font-light">
                    <span className="block text-[11px] text-stone-400 uppercase tracking-wider">Destination:</span>
                    <span className="font-medium text-stone-900 block">{searchedOrder.customer.address}</span>
                    {searchedOrder.customer.landmark && (
                      <span className="text-[11px] text-stone-700 block mt-0.5">
                        Landmark: <strong>{searchedOrder.customer.landmark}</strong>
                      </span>
                    )}
                    <span className="text-[11px] text-stone-500">
                      {searchedOrder.customer.city}, {searchedOrder.customer.state} ({searchedOrder.customer.pincode || searchedOrder.customer.zip})
                    </span>
                  </div>
                </div>

                {searchedOrder.lastEmailSent && (
                  <div className="mt-3 p-3 bg-white rounded-lg border border-stone-200 flex items-center gap-2 text-[11px] text-stone-600 font-light">
                    <Smartphone className="w-3.5 h-3.5 text-stone-700 shrink-0" />
                    <span>{searchedOrder.lastEmailSent}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Back to store CTA */}
            <div className="pt-4 flex justify-between items-center border-t border-stone-200">
              <button
                onClick={() => setCurrentView('storefront')}
                className="text-xs font-medium tracking-wider uppercase text-stone-600 hover:text-stone-900 cursor-pointer"
              >
                ← Return to Collection
              </button>
              <button
                onClick={() => setCurrentView('backend')}
                className="text-xs font-medium tracking-wider uppercase text-stone-500 hover:text-stone-900 cursor-pointer"
              >
                Studio Manager →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

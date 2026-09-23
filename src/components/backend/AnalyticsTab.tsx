import React, { useState } from 'react';
import { useStore, formatINR } from '../../context/StoreContext';
import {
  TrendingUp,
  ShoppingBag,
  Percent,
  Truck,
  Globe,
  ArrowUpRight,
  Radio,
  Sparkles,
  MapPin,
} from 'lucide-react';

export const AnalyticsTab: React.FC = () => {
  const { orders } = useStore();
  const [timeRange, setTimeRange] = useState<'today' | '7d' | '30d'>('7d');

  // Compute live reseller metrics from real order state in INR (₹)
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalCOGS = orders.reduce((sum, o) => sum + o.totalSupplierCost, 0);
  const totalNetProfit = totalRevenue - totalCOGS;
  const netMarginPercent = totalRevenue > 0 ? (totalNetProfit / totalRevenue) * 100 : 0;
  const aov = orders.length > 0 ? totalRevenue / orders.length : 0;

  // Courier Breakdown
  const courierCounts = orders.reduce((acc, o) => {
    acc[o.courier] = (acc[o.courier] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // State / City Breakdown
  const stateCounts = orders.reduce((acc, o) => {
    const loc = o.customer.state || 'Gujarat';
    acc[loc] = (acc[loc] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Chart data points in INR (₹)
  const chartPoints = [
    { day: 'Mon', revenue: 48500, profit: 29800 },
    { day: 'Tue', revenue: 72400, profit: 46200 },
    { day: 'Wed', revenue: 61900, profit: 39500 },
    { day: 'Thu', revenue: 94800, profit: 61000 },
    { day: 'Fri', revenue: 112000, profit: 73500 },
    { day: 'Sat', revenue: 89000, profit: 57200 },
    { day: 'Sun', revenue: 125000, profit: 82000 },
  ];

  const maxRevenue = Math.max(...chartPoints.map((p) => p.revenue));

  return (
    <div className="space-y-8 animate-in fade-in">
      
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#2874F0] uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#FF9F00]" />
            <span>Pan-India Fashion Reseller Economics</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            Real-Time Revenue & Loom Profit Analytics
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Calculated from weaver cost of goods (COGS), courier line hauls, and customer orders across 28,000+ PIN codes.
          </p>
        </div>

        {/* Time range selector */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setTimeRange('today')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              timeRange === 'today' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setTimeRange('7d')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              timeRange === '7d' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setTimeRange('30d')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              timeRange === '30d' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Last 30 Days
          </button>
        </div>
      </div>

      {/* KPI Cards in INR (₹) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Revenue */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-bold">Gross Customer Sales</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#2874F0] flex items-center justify-center font-bold">
              ₹
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 font-sans">
            {formatINR(totalRevenue)}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+24.8% vs last week</span>
          </div>
        </div>

        {/* Reseller Net Profit */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-bold">Reseller Net Margin</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600 font-sans">
            {formatINR(totalNetProfit)}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            Weaver COGS: {formatINR(totalCOGS)}
          </div>
        </div>

        {/* Gross Margin % */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-bold">Average Gross Margin</span>
            <div className="w-8 h-8 rounded-xl bg-violet-50 text-[#6D28D9] flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tabular-nums">
            {netMarginPercent.toFixed(1)}%
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            High margin Indian ethnic apparel
          </div>
        </div>

        {/* Total Orders & AOV */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-bold">Total Apparel Orders</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tabular-nums">
            {orders.length}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            Avg Order: <strong className="text-slate-800 font-sans">{formatINR(aov)}</strong>
          </div>
        </div>
      </div>

      {/* Daily Revenue Trend Chart */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Daily Sales Volume (₹ INR)
            </h3>
            <p className="text-xs text-slate-500">
              Comparing gross sales vs net profit across week days
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#2874F0]" />
              <span>Gross Sales (₹)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-emerald-500" />
              <span>Reseller Margin (₹)</span>
            </div>
          </div>
        </div>

        {/* Bar Visualizer */}
        <div className="h-56 pt-6 flex items-end justify-between gap-3 sm:gap-6 border-b border-slate-100">
          {chartPoints.map((pt, i) => {
            const revHeight = (pt.revenue / maxRevenue) * 100;
            const profHeight = (pt.profit / maxRevenue) * 100;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <div className="w-full max-w-[40px] flex items-end gap-1 h-full justify-center">
                  <div
                    style={{ height: `${revHeight}%` }}
                    className="w-1/2 bg-[#2874F0] hover:bg-[#1b63d6] rounded-t-sm transition-all relative group/bar"
                  >
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                      {formatINR(pt.revenue)}
                    </div>
                  </div>
                  <div
                    style={{ height: `${profHeight}%` }}
                    className="w-1/2 bg-emerald-500 hover:bg-emerald-600 rounded-t-sm transition-all relative group/bar2"
                  >
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover/bar2:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                      {formatINR(pt.profit)}
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-slate-500">{pt.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Couriers & Regional Hubs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Logistics Breakdown */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#2874F0]" />
              <span>Domestic Couriers (COD & Prepaid)</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Pan-India Network</span>
          </div>

          <div className="space-y-3">
            {[
              { name: 'Delhivery Surface Express', share: 48, fee: 'Free above ₹999' },
              { name: 'BlueDart Apex Priority Air', share: 26, fee: '₹99 standard' },
              { name: 'DTDC Super Express', share: 16, fee: '₹69 standard' },
              { name: 'Xpressbees Fashion Line', share: 10, fee: '₹40 standard' },
            ].map((c) => (
              <div key={c.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-800">{c.name}</span>
                  <span className="text-slate-500">{c.share}% · {c.fee}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${c.share}%` }}
                    className="bg-[#2874F0] h-full rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Destination States */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-600" />
              <span>Top Reseller Markets & States</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Active Clusters</span>
          </div>

          <div className="space-y-3">
            {[
              { state: 'Gujarat (Ahmedabad / Surat / Rajkot)', orders: '32% orders', margin: '62% avg' },
              { state: 'Maharashtra (Mumbai / Pune / Nagpur)', orders: '28% orders', margin: '58% avg' },
              { state: 'Delhi NCR & Haryana', orders: '18% orders', margin: '65% avg' },
              { state: 'Karnataka & Tamil Nadu', orders: '14% orders', margin: '55% avg' },
              { state: 'Rajasthan & UP (Jaipur / Lucknow)', orders: '8% orders', margin: '60% avg' },
            ].map((s) => (
              <div key={s.state} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">{s.state}</span>
                <div className="flex items-center gap-3">
                  <span className="text-[#2874F0] font-semibold">{s.orders}</span>
                  <span className="text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded font-mono font-bold text-[10px]">
                    {s.margin}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

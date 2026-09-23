import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Layers,
  RefreshCw,
  ShieldAlert,
  Sliders,
  CheckCircle2,
  Clock,
  Wifi,
  AlertTriangle,
} from 'lucide-react';

export const InventoryTab: React.FC = () => {
  const { products, updateProduct, showToast } = useStore();
  const [isSyncing, setIsSyncing] = useState(false);
  const [globalAutoSync, setGlobalAutoSync] = useState(true);
  const [allowBackorders, setAllowBackorders] = useState(true);

  const handleSimulateSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      showToast(
        'Supplier Inventory Synchronized',
        'Direct API checked 4 factory lines. 320 total units verified in stock.'
      );
    }, 1200);
  };

  const totalStock = products.reduce((s, p) => s + p.stock, 0);
  const lowStockCount = products.filter((p) => p.stock <= p.safetyStockThreshold).length;

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Dropship Inventory & Buffer Controls
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Maintain zero dead inventory while safeguarding against supplier stockouts via automated buffers.
          </p>
        </div>

        <button
          onClick={handleSimulateSync}
          disabled={isSyncing}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#6D28D9] hover:bg-[#5b21b6] text-white text-xs font-semibold rounded-xl shadow-xs transition-all self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Syncing Feeds...' : 'Sync Supplier Feeds'}</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Supplier Available Units</span>
            <Layers className="w-4 h-4 text-[#6D28D9]" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            {totalStock} units
          </div>
          <div className="text-[11px] text-emerald-600 font-medium">
            Across 5 precision factory lines
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Safety Buffer Warnings</span>
            <ShieldAlert className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            {lowStockCount} items
          </div>
          <div className="text-[11px] text-slate-500">
            Below safety buffer threshold
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Avg Factory Dispatch SLA</span>
            <Clock className="w-4 h-4 text-[#2563EB]" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            1.2 days
          </div>
          <div className="text-[11px] text-slate-500">
            99.2% line-haul handoff compliance
          </div>
        </div>
      </div>

      {/* Dropship Strategy Controls Card */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">
          Automated Sourcing Safeguards
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Control 1 */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-bold text-slate-900">Automated Supplier Stock Feed Sync</div>
              <div className="text-[11px] text-slate-500">
                Poll factory inventory every 15 minutes to adjust storefront stock counters.
              </div>
            </div>
            <button
              onClick={() => {
                setGlobalAutoSync(!globalAutoSync);
                showToast('Setting Updated', `Supplier feed sync ${!globalAutoSync ? 'enabled' : 'paused'}`);
              }}
              className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                globalAutoSync ? 'bg-[#6D28D9]' : 'bg-slate-300'
              }`}
            >
              <span
                className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                  globalAutoSync ? 'left-5.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* Control 2 */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-bold text-slate-900">Backorder Acceptance</div>
              <div className="text-[11px] text-slate-500">
                Permit customers to place orders when factory confirms assembly batch in progress.
              </div>
            </div>
            <button
              onClick={() => {
                setAllowBackorders(!allowBackorders);
                showToast('Backorders Updated', `Backorders ${!allowBackorders ? 'allowed' : 'restricted'}`);
              }}
              className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                allowBackorders ? 'bg-[#6D28D9]' : 'bg-slate-300'
              }`}
            >
              <span
                className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                  allowBackorders ? 'left-5.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Supplier Line Telemetry Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200/80 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            Connected Supplier Factories & Buffer Thresholds
          </h3>
          <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
            <Wifi className="w-3.5 h-3.5" />
            <span>All 4 Webhooks Operational</span>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
              <tr>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Supplier Partner</th>
                <th className="py-3 px-4">SKU Code</th>
                <th className="py-3 px-4">Factory Stock</th>
                <th className="py-3 px-4">Safety Buffer</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Adjust Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((product) => {
                const isCritical = product.stock <= product.safetyStockThreshold;
                return (
                  <tr key={product.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900 truncate max-w-[180px]">
                      {product.name}
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      <div>{product.supplierName}</div>
                      <div className="text-[10px] text-slate-400">{product.supplierOrigin}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                      {product.supplierSku}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 tabular-nums">
                      {product.stock} units
                    </td>
                    <td className="py-3 px-4 text-slate-500 tabular-nums">
                      {product.safetyStockThreshold} units
                    </td>
                    <td className="py-3 px-4">
                      {isCritical ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Low Buffer</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Optimal</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => {
                            const newStock = Math.max(0, product.stock - 5);
                            updateProduct(product.id, { stock: newStock, inStock: newStock > 0 });
                          }}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold text-[11px]"
                        >
                          -5
                        </button>
                        <button
                          onClick={() => {
                            const newStock = product.stock + 20;
                            updateProduct(product.id, { stock: newStock, inStock: true });
                          }}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold text-[11px]"
                        >
                          +20
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

    </div>
  );
};

import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Package,
  Search,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertCircle,
  Truck,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { OrderStatus } from '../../types';

export const OrderTrackingView: React.FC = () => {
  const {
    orders,
    currentTrackedOrder,
    setCurrentTrackedOrder,
    formatPrice,
    setCurrentView,
    siteSettings,
  } = useStore();

  const [searchOrderNumber, setSearchOrderNumber] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // Active tracked order is either the context tracked order or the first order found
  const activeOrder = currentTrackedOrder || (orders.length > 0 ? orders[0] : null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchOrderNumber.trim()) return;

    setHasSearched(true);
    const cleanQuery = searchOrderNumber.trim().toLowerCase();
    const found = orders.find(
      (o) =>
        o.orderNumber.toLowerCase() === cleanQuery ||
        o.customer.phone.includes(cleanQuery) ||
        o.paymentVerification?.transactionId.toLowerCase() === cleanQuery
    );

    if (found) {
      setCurrentTrackedOrder(found);
    } else {
      setCurrentTrackedOrder(null);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING_VERIFICATION':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 animate-pulse" /> Pending Verification
          </span>
        );
      case 'CONFIRMED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Payment Approved &amp; Confirmed
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5" /> Packaging &amp; Inspection
          </span>
        );
      case 'SHIPPED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5" /> Dispatched with Courier
          </span>
        );
      case 'DELIVERED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Delivered
          </span>
        );
      case 'REJECTED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" /> bKash Payment Rejected
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-500/10 text-slate-400 border border-slate-500/20">
            {status}
          </span>
        );
    }
  };

  const steps: { label: string; key: OrderStatus }[] = [
    { label: 'Order Submitted', key: 'PENDING_PAYMENT' },
    { label: 'bKash Verification', key: 'PENDING_VERIFICATION' },
    { label: 'Confirmed', key: 'CONFIRMED' },
    { label: 'Dispatched', key: 'SHIPPED' },
    { label: 'Delivered', key: 'DELIVERED' },
  ];

  const getStepStatus = (stepKey: OrderStatus, currentStatus: OrderStatus) => {
    if (currentStatus === 'REJECTED') return 'rejected';
    const orderHierarchy: OrderStatus[] = [
      'PENDING_PAYMENT',
      'PENDING_VERIFICATION',
      'CONFIRMED',
      'PROCESSING',
      'SHIPPED',
      'DELIVERED',
    ];
    const currentIndex = orderHierarchy.indexOf(currentStatus);
    const stepIndex = orderHierarchy.indexOf(stepKey);

    if (currentIndex >= stepIndex) return 'complete';
    return 'upcoming';
  };

  return (
    <div id="order-tracking-container" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Track Your THIZ Order
        </h1>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Enter your Order Number (e.g. THZ-26XXXX) or phone number to check manual bKash verification and dispatch status.
        </p>
      </div>

      {/* Search Input Card */}
      <form onSubmit={handleSearch} className="max-w-xl mx-auto flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchOrderNumber}
            onChange={(e) => setSearchOrderNumber(e.target.value)}
            placeholder="Enter Order #, Phone, or bKash TrxID..."
            className="w-full bg-[#141721] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#ff5722]"
          />
        </div>
        <button
          type="submit"
          className="px-5 py-2.5 bg-[#ff5722] hover:bg-[#f4511e] text-white rounded-xl text-xs font-bold transition-colors shrink-0"
        >
          Track
        </button>
      </form>

      {/* Tracked Order Details */}
      {activeOrder ? (
        <div className="rounded-2xl bg-[#141721] border border-white/10 overflow-hidden shadow-2xl space-y-6 p-6 sm:p-8">
          {/* Top Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Order</span>
                <span className="text-lg font-black text-white font-mono">{activeOrder.orderNumber}</span>
              </div>
              <p className="text-xs text-slate-400">
                Placed on {new Date(activeOrder.createdAt).toLocaleDateString()} at{' '}
                {new Date(activeOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            <div className="self-start sm:self-center">
              {getStatusBadge(activeOrder.orderStatus)}
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="py-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-6">
              Fulfillment Journey
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {steps.map((step, idx) => {
                const stepState = getStepStatus(step.key, activeOrder.orderStatus);
                return (
                  <div key={idx} className="flex flex-col items-center text-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-2 border transition-all ${
                        stepState === 'complete'
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                          : stepState === 'rejected'
                          ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                          : 'bg-[#0d0f14] border-white/10 text-slate-500'
                      }`}
                    >
                      {stepState === 'complete' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : stepState === 'rejected' ? (
                        <AlertCircle className="w-4 h-4 text-rose-400" />
                      ) : (
                        idx + 1
                      )}
                    </div>
                    <span className="text-[11px] font-semibold text-slate-300">{step.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* bKash Payment Information Card */}
          <div className="p-4 rounded-xl bg-[#0d0f14] border border-white/5 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#ff5722]" />
                bKash Manual Verification Record
              </span>
              <span className="font-mono text-emerald-400 font-bold">
                TrxID: {activeOrder.paymentVerification?.transactionId || 'N/A'}
              </span>
            </div>

            {activeOrder.paymentStatus === 'PENDING_VERIFICATION' && (
              <p className="text-[11px] text-amber-300/90 leading-relaxed pt-1">
                Our verification desk is auditing your transaction ID against the bKash merchant ledger.
                Once confirmed by the admin, your package will be immediately packed for courier pickup.
              </p>
            )}

            {activeOrder.paymentStatus === 'PAID' && (
              <p className="text-[11px] text-emerald-300/90 leading-relaxed pt-1">
                bKash transaction successfully verified by administrator on{' '}
                {activeOrder.paymentVerification?.verifiedAt
                  ? new Date(activeOrder.paymentVerification.verifiedAt).toLocaleString()
                  : 'recently'}
                .
              </p>
            )}

            {activeOrder.paymentStatus === 'REJECTED' && (
              <p className="text-[11px] text-rose-300/90 leading-relaxed pt-1">
                Payment rejected: {activeOrder.paymentVerification?.rejectionReason || 'Invalid Transaction ID'}.
                Please contact support at {siteSettings.contactPhone} to resolve this.
              </p>
            )}
          </div>

          {/* Delivery & Customer Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
            <div className="p-4 rounded-xl bg-[#0d0f14] border border-white/5">
              <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[10px] mb-2">
                Recipient &amp; Delivery Destination
              </h4>
              <p className="font-semibold text-white">{activeOrder.customer.fullName}</p>
              <p className="text-slate-400 mt-0.5">{activeOrder.customer.phone}</p>
              <p className="text-slate-300 mt-1 leading-relaxed">
                {activeOrder.customer.address}, {activeOrder.customer.city}
              </p>
              {activeOrder.customer.notes && (
                <p className="text-[11px] text-slate-500 mt-2 italic">
                  Note: "{activeOrder.customer.notes}"
                </p>
              )}
            </div>

            <div className="p-4 rounded-xl bg-[#0d0f14] border border-white/5 space-y-2">
              <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[10px] mb-2">
                Order Financials
              </h4>
              <div className="flex justify-between text-slate-400">
                <span>Items Subtotal</span>
                <span className="font-mono text-white">{formatPrice(activeOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Courier Charge</span>
                <span className="font-mono text-white">
                  {activeOrder.deliveryCharge === 0 ? 'FREE' : formatPrice(activeOrder.deliveryCharge)}
                </span>
              </div>
              <div className="pt-2 border-t border-white/10 flex justify-between font-bold text-white text-sm">
                <span>Total Amount</span>
                <span className="font-mono text-[#ff5722]">{formatPrice(activeOrder.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Items in this order */}
          <div className="pt-2">
            <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[10px] mb-3">
              Items Ordered ({activeOrder.items.length})
            </h4>
            <div className="divide-y divide-white/5">
              {activeOrder.items.map((item, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-10 h-10 rounded-lg object-cover bg-black/40 border border-white/10"
                    />
                    <div>
                      <span className="font-bold text-white block">{item.productName}</span>
                      <span className="text-[11px] text-slate-400">Quantity: {item.quantity}</span>
                    </div>
                  </div>
                  <span className="font-bold text-white font-mono">{formatPrice(item.total)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : hasSearched ? (
        <div className="p-12 text-center rounded-2xl bg-[#141721] border border-white/10">
          <AlertCircle className="w-10 h-10 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No matching order found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Please check the order number or telephone number and try again.
          </p>
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-[#141721] border border-white/10">
          <Package className="w-10 h-10 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No active order currently loaded</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Search with your order number above or explore our collection to place a new order.
          </p>
          <button
            onClick={() => setCurrentView('catalog')}
            className="mt-4 px-4 py-2 bg-[#ff5722] hover:bg-[#f4511e] text-white rounded-lg text-xs font-bold transition-colors"
          >
            Explore Catalogue
          </button>
        </div>
      )}
    </div>
  );
};

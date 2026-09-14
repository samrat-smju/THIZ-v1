import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Truck,
  ArrowLeft,
  Lock,
} from 'lucide-react';

export const CheckoutView: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    siteSettings,
    formatPrice,
    createOrder,
    setCurrentView,
    showToast,
  } = useStore();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Dhaka');
  const [notes, setNotes] = useState('');
  const [deliveryType, setDeliveryType] = useState<'standard' | 'express'>('standard');

  // bKash transaction fields
  const [trxId, setTrxId] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const deliveryCharge =
    cartSubtotal >= siteSettings.freeShippingThreshold
      ? 0
      : deliveryType === 'standard'
      ? siteSettings.deliveryChargeStandard
      : siteSettings.deliveryChargeExpress;

  const totalAmount = cartSubtotal + deliveryCharge;

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Your shopping bag is empty</h2>
        <p className="text-xs text-slate-400 mb-6">Add precision goods before proceeding to checkout.</p>
        <button
          onClick={() => setCurrentView('catalog')}
          className="px-5 py-2.5 bg-[#ff5722] hover:bg-[#f4511e] text-white rounded-xl text-xs font-bold transition-colors"
        >
          Browse Catalogue
        </button>
      </div>
    );
  }

  const handleCopyBkash = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(siteSettings.bkashNumber);
      setCopiedNumber(true);
      showToast('Number Copied', `${siteSettings.bkashNumber} copied to clipboard.`);
      setTimeout(() => setCopiedNumber(false), 2500);
    }
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !phone.trim() || !address.trim()) {
      showToast('Missing Details', 'Please provide full name, phone number, and delivery address.', 'error');
      return;
    }

    if (!trxId.trim() || trxId.length < 6) {
      showToast('bKash TrxID Required', 'Please enter a valid bKash Transaction ID (e.g. 9B87XYZ41).', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderItems = cart.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        productImage: item.product.images[0],
        price: item.product.price,
        quantity: item.quantity,
        total: item.product.price * item.quantity,
      }));

      const newOrder = createOrder({
        customer: {
          fullName,
          phone,
          email: email || undefined,
          address,
          city,
          notes: notes || undefined,
        },
        items: orderItems,
        subtotal: cartSubtotal,
        deliveryCharge,
        discount: 0,
        totalAmount,
        paymentMethod: 'BKASH_MANUAL',
        paymentStatus: 'PENDING_VERIFICATION',
        orderStatus: 'PENDING_VERIFICATION',
        paymentVerification: {
          transactionId: trxId.trim().toUpperCase(),
          senderPhone: senderPhone.trim() || phone.trim(),
          submittedAt: new Date().toISOString(),
        },
      });

      showToast(
        'Order Placed Successfully',
        `Order ${newOrder.orderNumber} is pending bKash verification.`,
        'success'
      );

      setCurrentView('order-tracking');
    } catch (err) {
      console.error(err);
      showToast('Order Failed', 'Could not process order. Please check inputs.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="checkout-view-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <div className="mb-6">
        <button
          onClick={() => setCurrentView('cart')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Bag</span>
        </button>
      </div>

      <div className="border-b border-white/10 pb-6 mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Checkout &amp; bKash Payment
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Complete your customer information and send payment via bKash.
        </p>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Form: Delivery & Contact */}
        <div className="lg:col-span-7 space-y-6">
          {/* Customer Info Card */}
          <div className="p-6 rounded-2xl bg-[#141721] border border-white/10 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#ff5722] text-black text-xs font-black flex items-center justify-center">1</span>
              <span>Customer Information</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Samrat Sheikh"
                  className="w-full bg-[#0d0f14] border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#ff5722]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Contact Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 01712345678"
                  className="w-full bg-[#0d0f14] border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#ff5722]"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="block text-slate-300 font-semibold mb-1">
                Email Address (for dispatch receipt)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. samrat@example.com"
                className="w-full bg-[#0d0f14] border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#ff5722]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block text-slate-300 font-semibold mb-1">
                  Delivery Address *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House/Apartment, Road, Area"
                  className="w-full bg-[#0d0f14] border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#ff5722]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  City / Region *
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-[#0d0f14] border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#ff5722]"
                >
                  <option value="Dhaka">Dhaka</option>
                  <option value="Chittagong">Chittagong</option>
                  <option value="Sylhet">Sylhet</option>
                  <option value="Rajshahi">Rajshahi</option>
                  <option value="Khulna">Khulna</option>
                  <option value="Barisal">Barisal</option>
                  <option value="Rangpur">Rangpur</option>
                </select>
              </div>
            </div>

            <div className="text-xs">
              <label className="block text-slate-300 font-semibold mb-1">
                Special Courier Notes (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Leave with concierge or call before delivery"
                className="w-full bg-[#0d0f14] border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#ff5722]"
              />
            </div>
          </div>

          {/* Delivery Method Selection */}
          <div className="p-6 rounded-2xl bg-[#141721] border border-white/10 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#ff5722] text-black text-xs font-black flex items-center justify-center">2</span>
              <span>Delivery Method</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <label
                onClick={() => setDeliveryType('standard')}
                className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                  deliveryType === 'standard'
                    ? 'bg-[#1b202e] border-[#ff5722] ring-1 ring-[#ff5722]'
                    : 'bg-[#0d0f14] border-white/10 hover:border-white/20'
                }`}
              >
                <Truck className="w-5 h-5 text-[#ff5722] shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex justify-between font-bold text-white">
                    <span>Standard Courier (2-3 Days)</span>
                    <span className="font-mono">
                      {cartSubtotal >= siteSettings.freeShippingThreshold
                        ? 'FREE'
                        : formatPrice(siteSettings.deliveryChargeStandard)}
                    </span>
                  </div>
                  <p className="text-slate-400 mt-1 text-[11px]">Nationwide safe courier dispatch</p>
                </div>
              </label>

              <label
                onClick={() => setDeliveryType('express')}
                className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                  deliveryType === 'express'
                    ? 'bg-[#1b202e] border-[#ff5722] ring-1 ring-[#ff5722]'
                    : 'bg-[#0d0f14] border-white/10 hover:border-white/20'
                }`}
              >
                <Truck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex justify-between font-bold text-white">
                    <span>Express Priority (24-Hour)</span>
                    <span className="font-mono">
                      {cartSubtotal >= siteSettings.freeShippingThreshold
                        ? 'FREE'
                        : formatPrice(siteSettings.deliveryChargeExpress)}
                    </span>
                  </div>
                  <p className="text-slate-400 mt-1 text-[11px]">Same-day packaging &amp; priority flight</p>
                </div>
              </label>
            </div>
          </div>

          {/* bKash Manual Payment Instruction Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#200f1c] via-[#17121c] to-[#141721] border border-[#e2136e]/30 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#e2136e] text-white text-xs font-black flex items-center justify-center">3</span>
                <span>bKash Manual Verification Payment</span>
              </h2>
              <span className="px-2 py-0.5 text-[10px] uppercase font-bold bg-[#e2136e]/20 text-[#ff79b0] rounded border border-[#e2136e]/40">
                Official Method
              </span>
            </div>

            {/* bKash Instructions Box */}
            <div className="p-4 rounded-xl bg-black/40 border border-[#e2136e]/20 space-y-3 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    {siteSettings.bkashAccountType} Number:
                  </span>
                  <p className="text-lg font-black text-white font-mono tracking-wider">
                    {siteSettings.bkashNumber}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCopyBkash}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 transition-colors self-start sm:self-center"
                >
                  {copiedNumber ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedNumber ? 'Copied' : 'Copy Number'}</span>
                </button>
              </div>

              <div className="space-y-1.5 text-slate-300">
                <p className="font-semibold text-white">How to pay with bKash:</p>
                <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-400">
                  <li>Open the <strong>bKash App</strong> or dial *247# on your mobile device.</li>
                  <li>Choose <strong>{siteSettings.bkashAccountType === 'Merchant' ? 'Make Payment' : 'Send Money'}</strong>.</li>
                  <li>Recipient: <strong className="text-white font-mono">{siteSettings.bkashNumber}</strong></li>
                  <li>Amount: <strong className="text-[#ff5722] font-mono text-sm">{formatPrice(totalAmount)}</strong></li>
                  <li>Reference: <strong className="text-white">THIZ</strong></li>
                  <li>Confirm transaction with your bKash PIN.</li>
                </ol>
              </div>
            </div>

            {/* Enter Transaction ID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
              <div>
                <label className="block text-slate-200 font-bold mb-1">
                  bKash Transaction ID (TrxID) *
                </label>
                <input
                  type="text"
                  required
                  value={trxId}
                  onChange={(e) => setTrxId(e.target.value)}
                  placeholder="e.g. 9B87XYZ41"
                  className="w-full bg-[#0d0f14] border border-[#e2136e]/40 focus:border-[#e2136e] rounded-xl px-3.5 py-2.5 text-white uppercase font-mono tracking-wider placeholder:normal-case placeholder:font-sans focus:outline-none"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Found in your bKash SMS confirmation.</span>
              </div>

              <div>
                <label className="block text-slate-200 font-bold mb-1">
                  Sender bKash Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  value={senderPhone}
                  onChange={(e) => setSenderPhone(e.target.value)}
                  placeholder="e.g. 01XXXXXXXXX"
                  className="w-full bg-[#0d0f14] border border-white/10 rounded-xl px-3.5 py-2.5 text-white font-mono placeholder:font-sans focus:outline-none focus:border-[#ff5722]"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Helpful for faster manual verification.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-[#141721] border border-white/10 space-y-4 shadow-xl sticky top-24">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Order Summary ({cart.length} item{cart.length > 1 ? 's' : ''})
            </h2>

            {/* Item List */}
            <div className="max-h-64 overflow-y-auto space-y-3 divide-y divide-white/5 pr-1">
              {cart.map(({ product, quantity }) => (
                <div key={product.id} className="pt-3 first:pt-0 flex items-center gap-3 text-xs">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-12 h-12 rounded-lg object-cover bg-black/40 border border-white/10 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-white truncate">{product.name}</h4>
                    <p className="text-[11px] text-slate-400">Qty: {quantity}</p>
                  </div>
                  <span className="font-bold text-white font-mono shrink-0">
                    {formatPrice(product.price * quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="pt-4 border-t border-white/10 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Bag Subtotal</span>
                <span className="font-semibold text-white font-mono">{formatPrice(cartSubtotal)}</span>
              </div>

              <div className="flex justify-between text-slate-400">
                <span>Courier Delivery</span>
                <span className="font-semibold text-emerald-400 font-mono">
                  {deliveryCharge === 0 ? 'FREE' : formatPrice(deliveryCharge)}
                </span>
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-between text-base font-extrabold text-white">
                <span>Grand Total</span>
                <span className="text-lg text-[#ff5722] font-mono">{formatPrice(totalAmount)}</span>
              </div>
            </div>

            {/* Submit Order Button */}
            <button
              id="submit-bkash-order-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#ff5722] to-[#e5a93c] hover:opacity-95 text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-[#ff5722]/20 transition-transform active:scale-95 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4 fill-black" />
              <span>{isSubmitting ? 'Submitting Order...' : 'Submit Order for Verification'}</span>
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 pt-2 text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Order enters PENDING_VERIFICATION until manual review</span>
            </div>

            <div className="pt-3 border-t border-white/5 flex items-center justify-center gap-2 text-[10px] text-slate-500">
              <Lock className="w-3 h-3" />
              <span>256-bit encrypted checkout transmission</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

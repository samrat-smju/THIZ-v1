import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Lock,
  Mail,
  ArrowRight,
  Phone,
  MapPin,
} from 'lucide-react';
import { ThizLogo } from '../ui/ThizLogo';

export const Footer: React.FC = () => {
  const {
    siteSettings,
    categories,
    setActiveCategory,
    setCurrentView,
    showToast,
  } = useStore();

  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes('@')) {
      showToast('Invalid Email', 'Please provide a valid email address.', 'error');
      return;
    }
    setSubscribed(true);
    showToast('Subscribed to THIZ Editions', 'Thank you for joining our private releases list.');
    setEmailInput('');
  };

  return (
    <footer id="main-footer" className="bg-[#090b0e] border-t border-white/8 text-slate-400 text-xs">
      {/* Trust & Guarantee Banner */}
      <div className="border-b border-white/5 bg-[#0e1017]/60 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#141721] border border-white/10 flex items-center justify-center shrink-0 text-[#ff5722]">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-white text-xs uppercase tracking-wider">Fast Courier Delivery</h5>
              <p className="text-[11px] text-slate-400 mt-0.5">Nationwide coverage with live tracking</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#141721] border border-white/10 flex items-center justify-center shrink-0 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-white text-xs uppercase tracking-wider">bKash Verified Checkout</h5>
              <p className="text-[11px] text-slate-400 mt-0.5">Secure manual merchant verification</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#141721] border border-white/10 flex items-center justify-center shrink-0 text-[#e5a93c]">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-white text-xs uppercase tracking-wider">7-Day Replacement</h5>
              <p className="text-[11px] text-slate-400 mt-0.5">Zero hassle warranty guarantee</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#141721] border border-white/10 flex items-center justify-center shrink-0 text-sky-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-white text-xs uppercase tracking-wider">Official THIZ Warranty</h5>
              <p className="text-[11px] text-slate-400 mt-0.5">Genuine authentic engineered goods</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <ThizLogo size="md" />
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              THIZ designs and engineers high-grade everyday tools, acoustics, and architectural work accessories.
              Built for discerning minimalists who value tactile precision and acoustic clarity.
            </p>

            <div className="space-y-2 pt-2 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-[#ff5722] shrink-0" />
                <span>{siteSettings.businessAddress}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-3.5 h-3.5 text-[#ff5722] shrink-0" />
                <span>{siteSettings.contactPhone}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-3.5 h-3.5 text-[#ff5722] shrink-0" />
                <span>{siteSettings.contactEmail}</span>
              </div>
            </div>
          </div>

          {/* Categories Col */}
          <div>
            <h6 className="font-bold text-white text-xs uppercase tracking-wider mb-4">
              Categories
            </h6>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => {
                    setActiveCategory(null);
                    setCurrentView('catalog');
                  }}
                  className="hover:text-white transition-colors"
                >
                  All Products
                </button>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => {
                      setActiveCategory(cat.name);
                      setCurrentView('catalog');
                    }}
                    className="hover:text-white transition-colors"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer & Orders Col */}
          <div>
            <h6 className="font-bold text-white text-xs uppercase tracking-wider mb-4">
              Assistance
            </h6>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => setCurrentView('order-tracking')}
                  className="hover:text-white transition-colors"
                >
                  Track Order Status
                </button>
              </li>
              <li>
                <span className="text-slate-400">bKash Manual Instructions</span>
              </li>
              <li>
                <span className="text-slate-400">Shipping Policy &amp; Rates</span>
              </li>
              <li>
                <span className="text-slate-400">Warranty &amp; Replacements</span>
              </li>
              <li>
                <span className="text-slate-400">Privacy &amp; Terms</span>
              </li>
            </ul>
          </div>

          {/* Newsletter / Notifications Col */}
          <div>
            <h6 className="font-bold text-white text-xs uppercase tracking-wider mb-2">
              THIZ Editions
            </h6>
            <p className="text-[11px] text-slate-400 mb-3">
              Subscribe for private batch drops, titanium releases, and early access.
            </p>

            {subscribed ? (
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
                You are registered for upcoming drops.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Enter email address"
                    className="w-full bg-[#141721] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#ff5722]"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1 bottom-1 px-2.5 bg-[#ff5722] hover:bg-[#f4511e] text-white rounded-md flex items-center justify-center transition-colors"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}

            <div className="mt-5 pt-3 border-t border-white/5">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                Official bKash Payment
              </span>
              <p className="text-[11px] text-slate-300 font-mono">
                {siteSettings.bkashAccountType}: {siteSettings.bkashNumber}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Admin Portal Access */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} THIZ Modern Commerce. All rights reserved.</p>

          <div className="flex items-center gap-4">
            <button
              id="footer-admin-login-link"
              onClick={() => setCurrentView('admin')}
              className="flex items-center gap-1 text-slate-500 hover:text-[#ff5722] transition-colors"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Owner Admin Access</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Sparkles, X, ShieldCheck } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const { siteSettings } = useStore();
  const [dismissed, setDismissed] = useState(false);

  if (!siteSettings.announcementActive || dismissed) return null;

  return (
    <div
      id="store-announcement-bar"
      className="relative z-40 bg-gradient-to-r from-[#141721] via-[#1f1728] to-[#141721] border-b border-white/5 py-2 px-4 text-xs"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left assurance badge */}
        <div className="hidden md:flex items-center gap-1.5 text-emerald-400 font-medium tracking-wide">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Official Verified Store</span>
        </div>

        {/* Center message */}
        <div className="flex-1 flex items-center justify-center gap-2 text-center text-slate-200">
          <Sparkles className="w-3.5 h-3.5 text-[#ff5722] shrink-0 animate-pulse" />
          <p className="font-medium truncate">
            {siteSettings.announcementText}
          </p>
          <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-[#e2136e]/20 text-[#ff79b0] border border-[#e2136e]/40">
            bKash Ready
          </span>
        </div>

        {/* Right close action */}
        <div className="flex items-center gap-2">
          <button
            id="announcement-close-btn"
            onClick={() => setDismissed(true)}
            className="p-1 text-slate-400 hover:text-slate-100 rounded transition-colors"
            title="Dismiss announcement"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

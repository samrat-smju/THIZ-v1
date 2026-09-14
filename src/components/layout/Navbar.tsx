import React, { useState, useEffect, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Search,
  ShoppingBag,
  Menu,
  X,
  Lock,
  ChevronRight,
  Package,
  ExternalLink,
} from 'lucide-react';
import { ThizLogo } from '../ui/ThizLogo';
import { NavItem, ViewState } from '../../types';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    activeCategory,
    setActiveCategory,
    siteSettings,
    setIsSearchOpen,
    isCartOpen,
    setIsCartOpen,
    cartCount,
  } = useStore();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard shortcut ⌘K / Ctrl+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsSearchOpen]);

  // Sorted and visible navigation items
  const activeNavItems = useMemo(() => {
    const items = siteSettings.navItems || [];
    return items
      .filter((item) => item.visible !== false)
      .sort((a, b) => a.order - b.order);
  }, [siteSettings.navItems]);

  const handleNavClick = (item: NavItem) => {
    setMobileMenuOpen(false);

    if (item.type === 'view') {
      if (item.target === 'catalog') {
        setActiveCategory(null);
      }
      setCurrentView(item.target as ViewState);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (item.type === 'category') {
      setActiveCategory(item.target);
      setCurrentView('catalog');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (item.type === 'custom') {
      if (item.target.startsWith('http://') || item.target.startsWith('https://')) {
        window.open(item.target, '_blank', 'noopener,noreferrer');
      } else {
        // Assume view or anchor
        setCurrentView(item.target as ViewState);
      }
    }
  };

  const isItemActive = (item: NavItem) => {
    if (item.type === 'view') {
      if (item.target === 'catalog' && activeCategory !== null) {
        return false;
      }
      return currentView === item.target;
    }
    if (item.type === 'category') {
      return currentView === 'catalog' && activeCategory === item.target;
    }
    return false;
  };

  return (
    <header
      id="main-navigation-header"
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0b0d13]/90 backdrop-blur-xl border-b border-white/10 shadow-2xl py-2.5'
          : 'bg-[#0b0d13]/50 backdrop-blur-md border-b border-white/5 py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <button
            id="nav-brand-logo"
            onClick={() => {
              setCurrentView('home');
              setMobileMenuOpen(false);
            }}
            className="text-left group focus:outline-none"
          >
            <ThizLogo size="md" />
          </button>

          {/* Dynamic Desktop Navigation Links */}
          <nav id="desktop-nav-links" className="hidden lg:flex items-center gap-1 xl:gap-1.5">
            {activeNavItems.map((item) => {
              const active = isItemActive(item);
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all relative flex items-center gap-1.5 ${
                    active
                      ? 'text-white bg-white/10 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.target === 'order-tracking' && <Package className="w-3.5 h-3.5 text-slate-400" />}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] px-1.5 py-0.2 bg-[#ff5722] text-white font-bold rounded-full">
                      {item.badge}
                    </span>
                  )}
                  {item.type === 'custom' && item.target.startsWith('http') && (
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Search Trigger */}
            <button
              id="nav-search-button"
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#141721] hover:bg-[#1b202e] border border-white/10 text-slate-300 hover:text-white text-xs transition-all shadow-sm"
              title="Search products (⌘K)"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Search goods...</span>
              <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white/5 rounded border border-white/10">
                ⌘K
              </kbd>
            </button>

            {/* Cart Button with Animated Count */}
            <button
              id="nav-cart-toggle-btn"
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="relative p-2 rounded-lg bg-[#141721] hover:bg-[#1b202e] border border-white/10 text-white transition-all shadow-sm focus:outline-none"
              aria-label="Open shopping cart"
            >
              <ShoppingBag className="w-4 h-4 text-slate-200" />
              {cartCount > 0 && (
                <span
                  id="nav-cart-badge-count"
                  className="absolute -top-1.5 -right-1.5 bg-[#ff5722] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-lg shadow-[#ff5722]/50 animate-bounce"
                >
                  {cartCount}
                </span>
              )}
            </button>

            {/* Admin Portal Gateway (subtle, accessible) */}
            <button
              id="nav-admin-portal-btn"
              onClick={() => setCurrentView('admin')}
              className={`p-2 rounded-lg border transition-all ${
                currentView === 'admin'
                  ? 'bg-[#ff5722]/20 border-[#ff5722]/40 text-[#ff5722]'
                  : 'bg-[#141721] border-white/10 text-slate-400 hover:text-slate-200 hover:bg-[#1b202e]'
              }`}
              title="Admin Portal"
            >
              <Lock className="w-4 h-4" />
            </button>

            {/* Mobile Hamburger Menu */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-[#141721] text-slate-200 hover:text-white border border-white/10"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown/Drawer */}
        {mobileMenuOpen && (
          <div
            id="mobile-navigation-drawer"
            className="lg:hidden mt-3 pt-4 pb-6 border-t border-white/10 flex flex-col gap-2 animate-in fade-in slide-in-from-top-3 duration-200"
          >
            {activeNavItems.map((item) => {
              const active = isItemActive(item);
              return (
                <button
                  key={item.id}
                  id={`mobile-nav-${item.id}`}
                  onClick={() => handleNavClick(item)}
                  className={`flex items-center justify-between p-3 rounded-xl text-sm font-semibold transition-colors ${
                    active ? 'bg-[#ff5722]/15 text-[#ff5722]' : 'text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {item.target === 'order-tracking' && <Package className="w-4 h-4 text-slate-400" />}
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-[#ff5722] text-white font-bold rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>
              );
            })}

            <div className="pt-2 border-t border-white/5">
              <button
                id="mobile-nav-admin"
                onClick={() => {
                  setCurrentView('admin');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-between w-full p-3 rounded-xl text-sm font-medium text-[#ff5722] hover:bg-[#ff5722]/10 mt-1"
              >
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  <span>Admin Management Panel</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#ff5722]" />
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};


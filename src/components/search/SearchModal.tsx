import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { Search, X, ArrowRight, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const SearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    products,
    categories,
    navigateToProduct,
    formatPrice,
    setActiveCategory,
    setCurrentView,
  } = useStore();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsSearchOpen]);

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }, [products, query]);

  const handleSelectProduct = (productId: string) => {
    setIsSearchOpen(false);
    navigateToProduct(productId);
  };

  const handleSelectCategory = (catName: string) => {
    setActiveCategory(catName);
    setCurrentView('catalog');
    setIsSearchOpen(false);
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <div id="search-modal-container" className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSearchOpen(false)}
            className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -20 }}
            transition={{ duration: 0.2 }}
            className="relative mx-auto max-w-2xl transform divide-y divide-white/10 overflow-hidden rounded-2xl bg-[#141721] border border-white/15 shadow-2xl"
          >
            {/* Search Input Bar */}
            <div className="relative flex items-center p-4">
              <Search className="w-5 h-5 text-slate-400 shrink-0 ml-1" />
              <input
                ref={inputRef}
                id="search-input-field"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search headphones, timepieces, workspace docks..."
                className="w-full bg-transparent border-0 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-0"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="p-1 text-slate-400 hover:text-white rounded transition-colors mr-2"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-white/5 rounded border border-white/10">
                ESC
              </kbd>
            </div>

            {/* Quick Categories Bar */}
            <div className="p-3 bg-[#0d0f14]/50 flex items-center gap-1.5 overflow-x-auto text-xs">
              <span className="text-slate-500 text-[11px] font-semibold px-2 shrink-0 flex items-center gap-1">
                <Tag className="w-3 h-3" /> Categories:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleSelectCategory(cat.name)}
                  className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white whitespace-nowrap text-[11px] transition-colors"
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Results Area */}
            <div className="max-h-96 overflow-y-auto p-3">
              {query.trim() === '' ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  <p>Type keywords to search THIZ precision products</p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {['Titanium', 'Beryllium Drivers', 'ANC', 'Wireless Dock', 'Desk Lamp'].map(
                      (suggest) => (
                        <button
                          key={suggest}
                          onClick={() => setQuery(suggest)}
                          className="px-2.5 py-1 rounded-md bg-[#1b202e] text-slate-300 hover:text-white text-xs border border-white/5 transition-colors"
                        >
                          {suggest}
                        </button>
                      )
                    )}
                  </div>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <p className="text-sm font-semibold">No matching goods found</p>
                  <p className="text-xs text-slate-500 mt-1">Try adjusting your query or exploring our categories above.</p>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 py-1">
                    Found {filteredProducts.length} Product{filteredProducts.length > 1 ? 's' : ''}
                  </p>
                  {filteredProducts.map((prod) => (
                    <button
                      key={prod.id}
                      id={`search-result-${prod.id}`}
                      onClick={() => handleSelectProduct(prod.id)}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 text-left transition-colors group"
                    >
                      <img
                        src={prod.images[0]}
                        alt={prod.name}
                        className="w-12 h-12 rounded-lg object-cover bg-black/40 border border-white/10 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-white group-hover:text-[#ff5722] truncate transition-colors">
                            {prod.name}
                          </h4>
                          <span className="text-xs font-bold text-white font-mono shrink-0 ml-2">
                            {formatPrice(prod.price)}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {prod.shortDescription}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

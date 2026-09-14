import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  SlidersHorizontal,
  ArrowUpDown,
  ShoppingBag,
  Eye,
  Sparkles,
  Search,
  X,
} from 'lucide-react';

export const ProductCatalog: React.FC = () => {
  const {
    products,
    categories,
    activeCategory,
    setActiveCategory,
    navigateToProduct,
    addToCart,
    formatPrice,
  } = useStore();

  const [searchFilter, setSearchFilter] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Category filter
        if (activeCategory && product.category !== activeCategory) {
          return false;
        }
        // In-stock filter
        if (inStockOnly && product.stock <= 0) {
          return false;
        }
        // Search filter
        if (searchFilter.trim()) {
          const q = searchFilter.toLowerCase();
          const matchName = product.name.toLowerCase().includes(q);
          const matchDesc = product.shortDescription.toLowerCase().includes(q);
          const matchSku = product.sku.toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchSku) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [products, activeCategory, inStockOnly, searchFilter, sortBy]);

  return (
    <div id="catalogue-view-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="border-b border-white/10 pb-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-[#ff5722] mb-1">
              Curated Catalogue
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {activeCategory ? activeCategory : 'All Precision Goods'}
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Precision acoustic equipment, CNC machined workspace gear, and timepieces.
            </p>
          </div>

          <span className="text-xs text-slate-400 font-mono">
            Showing <strong className="text-white">{filteredProducts.length}</strong> products
          </span>
        </div>
      </div>

      {/* Filter & Controls Bar */}
      <div className="bg-[#141721] rounded-2xl border border-white/10 p-4 mb-8 space-y-4 shadow-lg">
        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategory === null
                ? 'bg-[#ff5722] text-white shadow-md shadow-[#ff5722]/20'
                : 'bg-white/5 hover:bg-white/10 text-slate-300'
            }`}
          >
            All Categories ({products.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.name)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat.name
                  ? 'bg-[#ff5722] text-white shadow-md shadow-[#ff5722]/20'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Secondary Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/5 text-xs">
          {/* Search inside catalog */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filter by name, specs or SKU..."
              className="w-full bg-[#0d0f14] border border-white/10 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#ff5722]"
            />
            {searchFilter && (
              <button
                onClick={() => setSearchFilter('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* In stock toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300 hover:text-white">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded bg-[#0d0f14] border-white/20 text-[#ff5722] focus:ring-0 focus:ring-offset-0"
              />
              <span>In Stock Only</span>
            </label>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 bg-[#0d0f14] border border-white/10 rounded-xl px-3 py-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent border-0 text-xs text-white focus:outline-none cursor-pointer pr-1"
              >
                <option value="featured" className="bg-[#141721] text-white">Featured First</option>
                <option value="price-asc" className="bg-[#141721] text-white">Price: Low to High</option>
                <option value="price-desc" className="bg-[#141721] text-white">Price: High to Low</option>
                <option value="rating" className="bg-[#141721] text-white">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-[#141721]/50 border border-white/5 p-8">
          <SlidersHorizontal className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No products match your criteria</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try clearing active filters or switching categories to explore the full THIZ collection.
          </p>
          <button
            onClick={() => {
              setActiveCategory(null);
              setSearchFilter('');
              setInStockOnly(false);
            }}
            className="mt-4 px-4 py-2 bg-[#ff5722] hover:bg-[#f4511e] text-white rounded-lg text-xs font-bold transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              id={`catalog-product-${product.id}`}
              className="group rounded-2xl bg-[#141721] border border-white/8 hover:border-white/20 transition-all overflow-hidden flex flex-col justify-between shadow-lg"
            >
              {/* Product Visual */}
              <div
                className="relative aspect-[4/3] bg-black/40 overflow-hidden cursor-pointer"
                onClick={() => navigateToProduct(product.id)}
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1">
                  {product.discountPercentage && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#ff5722] text-white tracking-wide">
                      -{product.discountPercentage}%
                    </span>
                  )}
                  {product.has3dModel && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-black/60 backdrop-blur-md text-slate-200 border border-white/10 tracking-wide flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 text-[#ff5722]" /> 3D View
                    </span>
                  )}
                </div>

                <div className="absolute top-3 right-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#0b0d13]/80 backdrop-blur-md text-slate-300 border border-white/10">
                    {product.category}
                  </span>
                </div>
              </div>

              {/* Details & Actions */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span>SKU: {product.sku}</span>
                    <span className="text-amber-400 font-semibold">★ {product.rating} ({product.reviewCount})</span>
                  </div>

                  <h3
                    onClick={() => navigateToProduct(product.id)}
                    className="text-sm font-bold text-white hover:text-[#ff5722] transition-colors cursor-pointer"
                  >
                    {product.name}
                  </h3>

                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {product.shortDescription}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-base font-extrabold text-white font-mono">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-slate-500 line-through font-mono">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-[10px] font-medium ${
                        product.stock > 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigateToProduct(product.id)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
                      title="Inspect Product"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => addToCart(product)}
                      disabled={product.stock <= 0}
                      className="px-3 py-2 rounded-lg bg-[#ff5722] hover:bg-[#f4511e] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold tracking-wide flex items-center gap-1.5 transition-colors shadow-md shadow-[#ff5722]/20"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{product.stock > 0 ? 'Add' : 'Sold Out'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

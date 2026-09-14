import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductViewer3D } from '../3d/ProductViewer3D';
import {
  ArrowLeft,
  ShoppingBag,
  Zap,
  CheckCircle2,
  Truck,
  RotateCcw,
  Sparkles,
  Plus,
  Minus,
  Box,
  Share2,
} from 'lucide-react';

export const ProductDetailView: React.FC = () => {
  const {
    selectedProductId,
    products,
    setCurrentView,
    addToCart,
    formatPrice,
    navigateToProduct,
    showToast,
  } = useStore();

  const product = products.find((p) => p.id === selectedProductId) || products[0];
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'gallery' | '3d'>('gallery');
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-slate-400">Product not found.</p>
        <button
          onClick={() => setCurrentView('catalog')}
          className="mt-4 px-4 py-2 bg-[#ff5722] text-white rounded-lg text-xs font-bold"
        >
          Return to Catalogue
        </button>
      </div>
    );
  }

  const relatedProducts = products.filter(
    (p) => p.id !== product.id && p.category === product.category
  );

  const handleBuyNow = () => {
    const success = addToCart(product, quantity);
    if (success) {
      setCurrentView('checkout');
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link Copied', 'Product URL copied to clipboard.');
    }
  };

  return (
    <div id="product-detail-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <div className="mb-6 flex items-center justify-between">
        <button
          id="product-back-btn"
          onClick={() => setCurrentView('catalog')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalogue</span>
        </button>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share</span>
        </button>
      </div>

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Visual Gallery or 3D Interactive Stage */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Visual Stage */}
          <div className="relative aspect-[4/3] rounded-2xl bg-[#141721] border border-white/10 overflow-hidden shadow-2xl">
            {viewMode === '3d' && product.has3dModel ? (
              <ProductViewer3D
                modelType={product.category.includes('Watch') ? 'chronograph' : 'headphones'}
                accentColor="#ff5722"
                className="w-full h-full"
              />
            ) : (
              <img
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            )}

            {/* Mode Switcher Buttons (Gallery vs 3D) */}
            {product.has3dModel && (
              <div className="absolute top-4 left-4 z-20 flex items-center gap-1 p-1 bg-black/60 backdrop-blur-md rounded-xl border border-white/10 text-xs font-semibold">
                <button
                  onClick={() => setViewMode('gallery')}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                    viewMode === 'gallery'
                      ? 'bg-white/20 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Box className="w-3.5 h-3.5" />
                  <span>Photos</span>
                </button>
                <button
                  onClick={() => setViewMode('3d')}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                    viewMode === '3d'
                      ? 'bg-[#ff5722] text-white shadow-md shadow-[#ff5722]/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Interactive 3D</span>
                </button>
              </div>
            )}
          </div>

          {/* Thumbnail Selector */}
          {product.images.length > 1 && viewMode === 'gallery' && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden bg-black/40 border transition-all shrink-0 ${
                    selectedImageIndex === idx
                      ? 'border-[#ff5722] ring-2 ring-[#ff5722]/30'
                      : 'border-white/10 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Pricing, Specs, Stock & Add to Cart */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-semibold text-[#ff5722] uppercase tracking-wider">{product.category}</span>
              <span className="font-mono">SKU: {product.sku}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
              {product.name}
            </h1>

            {/* Price section */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-black text-white font-mono">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-base text-slate-500 line-through font-mono">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              {product.discountPercentage && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#ff5722]/20 text-[#ff5722] border border-[#ff5722]/30">
                  Save {product.discountPercentage}%
                </span>
              )}
            </div>

            {/* Stock indicator */}
            <div className="mt-3 flex items-center gap-2 text-xs">
              {product.stock > 0 ? (
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> In Stock ({product.stock} units available)
                </span>
              ) : (
                <span className="text-rose-400 font-semibold">Out of Stock</span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="border-t border-b border-white/5 py-4">
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Quantity & Buy Actions */}
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Quantity</span>
              <div className="flex items-center border border-white/10 rounded-xl bg-[#141721]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-white/10 text-slate-300 rounded-l-xl transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 text-xs font-bold text-white min-w-[32px] text-center font-mono">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                  className="p-2 hover:bg-white/10 text-slate-300 rounded-r-xl transition-colors disabled:opacity-30"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                id="product-add-to-cart-btn"
                onClick={() => addToCart(product, quantity)}
                disabled={product.stock <= 0}
                className="w-full py-3 px-4 rounded-xl bg-[#141721] hover:bg-[#1b202e] border border-white/10 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-4 h-4 text-[#ff5722]" />
                <span>Add to Bag</span>
              </button>

              <button
                id="product-buy-now-btn"
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#ff5722] to-[#e5a93c] hover:opacity-95 text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#ff5722]/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
              >
                <Zap className="w-4 h-4 fill-black" />
                <span>Buy Now</span>
              </button>
            </div>
          </div>

          {/* Guarantee Badges */}
          <div className="grid grid-cols-2 gap-3 pt-2 text-[11px] text-slate-400">
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#141721] border border-white/5">
              <Truck className="w-4 h-4 text-[#ff5722] shrink-0" />
              <span>Complimentary shipping over ৳2,000</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#141721] border border-white/5">
              <RotateCcw className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>7-Day Replacement Guarantee</span>
            </div>
          </div>

          {/* Specifications Table */}
          {product.specifications && product.specifications.length > 0 && (
            <div className="pt-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
                Technical Specifications
              </h3>
              <div className="rounded-xl bg-[#141721] border border-white/5 divide-y divide-white/5 overflow-hidden text-xs">
                {product.specifications.map((spec, i) => (
                  <div key={i} className="flex items-center justify-between p-3">
                    <span className="text-slate-400">{spec.label}</span>
                    <span className="font-semibold text-white font-mono">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-20 border-t border-white/10 pt-12">
          <h2 className="text-lg font-bold text-white tracking-tight mb-6">
            Complementary Goods from {product.category}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.slice(0, 3).map((relProd) => (
              <div
                key={relProd.id}
                onClick={() => navigateToProduct(relProd.id)}
                className="group rounded-xl bg-[#141721] border border-white/5 hover:border-white/20 p-4 cursor-pointer transition-all"
              >
                <img
                  src={relProd.images[0]}
                  alt={relProd.name}
                  className="w-full aspect-[4/3] rounded-lg object-cover bg-black/40 mb-3 group-hover:scale-105 transition-transform"
                />
                <h3 className="text-xs font-bold text-white group-hover:text-[#ff5722] transition-colors truncate">
                  {relProd.name}
                </h3>
                <p className="text-xs font-extrabold text-white font-mono mt-1">
                  {formatPrice(relProd.price)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

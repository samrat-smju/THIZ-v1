import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductViewer3D } from '../3d/ProductViewer3D';
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Sliders,
  Sparkles,
  ShoppingBag,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { motion } from 'motion/react';

export const Phase1Hero: React.FC = () => {
  const {
    products,
    categories,
    setActiveCategory,
    setCurrentView,
    navigateToProduct,
    addToCart,
    formatPrice,
  } = useStore();

  const featuredProduct = products.find((p) => p.featured) || products[0];

  return (
    <div className="relative overflow-hidden pt-4 pb-16">
      {/* Background radial gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none opacity-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#ff5722]/20 via-[#e5a93c]/5 to-transparent blur-3xl" />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-4 lg:pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Brand Statement & CTAs */}
          <div className="lg:col-span-6 space-y-6">
            {/* Top Brand Pill */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold tracking-wide text-slate-300"
            >
              <span className="w-2 h-2 rounded-full bg-[#ff5722] animate-ping" />
              <span className="text-[#ff5722] uppercase tracking-wider font-bold text-[10px]">THIZ Edition 01</span>
              <span className="text-slate-500">•</span>
              <span>Aerospace Aluminum &amp; Titanium</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]"
            >
              Precision Tools <br />
              <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                For Discerning Hands.
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-xl"
            >
              Acoustic monitors with custom beryllium diaphragms, Grade 5 titanium horology, and billet aluminum desktop accessories. Built for tactile permanence.
            </motion.p>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center gap-3 pt-2"
            >
              <button
                id="hero-explore-catalog-btn"
                onClick={() => {
                  setActiveCategory(null);
                  setCurrentView('catalog');
                }}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#ff5722] to-[#e5a93c] hover:opacity-95 text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-[#ff5722]/20 transition-transform active:scale-95"
              >
                <span>Explore Catalogue</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-inspect-details-btn"
                onClick={() => navigateToProduct(featuredProduct.id)}
                className="px-6 py-3 rounded-xl bg-[#141721] hover:bg-[#1b202e] text-white border border-white/10 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors"
              >
                <Eye className="w-4 h-4 text-slate-400" />
                <span>Product Specs</span>
              </button>
            </motion.div>

            {/* Micro Trust Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5"
            >
              <div>
                <p className="text-xl sm:text-2xl font-extrabold text-white font-mono">42 hrs</p>
                <p className="text-[11px] text-slate-400 mt-0.5">ANC Continuous Playback</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-extrabold text-white font-mono">Grade 5</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Titanium Monobloc</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-extrabold text-[#ff5722] font-mono">100%</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Manual bKash Audited</p>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Interactive 3D Product Canvas Card */}
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative aspect-square sm:aspect-[4/3] lg:aspect-square w-full rounded-2xl bg-gradient-to-b from-[#141721] to-[#0c0e14] border border-white/10 shadow-2xl overflow-hidden p-2 group"
            >
              {/* Top Details Header */}
              <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> In Stock ({featuredProduct.stock} left)
                </span>
              </div>

              {/* 3D Canvas Instance */}
              <ProductViewer3D
                modelType="headphones"
                accentColor="#ff5722"
                autoRotateSpeed={1.2}
                className="w-full h-full"
              />

              {/* Bottom Quick Specs Overlay */}
              <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
                <div className="p-3 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-between pointer-events-auto">
                  <div>
                    <h3 className="text-xs font-bold text-white">{featuredProduct.name}</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">{featuredProduct.category}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-white font-mono">
                      {formatPrice(featuredProduct.price)}
                    </span>
                    <button
                      id="hero-quick-add-btn"
                      onClick={() => addToCart(featuredProduct)}
                      className="p-2 rounded-lg bg-[#ff5722] hover:bg-[#f4511e] text-white transition-colors"
                      title="Add to cart"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Category Pills Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="border-t border-b border-white/5 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#ff5722]" />
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-300">
                Explore Core Collections
              </h2>
            </div>
            <button
              onClick={() => {
                setActiveCategory(null);
                setCurrentView('catalog');
              }}
              className="text-xs text-[#ff5722] hover:underline font-semibold flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                id={`cat-card-${category.slug}`}
                onClick={() => {
                  setActiveCategory(category.name);
                  setCurrentView('catalog');
                }}
                className="group p-3 sm:p-4 rounded-xl bg-[#141721]/60 hover:bg-[#1b202e] border border-white/5 hover:border-[#ff5722]/30 transition-all text-left flex items-center gap-3"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-12 h-12 rounded-lg object-cover bg-black/40 border border-white/10 shrink-0 group-hover:scale-105 transition-transform"
                />
                <div className="min-w-0">
                  <h3 className="text-xs font-bold text-white group-hover:text-[#ff5722] truncate transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">{category.productCount} curated items</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Grid Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 text-[#ff5722] text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curated Catalogue</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Featured Precision Goods
            </h2>
          </div>
          <button
            onClick={() => {
              setActiveCategory(null);
              setCurrentView('catalog');
            }}
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#141721] hover:bg-[#1b202e] text-xs font-semibold text-white border border-white/10 transition-colors"
          >
            <span>Browse All {products.length} Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.slice(0, 3).map((product) => (
            <div
              key={product.id}
              id={`featured-card-${product.id}`}
              className="group rounded-2xl bg-[#141721] border border-white/8 hover:border-white/20 transition-all overflow-hidden flex flex-col justify-between shadow-lg"
            >
              {/* Product Visual */}
              <div className="relative aspect-[4/3] bg-black/40 overflow-hidden cursor-pointer" onClick={() => navigateToProduct(product.id)}>
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
                    <span className="text-[10px] text-emerald-400 font-medium">
                      Stock: {product.stock} available
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
                      className="px-3 py-2 rounded-lg bg-[#ff5722] hover:bg-[#f4511e] text-white text-xs font-bold tracking-wide flex items-center gap-1.5 transition-colors shadow-md shadow-[#ff5722]/20"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="rounded-2xl bg-gradient-to-b from-[#141721] to-[#0c0e14] border border-white/8 p-8 sm:p-12">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#ff5722] mb-2">
              The THIZ Standard
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Why Discerning Minimalists Choose THIZ
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#ff5722]/10 border border-[#ff5722]/20 flex items-center justify-center text-[#ff5722]">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white">Aerospace Materiality</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Precision CNC machined Grade 5 titanium, billet 6063 aluminum, and lambskin acoustical seals with zero hollow plastics.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white">Direct bKash Verification</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Manual transaction auditing guarantees transparent processing without automated gateway surcharges or hidden third-party fees.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                <Sliders className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white">Owner Managed Integrity</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every batch is physically inspected, catalogued, and dispatched with an individual serial number and official replacement guarantee.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

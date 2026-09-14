import React from 'react';
import { useStore } from '../../context/StoreContext';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    cartCount,
    siteSettings,
    formatPrice,
    setCurrentView,
    navigateToProduct,
  } = useStore();

  const freeShippingThreshold = siteSettings.freeShippingThreshold;
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    setCurrentView('checkout');
  };

  const handleExploreClick = () => {
    setIsCartOpen(false);
    setCurrentView('catalog');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div id="cart-drawer-portal" className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
          />

          {/* Slide-over panel */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="w-screen max-w-md bg-[#0e1017] border-l border-white/10 flex flex-col shadow-2xl"
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#ff5722]" />
                  <h2 className="text-base font-bold text-white tracking-tight">Shopping Bag</h2>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-white/10 text-slate-300">
                    {cartCount}
                  </span>
                </div>
                <button
                  id="close-cart-drawer-btn"
                  onClick={() => setIsCartOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                  aria-label="Close cart"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Free Shipping Progress Indicator */}
              <div className="px-5 py-3 bg-[#141721] border-b border-white/5 text-xs">
                <div className="flex items-center justify-between mb-1.5 font-medium">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Truck className="w-3.5 h-3.5 text-[#ff5722]" />
                    {remainingForFreeShipping === 0 ? (
                      <span className="text-emerald-400 font-semibold">You have unlocked FREE delivery!</span>
                    ) : (
                      <span>
                        Add <strong className="text-white">{formatPrice(remainingForFreeShipping)}</strong> more for free shipping
                      </span>
                    )}
                  </div>
                  <span className="text-slate-400 font-mono">{progressPercent}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#ff5722] to-[#e5a93c] transition-all duration-300 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-slate-500">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-white">Your bag is empty</h3>
                      <p className="text-xs text-slate-400 mt-1 max-w-xs">
                        Explore our catalogue of precision acoustic equipment, modern timepieces, and desk goods.
                      </p>
                    </div>
                    <button
                      id="cart-empty-explore-btn"
                      onClick={handleExploreClick}
                      className="px-5 py-2.5 rounded-lg bg-[#ff5722] hover:bg-[#f4511e] text-white text-xs font-bold tracking-wide transition-colors shadow-lg shadow-[#ff5722]/20"
                    >
                      Browse Catalogue
                    </button>
                  </div>
                ) : (
                  cart.map(({ product, quantity }) => (
                    <div
                      key={product.id}
                      className="p-3 rounded-xl bg-[#141721] border border-white/5 flex gap-3 group hover:border-white/15 transition-colors"
                    >
                      {/* Image Thumbnail */}
                      <button
                        onClick={() => {
                          setIsCartOpen(false);
                          navigateToProduct(product.id);
                        }}
                        className="relative w-20 h-20 rounded-lg overflow-hidden bg-black/40 shrink-0 border border-white/5"
                      >
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </button>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-1">
                            <h4
                              onClick={() => {
                                setIsCartOpen(false);
                                navigateToProduct(product.id);
                              }}
                              className="text-xs font-bold text-white truncate hover:text-[#ff5722] cursor-pointer transition-colors"
                            >
                              {product.name}
                            </h4>
                            <button
                              onClick={() => removeFromCart(product.id)}
                              className="text-slate-500 hover:text-rose-400 p-0.5 rounded transition-colors"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">{product.category}</p>
                        </div>

                        {/* Price & Quantity Controls */}
                        <div className="flex items-center justify-between mt-2 pt-1 border-t border-white/5">
                          <span className="text-xs font-bold text-white">
                            {formatPrice(product.price * quantity)}
                          </span>

                          <div className="flex items-center border border-white/10 rounded-lg bg-[#0e1017]">
                            <button
                              onClick={() => updateCartQuantity(product.id, quantity - 1)}
                              className="p-1 hover:bg-white/10 text-slate-300 rounded-l-lg transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-xs font-bold text-white min-w-[24px] text-center">
                              {quantity}
                            </span>
                            <button
                              onClick={() => updateCartQuantity(product.id, quantity + 1)}
                              disabled={quantity >= product.stock}
                              className="p-1 hover:bg-white/10 text-slate-300 rounded-r-lg transition-colors disabled:opacity-30"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Drawer Footer & Checkout Action */}
              {cart.length > 0 && (
                <div className="p-5 bg-[#141721] border-t border-white/10 space-y-3">
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Subtotal</span>
                      <span className="font-semibold text-white font-mono">{formatPrice(cartSubtotal)}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Estimated Delivery</span>
                      <span className="font-semibold text-emerald-400 font-mono">
                        {remainingForFreeShipping === 0 ? 'FREE' : formatPrice(siteSettings.deliveryChargeStandard)}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-white/10 flex justify-between text-sm font-bold text-white">
                      <span>Estimated Total</span>
                      <span className="text-base text-[#ff5722] font-mono">
                        {formatPrice(
                          cartSubtotal + (remainingForFreeShipping === 0 ? 0 : siteSettings.deliveryChargeStandard)
                        )}
                      </span>
                    </div>
                  </div>

                  <button
                    id="cart-drawer-checkout-button"
                    onClick={handleCheckoutClick}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#ff5722] to-[#e5a93c] hover:opacity-95 text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#ff5722]/20 transition-all active:scale-[0.99]"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Secure checkout with bKash manual verification</span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

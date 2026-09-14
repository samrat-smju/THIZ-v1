import React, { createContext, useContext, useEffect, useState, useMemo, ReactNode } from 'react';
import { CartItem, Category, NavItem, Order, Product, SiteSettings, ToastMessage, ViewState } from '../types';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_SITE_SETTINGS } from '../data/mockData';

interface StoreContextType {
  // Navigation & Views
  currentView: ViewState;
  setCurrentView: (view: ViewState) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  navigateToProduct: (productId: string) => void;
  activeCategory: string | null;
  setActiveCategory: (category: string | null) => void;

  // Search & Cart Drawers
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Data
  products: Product[];
  addProduct: (productData: Omit<Product, 'id' | 'createdAt'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  categories: Category[];
  siteSettings: SiteSettings;
  updateSiteSettings: (settings: Partial<SiteSettings>) => void;

  // Nav Item Management
  addNavItem: (item: Omit<NavItem, 'id' | 'order'>) => void;
  updateNavItem: (id: string, updates: Partial<NavItem>) => void;
  deleteNavItem: (id: string) => void;
  reorderNavItems: (items: NavItem[]) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => boolean;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;

  // Orders
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'timeline'>) => Order;
  updateOrderStatus: (orderId: string, status: Order['orderStatus'], adminNote?: string) => void;
  verifyPayment: (orderId: string, approved: boolean, note?: string) => void;
  currentTrackedOrder: Order | null;
  setCurrentTrackedOrder: (order: Order | null) => void;

  // Formatting & Toasts
  formatPrice: (amount: number) => string;
  toasts: ToastMessage[];
  showToast: (title: string, message?: string, type?: ToastMessage['type']) => void;
  dismissToast: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'thiz_cart_v1';
const ORDERS_STORAGE_KEY = 'thiz_orders_v1';
const SETTINGS_STORAGE_KEY = 'thiz_settings_v1';
const PRODUCTS_STORAGE_KEY = 'thiz_products_v1';

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Navigation
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Modals / Drawers
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentTrackedOrder, setCurrentTrackedOrder] = useState<Order | null>(null);

  // Core Data
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);

  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_SITE_SETTINGS,
          ...parsed,
          navItems: parsed.navItems && parsed.navItems.length > 0 ? parsed.navItems : INITIAL_SITE_SETTINGS.navItems,
        };
      }
      return INITIAL_SITE_SETTINGS;
    } catch {
      return INITIAL_SITE_SETTINGS;
    }
  });

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Orders state
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync products to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
      console.error('Failed to persist products', e);
    }
  }, [products]);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to persist cart', e);
    }
  }, [cart]);

  // Sync orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to persist orders', e);
    }
  }, [orders]);

  // Toast helper
  const showToast = (title: string, message?: string, type: ToastMessage['type'] = 'success') => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Product CRUD
  const addProduct = (productData: Omit<Product, 'id' | 'createdAt'>): Product => {
    const newProduct: Product = {
      ...productData,
      id: `thz-prd-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast('Product Added', `"${newProduct.name}" is now live in the catalog.`);
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    showToast('Product Updated', 'Product details saved successfully.');
  };

  const deleteProduct = (id: string) => {
    const target = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    // Also remove from cart if present
    setCart((prev) => prev.filter((item) => item.product.id !== id));
    showToast('Product Deleted', `"${target?.name || 'Product'}" has been removed from catalog.`, 'info');
  };

  // Nav Item Management
  const addNavItem = (itemData: Omit<NavItem, 'id' | 'order'>) => {
    const currentItems = siteSettings.navItems || [];
    const maxOrder = currentItems.reduce((max, item) => Math.max(max, item.order), 0);
    const newItem: NavItem = {
      ...itemData,
      id: `nav-${Date.now()}`,
      order: maxOrder + 1,
    };
    const updatedNav = [...currentItems, newItem];
    updateSiteSettings({ navItems: updatedNav });
    showToast('Navigation Link Added', `"${newItem.label}" added to navbar.`);
  };

  const updateNavItem = (id: string, updates: Partial<NavItem>) => {
    const currentItems = siteSettings.navItems || [];
    const updatedNav = currentItems.map((item) =>
      item.id === id ? { ...item, ...updates } : item
    );
    updateSiteSettings({ navItems: updatedNav });
    showToast('Navigation Link Updated', 'Menu structure updated.');
  };

  const deleteNavItem = (id: string) => {
    const currentItems = siteSettings.navItems || [];
    const updatedNav = currentItems.filter((item) => item.id !== id);
    updateSiteSettings({ navItems: updatedNav });
    showToast('Navigation Link Removed', 'Menu item removed.', 'info');
  };

  const reorderNavItems = (items: NavItem[]) => {
    updateSiteSettings({ navItems: items });
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1): boolean => {
    if (product.stock <= 0) {
      showToast('Out of Stock', `${product.name} is currently unavailable.`, 'error');
      return false;
    }

    let added = false;
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        const newQty = existing.quantity + quantity;
        if (newQty > product.stock) {
          showToast('Stock Limit Reached', `Only ${product.stock} units available for ${product.name}.`, 'warning');
          return prev;
        }
        added = true;
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      } else {
        if (quantity > product.stock) {
          showToast('Stock Limit Reached', `Only ${product.stock} units available.`, 'warning');
          return prev;
        }
        added = true;
        return [...prev, { product, quantity }];
      }
    });

    if (added) {
      showToast('Added to Cart', `${product.name} has been added.`, 'success');
      setIsCartOpen(true);
    }
    return added;
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Item Removed', 'Product was removed from your cart.', 'info');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          if (quantity > item.product.stock) {
            showToast('Stock Limit Reached', `Max available stock is ${item.product.stock}.`, 'warning');
            return item;
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  }, [cart]);

  const navigateToProduct = (productId: string) => {
    setSelectedProductId(productId);
    setCurrentView('product-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateSiteSettings = (updated: Partial<SiteSettings>) => {
    setSiteSettings((prev) => {
      const next = { ...prev, ...updated };
      try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.error('Failed to save settings', e);
      }
      return next;
    });
  };

  // Order creation
  const createOrder = (
    orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'timeline'>
  ): Order => {
    const timestamp = new Date().toISOString();
    const randomHex = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `THZ-${new Date().getFullYear().toString().slice(-2)}${randomHex}`;

    const newOrder: Order = {
      ...orderData,
      id: `ord_${Date.now()}`,
      orderNumber,
      createdAt: timestamp,
      updatedAt: timestamp,
      timeline: [
        {
          status: orderData.orderStatus,
          timestamp,
          note: 'Order submitted by customer',
        },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setCurrentTrackedOrder(newOrder);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['orderStatus'], adminNote?: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const now = new Date().toISOString();
          return {
            ...o,
            orderStatus: status,
            updatedAt: now,
            timeline: [
              ...o.timeline,
              {
                status,
                timestamp: now,
                note: adminNote || `Status updated to ${status}`,
              },
            ],
          };
        }
        return o;
      })
    );
    showToast('Order Updated', `Order status changed to ${status}.`);
  };

  const verifyPayment = (orderId: string, approved: boolean, note?: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const now = new Date().toISOString();
          const paymentStatus: Order['paymentStatus'] = approved ? 'PAID' : 'REJECTED';
          const orderStatus: Order['orderStatus'] = approved ? 'CONFIRMED' : 'REJECTED';

          return {
            ...o,
            paymentStatus,
            orderStatus,
            updatedAt: now,
            paymentVerification: o.paymentVerification
              ? {
                  ...o.paymentVerification,
                  verifiedAt: now,
                  verifiedBy: 'Administrator',
                  rejectionReason: approved ? undefined : note || 'Transaction ID not verified',
                }
              : undefined,
            timeline: [
              ...o.timeline,
              {
                status: orderStatus,
                timestamp: now,
                note: approved
                  ? 'bKash payment verified and approved by admin'
                  : `Payment rejected: ${note || 'Transaction ID could not be verified'}`,
              },
            ],
          };
        }
        return o;
      })
    );
    showToast(
      approved ? 'Payment Approved' : 'Payment Rejected',
      approved ? 'Order has been moved to Confirmed.' : 'Customer order marked as payment rejected.',
      approved ? 'success' : 'error'
    );
  };

  const formatPrice = (amount: number) => {
    return `${siteSettings.currencySymbol}${amount.toLocaleString('en-US')}`;
  };

  return (
    <StoreContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedProductId,
        setSelectedProductId,
        navigateToProduct,
        activeCategory,
        setActiveCategory,
        isSearchOpen,
        setIsSearchOpen,
        searchQuery,
        setSearchQuery,
        isCartOpen,
        setIsCartOpen,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        categories,
        siteSettings,
        updateSiteSettings,
        addNavItem,
        updateNavItem,
        deleteNavItem,
        reorderNavItems,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        orders,
        createOrder,
        updateOrderStatus,
        verifyPayment,
        currentTrackedOrder,
        setCurrentTrackedOrder,
        formatPrice,
        toasts,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

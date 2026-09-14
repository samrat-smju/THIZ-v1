import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Lock,
  DollarSign,
  Package,
  Clock,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Download,
  Settings,
  ArrowLeft,
  Sliders,
  LogOut,
  AlertTriangle,
  RefreshCw,
  Search,
  Plus,
  Trash2,
  Edit3,
  MoveUp,
  MoveDown,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Sparkles,
  ExternalLink,
  Tag,
} from 'lucide-react';
import { NavItem, Order, OrderStatus, Product, ProductSpecification } from '../../types';
import { ThizLogo } from '../ui/ThizLogo';

export const AdminPortal: React.FC = () => {
  const {
    orders,
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
    verifyPayment,
    updateOrderStatus,
    formatPrice,
    setCurrentView,
    showToast,
  } = useStore();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'verifications' | 'orders' | 'products' | 'navigation' | 'settings'
  >('dashboard');

  // Settings form state
  const [settingsForm, setSettingsForm] = useState(siteSettings);
  const [orderFilter, setOrderFilter] = useState<string>('ALL');
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('ALL');

  // bKash rejection modal state
  const [rejectOrderId, setRejectOrderId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('TrxID not found in merchant bKash statement');

  // Product Add / Edit Modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState<{
    name: string;
    category: string;
    sku: string;
    price: number;
    originalPrice: number;
    stock: number;
    shortDescription: string;
    description: string;
    images: string[];
    specifications: ProductSpecification[];
    featured: boolean;
    active: boolean;
    has3dModel: boolean;
    tags: string;
  }>({
    name: '',
    category: 'Acoustics & Audio',
    sku: '',
    price: 0,
    originalPrice: 0,
    stock: 10,
    shortDescription: '',
    description: '',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop'],
    specifications: [
      { label: 'Material', value: 'Grade 5 Titanium & Aerospace Aluminum' },
      { label: 'Warranty', value: '1 Year Official THIZ Replacement' },
    ],
    featured: false,
    active: true,
    has3dModel: false,
    tags: 'electronics, premium, luxury',
  });

  // Product Delete Confirmation
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  // Navigation Links Manager Modal state
  const [isNavModalOpen, setIsNavModalOpen] = useState(false);
  const [editingNavId, setEditingNavId] = useState<string | null>(null);
  const [navForm, setNavForm] = useState<{
    label: string;
    type: 'view' | 'category' | 'custom';
    target: string;
    visible: boolean;
    badge: string;
  }>({
    label: '',
    type: 'view',
    target: 'home',
    visible: true,
    badge: '',
  });

  // Brand logo config state inside navigation
  const [brandSettings, setBrandSettings] = useState({
    businessName: siteSettings.businessName || 'THIZ',
    tagline: siteSettings.tagline || 'Precision Engineered Modern Goods',
    logoType: siteSettings.logoType || 'monogram',
    logoUrl: siteSettings.logoUrl || '',
  });

  // Simple, secure admin auth gate for the owner
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'thiz2026' || adminPassword === 'admin') {
      setIsAuthenticated(true);
      showToast('Admin Authenticated', 'Welcome to the THIZ Business Control Suite.');
    } else {
      showToast('Invalid Key', 'Authentication key incorrect. Default is "thiz2026".', 'error');
    }
  };

  // KPIs
  const totalRevenue = useMemo(() => {
    return orders
      .filter((o) => o.paymentStatus === 'PAID')
      .reduce((acc, o) => acc + o.totalAmount, 0);
  }, [orders]);

  const pendingVerifications = useMemo(() => {
    return orders.filter((o) => o.paymentStatus === 'PENDING_VERIFICATION');
  }, [orders]);

  const lowStockCount = useMemo(() => {
    return products.filter((p) => p.stock < 10).length;
  }, [products]);

  // CSV Export for sales table
  const handleExportCSV = () => {
    if (orders.length === 0) {
      showToast('No Orders', 'There are no sales records to export.', 'info');
      return;
    }

    const headers = [
      'Order Number',
      'Date',
      'Customer Name',
      'Phone',
      'City',
      'Total (BDT)',
      'Payment Status',
      'bKash TrxID',
      'Order Status',
      'Items Count',
    ];

    const rows = orders.map((o) => [
      o.orderNumber,
      new Date(o.createdAt).toLocaleDateString(),
      `"${o.customer.fullName.replace(/"/g, '""')}"`,
      o.customer.phone,
      o.customer.city,
      o.totalAmount,
      o.paymentStatus,
      o.paymentVerification?.transactionId || 'N/A',
      o.orderStatus,
      o.items.length,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `THIZ_Sales_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('CSV Exported', 'Sales audit downloaded successfully.');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings(settingsForm);
    showToast('Settings Saved', 'Site configuration updated successfully.');
  };

  const handleSaveBrandSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings({
      businessName: brandSettings.businessName,
      tagline: brandSettings.tagline,
      logoType: brandSettings.logoType as any,
      logoUrl: brandSettings.logoUrl,
    });
    showToast('Brand Identity Updated', 'Logo and brand details applied to navigation bar.');
  };

  // Product Form Handlers
  const handleOpenAddProduct = () => {
    setEditingProductId(null);
    setProductForm({
      name: '',
      category: categories[0]?.name || 'Acoustics & Audio',
      sku: `THZ-${Math.floor(100 + Math.random() * 900)}`,
      price: 4500,
      originalPrice: 5500,
      stock: 15,
      shortDescription: '',
      description: '',
      images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop'],
      specifications: [
        { label: 'Material', value: 'Aircraft Aluminum' },
        { label: 'Color', value: 'Matte Titanium' },
      ],
      featured: false,
      active: true,
      has3dModel: false,
      tags: 'new, arrival, premium',
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProductId(prod.id);
    setProductForm({
      name: prod.name,
      category: prod.category,
      sku: prod.sku,
      price: prod.price,
      originalPrice: prod.originalPrice || 0,
      stock: prod.stock,
      shortDescription: prod.shortDescription,
      description: prod.description,
      images: prod.images.length > 0 ? [...prod.images] : [''],
      specifications: prod.specifications.length > 0 ? [...prod.specifications] : [{ label: '', value: '' }],
      featured: prod.featured,
      active: prod.active,
      has3dModel: !!prod.has3dModel,
      tags: prod.tags.join(', '),
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name.trim()) {
      showToast('Validation Error', 'Product name is required.', 'error');
      return;
    }

    const filteredImages = productForm.images.filter((img) => img.trim().length > 0);
    const finalImages =
      filteredImages.length > 0
        ? filteredImages
        : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop'];

    const filteredSpecs = productForm.specifications.filter(
      (s) => s.label.trim().length > 0 && s.value.trim().length > 0
    );

    const tagsArray = productForm.tags
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);

    const slug = productForm.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const discountPercentage =
      productForm.originalPrice > productForm.price
        ? Math.round(((productForm.originalPrice - productForm.price) / productForm.originalPrice) * 100)
        : undefined;

    if (editingProductId) {
      updateProduct(editingProductId, {
        name: productForm.name,
        slug,
        category: productForm.category,
        sku: productForm.sku,
        price: Number(productForm.price),
        originalPrice: productForm.originalPrice > 0 ? Number(productForm.originalPrice) : undefined,
        discountPercentage,
        stock: Number(productForm.stock),
        shortDescription: productForm.shortDescription,
        description: productForm.description,
        images: finalImages,
        specifications: filteredSpecs,
        featured: productForm.featured,
        active: productForm.active,
        has3dModel: productForm.has3dModel,
        tags: tagsArray,
      });
    } else {
      addProduct({
        name: productForm.name,
        slug,
        category: productForm.category,
        sku: productForm.sku || `THZ-${Date.now().toString().slice(-4)}`,
        price: Number(productForm.price),
        originalPrice: productForm.originalPrice > 0 ? Number(productForm.originalPrice) : undefined,
        discountPercentage,
        stock: Number(productForm.stock),
        rating: 5.0,
        reviewCount: 0,
        shortDescription: productForm.shortDescription || productForm.name,
        description: productForm.description || productForm.shortDescription || productForm.name,
        images: finalImages,
        specifications: filteredSpecs,
        featured: productForm.featured,
        active: productForm.active,
        has3dModel: productForm.has3dModel,
        tags: tagsArray,
      });
    }

    setIsProductModalOpen(false);
  };

  // Nav Item Handlers
  const handleOpenAddNav = () => {
    setEditingNavId(null);
    setNavForm({
      label: '',
      type: 'view',
      target: 'catalog',
      visible: true,
      badge: '',
    });
    setIsNavModalOpen(true);
  };

  const handleOpenEditNav = (item: NavItem) => {
    setEditingNavId(item.id);
    setNavForm({
      label: item.label,
      type: item.type,
      target: item.target,
      visible: item.visible,
      badge: item.badge || '',
    });
    setIsNavModalOpen(true);
  };

  const handleSaveNav = (e: React.FormEvent) => {
    e.preventDefault();
    if (!navForm.label.trim()) {
      showToast('Validation Error', 'Link label is required.', 'error');
      return;
    }

    if (editingNavId) {
      updateNavItem(editingNavId, {
        label: navForm.label,
        type: navForm.type,
        target: navForm.target,
        visible: navForm.visible,
        badge: navForm.badge.trim() || undefined,
      });
    } else {
      addNavItem({
        label: navForm.label,
        type: navForm.type,
        target: navForm.target,
        visible: navForm.visible,
        badge: navForm.badge.trim() || undefined,
      });
    }

    setIsNavModalOpen(false);
  };

  const handleMoveNav = (index: number, direction: 'up' | 'down') => {
    const items = [...(siteSettings.navItems || [])];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const temp = items[index];
    items[index] = items[targetIndex];
    items[targetIndex] = temp;

    const reordered = items.map((item, idx) => ({ ...item, order: idx + 1 }));
    reorderNavItems(reordered);
    showToast('Order Updated', 'Navigation item sequence updated.');
  };

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat =
        productCategoryFilter === 'ALL' || p.category.toLowerCase() === productCategoryFilter.toLowerCase();
      const matchSearch =
        productSearch === '' ||
        p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.sku.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.category.toLowerCase().includes(productSearch.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, productCategoryFilter, productSearch]);

  // If not logged in, show sleek login gateway
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="p-8 rounded-2xl bg-[#141721] border border-white/10 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-[#ff5722]/10 border border-[#ff5722]/20 text-[#ff5722] flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-extrabold text-white tracking-tight">THIZ Admin Access</h1>
            <p className="text-xs text-slate-400">
              Restricted management portal for business owner.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Authorization Key
              </label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Enter access passcode..."
                className="w-full bg-[#0d0f14] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#ff5722]"
              />
              <p className="text-[11px] text-slate-400 mt-1.5 font-mono">
                Default key: <span className="text-white font-bold">thiz2026</span>
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-[#ff5722] hover:bg-[#f4511e] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#ff5722]/20 transition-all cursor-pointer"
            >
              Authorize Session
            </button>
          </form>

          <div className="pt-4 border-t border-white/5 text-center">
            <button
              onClick={() => setCurrentView('home')}
              className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Storefront</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="admin-suite-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Admin Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
              Live Session Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            THIZ Business Suite
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentView('home')}
            className="px-3 py-1.5 rounded-xl bg-[#141721] hover:bg-[#1b202e] border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Storefront</span>
          </button>

          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-xs font-semibold text-rose-300 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-white/5 text-xs">
        {[
          { key: 'dashboard', label: 'Overview & KPIs', icon: Sliders },
          {
            key: 'verifications',
            label: `bKash Verification (${pendingVerifications.length})`,
            icon: ShieldCheck,
            badge: pendingVerifications.length > 0,
          },
          { key: 'orders', label: `Orders (${orders.length})`, icon: Package },
          { key: 'products', label: `Products & Details (${products.length})`, icon: RefreshCw },
          { key: 'navigation', label: 'Navigation Bar & Brand', icon: Sparkles },
          { key: 'settings', label: 'bKash & Store Settings', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-3.5 py-2 rounded-xl font-semibold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#ff5722] text-white shadow-md shadow-[#ff5722]/20'
                  : 'bg-[#141721] hover:bg-[#1b202e] text-slate-300'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* KPI Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#141721] border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Verified Revenue</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-black text-white font-mono">{formatPrice(totalRevenue)}</p>
              <p className="text-[11px] text-slate-500">From verified bKash transactions</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#141721] border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Pending Verification</span>
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-2xl font-black text-amber-400 font-mono">
                {pendingVerifications.length}
              </p>
              <p className="text-[11px] text-slate-500">Awaiting owner bKash check</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#141721] border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Total Catalog Items</span>
                <Package className="w-4 h-4 text-sky-400" />
              </div>
              <p className="text-2xl font-black text-white font-mono">{products.length}</p>
              <p className="text-[11px] text-slate-500">Active products in store</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#141721] border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Low-Stock Alerts</span>
                <AlertTriangle className="w-4 h-4 text-[#ff5722]" />
              </div>
              <p className="text-2xl font-black text-[#ff5722] font-mono">{lowStockCount}</p>
              <p className="text-[11px] text-slate-500">Items below 10 units</p>
            </div>
          </div>

          {/* Quick Actions & Recent Verification Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-[#171a25] to-[#141721] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-white">Manual bKash Verification Desk</h3>
              <p className="text-xs text-slate-400 mt-1">
                {pendingVerifications.length > 0
                  ? `There are ${pendingVerifications.length} customer payments waiting for TrxID confirmation.`
                  : 'All customer payments have been processed and verified.'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab('verifications')}
                className="px-4 py-2 bg-[#ff5722] hover:bg-[#f4511e] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Review Transactions
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className="px-4 py-2 bg-[#1b202e] hover:bg-[#232a3b] text-slate-200 border border-white/10 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Product</span>
              </button>
              <button
                onClick={handleExportCSV}
                className="px-4 py-2 bg-[#1b202e] hover:bg-[#232a3b] text-slate-200 border border-white/10 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BKASH VERIFICATION DESK */}
      {activeTab === 'verifications' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Payment Verification Desk</h2>
              <p className="text-xs text-slate-400">
                Check the customer's bKash Transaction ID against your merchant statement, then approve or reject.
              </p>
            </div>
            <span className="text-xs text-amber-400 font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
              {pendingVerifications.length} Pending
            </span>
          </div>

          {pendingVerifications.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[#141721] border border-white/10 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="text-sm font-bold text-white">All bKash Payments Verified</h3>
              <p className="text-xs text-slate-400">No pending transactions need manual review right now.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingVerifications.map((order) => (
                <div
                  key={order.id}
                  className="p-5 rounded-2xl bg-[#141721] border border-amber-500/30 space-y-4 shadow-xl"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Order #{order.orderNumber}
                      </span>
                      <h3 className="text-base font-bold text-white mt-0.5">
                        {order.customer.fullName} —{' '}
                        <span className="text-[#ff5722] font-mono">{formatPrice(order.totalAmount)}</span>
                      </h3>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-slate-400 font-mono">
                        Submitted: {new Date(order.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>

                  {/* bKash Audit Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-[#0d0f14] border border-white/5 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Submitted TrxID:</span>
                      <span className="text-sm font-black text-amber-400 font-mono tracking-wider">
                        {order.paymentVerification?.transactionId || 'NOT PROVIDED'}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Sender Phone:</span>
                      <span className="font-mono text-white">
                        {order.paymentVerification?.senderPhone || order.customer.phone}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Delivery To:</span>
                      <span className="text-slate-300 truncate block">
                        {order.customer.address}, {order.customer.city}
                      </span>
                    </div>
                  </div>

                  {/* Approve / Reject Actions */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      onClick={() => setRejectOrderId(order.id)}
                      className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject Payment</span>
                    </button>

                    <button
                      onClick={() => verifyPayment(order.id, true)}
                      className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-black rounded-xl text-xs font-extrabold tracking-wide transition-colors flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4 fill-black text-white" />
                      <span>Approve Payment (Confirm Order)</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Rejection Modal */}
          {rejectOrderId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
              <div className="max-w-md w-full p-6 rounded-2xl bg-[#141721] border border-white/10 space-y-4">
                <h3 className="text-base font-bold text-white">Reject bKash Transaction</h3>
                <p className="text-xs text-slate-400">
                  Please provide a reason. The customer will see this when tracking their order.
                </p>

                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={3}
                  className="w-full bg-[#0d0f14] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-rose-500"
                />

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setRejectOrderId(null)}
                    className="px-3 py-1.5 bg-white/5 text-slate-300 rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      verifyPayment(rejectOrderId, false, rejectionReason);
                      setRejectOrderId(null);
                    }}
                    className="px-4 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-xs font-bold cursor-pointer"
                  >
                    Confirm Rejection
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">All Orders ({orders.length})</h2>
              <p className="text-xs text-slate-400">View and advance fulfillment status.</p>
            </div>

            <button
              onClick={handleExportCSV}
              className="px-4 py-2 bg-[#1b202e] hover:bg-[#232a3b] text-white border border-white/10 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>

          {/* Filter pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {['ALL', 'PENDING_VERIFICATION', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'REJECTED'].map(
              (filterKey) => (
                <button
                  key={filterKey}
                  onClick={() => setOrderFilter(filterKey)}
                  className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    orderFilter === filterKey
                      ? 'bg-white/15 text-white'
                      : 'bg-[#141721] text-slate-400 hover:text-white'
                  }`}
                >
                  {filterKey.replace('_', ' ')}
                </button>
              )
            )}
          </div>

          {/* Orders Table */}
          {orders.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[#141721] border border-white/10">
              <p className="text-xs text-slate-400">No orders placed yet.</p>
            </div>
          ) : (
            <div className="rounded-2xl bg-[#141721] border border-white/10 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0d0f14] text-slate-400 font-semibold border-b border-white/5">
                  <tr>
                    <th className="p-3.5">Order #</th>
                    <th className="p-3.5">Customer</th>
                    <th className="p-3.5">Total</th>
                    <th className="p-3.5">bKash TrxID</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Advance Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {orders
                    .filter((o) => (orderFilter === 'ALL' ? true : o.orderStatus === orderFilter))
                    .map((order) => (
                      <tr key={order.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-3.5 font-mono font-bold text-white">{order.orderNumber}</td>
                        <td className="p-3.5">
                          <p className="font-semibold text-white">{order.customer.fullName}</p>
                          <p className="text-[11px] text-slate-500">{order.customer.phone}</p>
                        </td>
                        <td className="p-3.5 font-mono font-bold text-white">
                          {formatPrice(order.totalAmount)}
                        </td>
                        <td className="p-3.5 font-mono text-amber-400">
                          {order.paymentVerification?.transactionId || 'None'}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              order.orderStatus === 'CONFIRMED'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : order.orderStatus === 'PENDING_VERIFICATION'
                                ? 'bg-amber-500/20 text-amber-400'
                                : order.orderStatus === 'SHIPPED'
                                ? 'bg-purple-500/20 text-purple-400'
                                : order.orderStatus === 'REJECTED'
                                ? 'bg-rose-500/20 text-rose-400'
                                : 'bg-slate-500/20 text-slate-300'
                            }`}
                          >
                            {order.orderStatus}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <select
                            value={order.orderStatus}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                            className="bg-[#0d0f14] border border-white/10 rounded-lg px-2 py-1 text-xs text-white cursor-pointer"
                          >
                            <option value="PENDING_VERIFICATION">Pending Verification</option>
                            <option value="CONFIRMED">Confirmed</option>
                            <option value="PROCESSING">Processing</option>
                            <option value="SHIPPED">Shipped</option>
                            <option value="DELIVERED">Delivered</option>
                            <option value="CANCELLED">Cancelled</option>
                            <option value="REJECTED">Rejected</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: PRODUCTS & DETAILS MANAGEMENT (ADD, EDIT, DELETE) */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">Products &amp; Inventory Management</h2>
              <p className="text-xs text-slate-400">
                Add, edit specifications, adjust pricing &amp; stock, or remove products from your catalog.
              </p>
            </div>

            <button
              onClick={handleOpenAddProduct}
              className="px-4 py-2 bg-[#ff5722] hover:bg-[#f4511e] text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-[#ff5722]/20 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Search products by name, SKU, or category..."
                className="w-full bg-[#141721] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#ff5722]"
              />
            </div>

            <select
              value={productCategoryFilter}
              onChange={(e) => setProductCategoryFilter(e.target.value)}
              className="bg-[#141721] border border-white/10 rounded-xl px-3 py-2 text-xs text-white cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Products Table */}
          <div className="rounded-2xl bg-[#141721] border border-white/10 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0d0f14] text-slate-400 font-semibold border-b border-white/5">
                <tr>
                  <th className="p-3.5">Product</th>
                  <th className="p-3.5">SKU</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Price</th>
                  <th className="p-3.5">Stock</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-3.5 flex items-center gap-3">
                      <img
                        src={p.images[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=200'}
                        alt={p.name}
                        className="w-10 h-10 rounded-lg object-cover bg-black/40 border border-white/10 shrink-0"
                      />
                      <div>
                        <span className="font-semibold text-white block">{p.name}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          {p.featured && (
                            <span className="text-[9px] px-1.5 py-0.2 bg-[#ff5722]/20 text-[#ff5722] rounded font-bold">
                              Featured
                            </span>
                          )}
                          {p.has3dModel && (
                            <span className="text-[9px] px-1.5 py-0.2 bg-sky-500/20 text-sky-400 rounded font-bold">
                              3D Ready
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5 font-mono text-slate-400">{p.sku}</td>
                    <td className="p-3.5">{p.category}</td>
                    <td className="p-3.5">
                      <div className="font-mono font-bold text-white">{formatPrice(p.price)}</div>
                      {p.originalPrice && p.originalPrice > p.price && (
                        <div className="font-mono text-[10px] text-slate-500 line-through">
                          {formatPrice(p.originalPrice)}
                        </div>
                      )}
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => updateProduct(p.id, { stock: Math.max(0, p.stock - 1) })}
                          className="w-5 h-5 rounded bg-white/5 hover:bg-white/10 text-slate-300 flex items-center justify-center font-bold text-xs"
                          title="Decrease stock"
                        >
                          -
                        </button>
                        <span className="font-mono font-bold text-white min-w-[2.5rem] text-center">
                          {p.stock}
                        </span>
                        <button
                          onClick={() => updateProduct(p.id, { stock: p.stock + 1 })}
                          className="w-5 h-5 rounded bg-white/5 hover:bg-white/10 text-slate-300 flex items-center justify-center font-bold text-xs"
                          title="Increase stock"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          !p.active
                            ? 'bg-slate-500/20 text-slate-400'
                            : p.stock > 10
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : p.stock > 0
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-rose-500/20 text-rose-400'
                        }`}
                      >
                        {!p.active ? 'Inactive' : p.stock > 10 ? 'In Stock' : p.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEditProduct(p)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                          title="Edit product details"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingProduct(p)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                          title="Delete product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Delete Product Confirmation Modal */}
          {deletingProduct && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
              <div className="max-w-md w-full p-6 rounded-2xl bg-[#141721] border border-rose-500/30 space-y-4 shadow-2xl">
                <div className="flex items-center gap-3 text-rose-400">
                  <AlertTriangle className="w-6 h-6" />
                  <h3 className="text-base font-bold text-white">Confirm Product Deletion</h3>
                </div>
                <p className="text-xs text-slate-300">
                  Are you sure you want to delete <strong className="text-white">"{deletingProduct.name}"</strong>?
                  This will remove it from the catalog and customer views.
                </p>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setDeletingProduct(null)}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      deleteProduct(deletingProduct.id);
                      setDeletingProduct(null);
                    }}
                    className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Delete Product
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Product Add / Edit Modal */}
          {isProductModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
              <div className="max-w-2xl w-full my-8 p-6 rounded-2xl bg-[#141721] border border-white/10 space-y-5 shadow-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <h3 className="text-base font-bold text-white">
                    {editingProductId ? 'Edit Product Details' : 'Add New Product to THIZ'}
                  </h3>
                  <button
                    onClick={() => setIsProductModalOpen(false)}
                    className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                  {/* Basic Info */}
                  <div className="space-y-3">
                    <div>
                      <label className="block font-bold text-slate-200 mb-1">Product Title *</label>
                      <input
                        type="text"
                        required
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        placeholder="e.g. THIZ Chrono 02 Automatic Watch"
                        className="w-full bg-[#0d0f14] border border-white/10 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#ff5722]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block font-bold text-slate-200 mb-1">Category</label>
                        <select
                          value={productForm.category}
                          onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                          className="w-full bg-[#0d0f14] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#ff5722]"
                        >
                          {categories.map((c) => (
                            <option key={c.id} value={c.name}>
                              {c.name}
                            </option>
                          ))}
                          <option value="Custom / Other">Custom / Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-200 mb-1">SKU Code</label>
                        <input
                          type="text"
                          value={productForm.sku}
                          onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                          placeholder="e.g. THZ-WCH-002"
                          className="w-full bg-[#0d0f14] border border-white/10 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-[#ff5722]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-200 mb-1">Stock Units</label>
                        <input
                          type="number"
                          min="0"
                          value={productForm.stock}
                          onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                          className="w-full bg-[#0d0f14] border border-white/10 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-[#ff5722]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-200 mb-1">Selling Price (BDT) *</label>
                        <input
                          type="number"
                          required
                          min="0"
                          value={productForm.price}
                          onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                          className="w-full bg-[#0d0f14] border border-white/10 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-[#ff5722]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-200 mb-1">
                          Original Price (Optional for Discount % badge)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={productForm.originalPrice}
                          onChange={(e) =>
                            setProductForm({ ...productForm, originalPrice: Number(e.target.value) })
                          }
                          className="w-full bg-[#0d0f14] border border-white/10 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-[#ff5722]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Descriptions */}
                  <div className="space-y-3 pt-2 border-t border-white/5">
                    <div>
                      <label className="block font-bold text-slate-200 mb-1">Short Summary</label>
                      <input
                        type="text"
                        value={productForm.shortDescription}
                        onChange={(e) => setProductForm({ ...productForm, shortDescription: e.target.value })}
                        placeholder="One-line punchy description for card view..."
                        className="w-full bg-[#0d0f14] border border-white/10 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#ff5722]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-200 mb-1">Full Detailed Description</label>
                      <textarea
                        rows={3}
                        value={productForm.description}
                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                        placeholder="Comprehensive craftsmanship, acoustics, materials, and engineering notes..."
                        className="w-full bg-[#0d0f14] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#ff5722]"
                      />
                    </div>
                  </div>

                  {/* Images list */}
                  <div className="space-y-2 pt-2 border-t border-white/5">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-slate-200">Image URLs</label>
                      <button
                        type="button"
                        onClick={() =>
                          setProductForm({
                            ...productForm,
                            images: [...productForm.images, ''],
                          })
                        }
                        className="text-[11px] text-[#ff5722] hover:underline font-semibold"
                      >
                        + Add another image
                      </button>
                    </div>

                    {productForm.images.map((img, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <input
                          type="url"
                          value={img}
                          onChange={(e) => {
                            const copy = [...productForm.images];
                            copy[idx] = e.target.value;
                            setProductForm({ ...productForm, images: copy });
                          }}
                          placeholder="https://images.unsplash.com/..."
                          className="flex-1 bg-[#0d0f14] border border-white/10 rounded-xl px-3 py-1.5 text-white font-mono text-[11px] focus:outline-none focus:border-[#ff5722]"
                        />
                        {productForm.images.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const copy = productForm.images.filter((_, i) => i !== idx);
                              setProductForm({ ...productForm, images: copy });
                            }}
                            className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Specifications */}
                  <div className="space-y-2 pt-2 border-t border-white/5">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-slate-200">Technical Specifications</label>
                      <button
                        type="button"
                        onClick={() =>
                          setProductForm({
                            ...productForm,
                            specifications: [...productForm.specifications, { label: '', value: '' }],
                          })
                        }
                        className="text-[11px] text-[#ff5722] hover:underline font-semibold"
                      >
                        + Add specification
                      </button>
                    </div>

                    {productForm.specifications.map((spec, idx) => (
                      <div key={idx} className="grid grid-cols-5 gap-2 items-center">
                        <input
                          type="text"
                          placeholder="Feature (e.g. Battery)"
                          value={spec.label}
                          onChange={(e) => {
                            const copy = [...productForm.specifications];
                            copy[idx] = { ...copy[idx], label: e.target.value };
                            setProductForm({ ...productForm, specifications: copy });
                          }}
                          className="col-span-2 bg-[#0d0f14] border border-white/10 rounded-xl px-2.5 py-1.5 text-white text-[11px] focus:outline-none focus:border-[#ff5722]"
                        />
                        <input
                          type="text"
                          placeholder="Specification (e.g. 42 hours)"
                          value={spec.value}
                          onChange={(e) => {
                            const copy = [...productForm.specifications];
                            copy[idx] = { ...copy[idx], value: e.target.value };
                            setProductForm({ ...productForm, specifications: copy });
                          }}
                          className="col-span-2 bg-[#0d0f14] border border-white/10 rounded-xl px-2.5 py-1.5 text-white text-[11px] focus:outline-none focus:border-[#ff5722]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const copy = productForm.specifications.filter((_, i) => i !== idx);
                            setProductForm({ ...productForm, specifications: copy });
                          }}
                          className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg justify-self-start"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Flags */}
                  <div className="pt-2 border-t border-white/5 flex flex-wrap gap-4 items-center">
                    <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={productForm.featured}
                        onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                        className="rounded accent-[#ff5722]"
                      />
                      <span>Featured on Homepage</span>
                    </label>

                    <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={productForm.has3dModel}
                        onChange={(e) => setProductForm({ ...productForm, has3dModel: e.target.checked })}
                        className="rounded accent-[#ff5722]"
                      />
                      <span>Interactive 3D Inspector Model</span>
                    </label>

                    <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={productForm.active}
                        onChange={(e) => setProductForm({ ...productForm, active: e.target.checked })}
                        className="rounded accent-[#ff5722]"
                      />
                      <span>Active for Sale</span>
                    </label>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-white/10 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsProductModalOpen(false)}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-[#ff5722] hover:bg-[#f4511e] text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-[#ff5722]/20 cursor-pointer"
                    >
                      {editingProductId ? 'Save Product Changes' : 'Create Product'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: NAVIGATION BAR & BRAND MANAGER */}
      {activeTab === 'navigation' && (
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">Navigation Bar &amp; Brand Identity</h2>
              <p className="text-xs text-slate-400">
                Customize menu items, categories, order, visibility, and logo branding displayed in the header.
              </p>
            </div>

            <button
              onClick={handleOpenAddNav}
              className="px-4 py-2 bg-[#ff5722] hover:bg-[#f4511e] text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-[#ff5722]/20 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Menu Item</span>
            </button>
          </div>

          {/* Brand Logo & Title Settings */}
          <div className="p-6 rounded-2xl bg-[#141721] border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#ff5722]" />
              Brand Logo &amp; Header Identity
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Preview */}
              <div className="p-4 rounded-xl bg-[#0d0f14] border border-white/5 flex flex-col items-center justify-center text-center space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Live Header Logo Preview
                </span>
                <ThizLogo size="lg" />
              </div>

              {/* Form */}
              <form onSubmit={handleSaveBrandSettings} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-200 mb-1">Logo Presentation Mode</label>
                  <select
                    value={brandSettings.logoType}
                    onChange={(e) => setBrandSettings({ ...brandSettings, logoType: e.target.value as any })}
                    className="w-full bg-[#0d0f14] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#ff5722]"
                  >
                    <option value="monogram">THIZ Brand Monogram (Serif T&amp;H Flourish)</option>
                    <option value="image">Custom Uploaded Image URL</option>
                    <option value="text">Minimalist Text Emblem (TZ)</option>
                  </select>
                </div>

                {brandSettings.logoType === 'image' && (
                  <div>
                    <label className="block font-bold text-slate-200 mb-1">Custom Logo Image URL</label>
                    <input
                      type="url"
                      value={brandSettings.logoUrl}
                      onChange={(e) => setBrandSettings({ ...brandSettings, logoUrl: e.target.value })}
                      placeholder="https://.../logo.png"
                      className="w-full bg-[#0d0f14] border border-white/10 rounded-xl px-3 py-2 text-white font-mono text-[11px] focus:outline-none focus:border-[#ff5722]"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-200 mb-1">Store Name</label>
                    <input
                      type="text"
                      value={brandSettings.businessName}
                      onChange={(e) => setBrandSettings({ ...brandSettings, businessName: e.target.value })}
                      className="w-full bg-[#0d0f14] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#ff5722]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-200 mb-1">Tagline</label>
                    <input
                      type="text"
                      value={brandSettings.tagline}
                      onChange={(e) => setBrandSettings({ ...brandSettings, tagline: e.target.value })}
                      className="w-full bg-[#0d0f14] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#ff5722]"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#ff5722] hover:bg-[#f4511e] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-[#ff5722]/20 cursor-pointer"
                  >
                    Update Header Branding
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Navigation Links Table */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white">Menu Items Sequence &amp; Visibility</h3>

            <div className="rounded-2xl bg-[#141721] border border-white/10 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0d0f14] text-slate-400 font-semibold border-b border-white/5">
                  <tr>
                    <th className="p-3.5 w-16">Sequence</th>
                    <th className="p-3.5">Label</th>
                    <th className="p-3.5">Type</th>
                    <th className="p-3.5">Target Destination</th>
                    <th className="p-3.5">Badge</th>
                    <th className="p-3.5">Visible</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {(siteSettings.navItems || []).map((item, idx) => (
                    <tr key={item.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-3.5">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleMoveNav(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1 rounded hover:bg-white/10 text-slate-400 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                            title="Move up"
                          >
                            <MoveUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleMoveNav(idx, 'down')}
                            disabled={idx === (siteSettings.navItems || []).length - 1}
                            className="p-1 rounded hover:bg-white/10 text-slate-400 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                            title="Move down"
                          >
                            <MoveDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                      <td className="p-3.5 font-bold text-white">{item.label}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] uppercase font-mono text-slate-300">
                          {item.type}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono text-slate-300">{item.target}</td>
                      <td className="p-3.5">
                        {item.badge ? (
                          <span className="px-2 py-0.5 rounded-full bg-[#ff5722] text-white text-[10px] font-bold">
                            {item.badge}
                          </span>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>
                      <td className="p-3.5">
                        <button
                          onClick={() => updateNavItem(item.id, { visible: !item.visible })}
                          className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                            item.visible ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-500 bg-white/5'
                          }`}
                        >
                          {item.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          <span>{item.visible ? 'Active' : 'Hidden'}</span>
                        </button>
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditNav(item)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                            title="Edit menu link"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteNavItem(item.id)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                            title="Delete menu link"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add / Edit Nav Modal */}
          {isNavModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
              <div className="max-w-md w-full p-6 rounded-2xl bg-[#141721] border border-white/10 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <h3 className="text-base font-bold text-white">
                    {editingNavId ? 'Edit Navigation Item' : 'Add Navigation Item'}
                  </h3>
                  <button
                    onClick={() => setIsNavModalOpen(false)}
                    className="p-1 text-slate-400 hover:text-white"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveNav} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-bold text-slate-200 mb-1">Menu Label *</label>
                    <input
                      type="text"
                      required
                      value={navForm.label}
                      onChange={(e) => setNavForm({ ...navForm, label: e.target.value })}
                      placeholder="e.g. Acoustics, Keypads, Sale"
                      className="w-full bg-[#0d0f14] border border-white/10 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#ff5722]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-200 mb-1">Destination Type</label>
                    <select
                      value={navForm.type}
                      onChange={(e) => {
                        const newType = e.target.value as any;
                        let defTarget = 'home';
                        if (newType === 'category') defTarget = categories[0]?.name || 'Acoustics & Audio';
                        if (newType === 'custom') defTarget = 'https://';
                        setNavForm({ ...navForm, type: newType, target: defTarget });
                      }}
                      className="w-full bg-[#0d0f14] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#ff5722]"
                    >
                      <option value="view">App View (Home, Catalogue, Track Order)</option>
                      <option value="category">Product Category Filter</option>
                      <option value="custom">External URL / Custom Link</option>
                    </select>
                  </div>

                  {navForm.type === 'view' && (
                    <div>
                      <label className="block font-bold text-slate-200 mb-1">Target View</label>
                      <select
                        value={navForm.target}
                        onChange={(e) => setNavForm({ ...navForm, target: e.target.value })}
                        className="w-full bg-[#0d0f14] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#ff5722]"
                      >
                        <option value="home">Home (Hero &amp; 3D Showcase)</option>
                        <option value="catalog">Catalogue (All Goods)</option>
                        <option value="order-tracking">Order Tracking (bKash Status)</option>
                      </select>
                    </div>
                  )}

                  {navForm.type === 'category' && (
                    <div>
                      <label className="block font-bold text-slate-200 mb-1">Select Category</label>
                      <select
                        value={navForm.target}
                        onChange={(e) => setNavForm({ ...navForm, target: e.target.value })}
                        className="w-full bg-[#0d0f14] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#ff5722]"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {navForm.type === 'custom' && (
                    <div>
                      <label className="block font-bold text-slate-200 mb-1">External Target URL</label>
                      <input
                        type="text"
                        value={navForm.target}
                        onChange={(e) => setNavForm({ ...navForm, target: e.target.value })}
                        placeholder="https://example.com"
                        className="w-full bg-[#0d0f14] border border-white/10 rounded-xl px-3.5 py-2 text-white font-mono text-[11px] focus:outline-none focus:border-[#ff5722]"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block font-bold text-slate-200 mb-1">
                      Badge Text (Optional e.g. "NEW", "HOT", "SALE")
                    </label>
                    <input
                      type="text"
                      value={navForm.badge}
                      onChange={(e) => setNavForm({ ...navForm, badge: e.target.value })}
                      placeholder="e.g. HOT"
                      className="w-full bg-[#0d0f14] border border-white/10 rounded-xl px-3.5 py-2 text-white uppercase focus:outline-none focus:border-[#ff5722]"
                    />
                  </div>

                  <div className="pt-2 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="nav-visible-check"
                      checked={navForm.visible}
                      onChange={(e) => setNavForm({ ...navForm, visible: e.target.checked })}
                      className="rounded accent-[#ff5722]"
                    />
                    <label htmlFor="nav-visible-check" className="text-slate-300 font-semibold cursor-pointer">
                      Visible in Navigation Bar
                    </label>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsNavModalOpen(false)}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#ff5722] hover:bg-[#f4511e] text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-[#ff5722]/20 cursor-pointer"
                    >
                      {editingNavId ? 'Update Link' : 'Add Link'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 6: BKASH & STORE CONFIGURATION */}
      {activeTab === 'settings' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white">Store Configuration &amp; bKash Account</h2>
            <p className="text-xs text-slate-400">
              Update your live bKash receiving number, delivery charges, and announcement banner without editing code.
            </p>
          </div>

          <form onSubmit={handleSaveSettings} className="p-6 rounded-2xl bg-[#141721] border border-white/10 space-y-4 text-xs">
            <div>
              <label className="block text-slate-200 font-bold mb-1">
                Official bKash Receiving Number *
              </label>
              <input
                type="text"
                required
                value={settingsForm.bkashNumber}
                onChange={(e) => setSettingsForm({ ...settingsForm, bkashNumber: e.target.value })}
                className="w-full bg-[#0d0f14] border border-white/10 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-[#ff5722]"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Displayed to customers during checkout with instant copy button.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-200 font-bold mb-1">
                  bKash Account Type
                </label>
                <select
                  value={settingsForm.bkashAccountType}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      bkashAccountType: e.target.value as 'Merchant' | 'Personal',
                    })
                  }
                  className="w-full bg-[#0d0f14] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#ff5722]"
                >
                  <option value="Merchant">Merchant (Make Payment)</option>
                  <option value="Personal">Personal (Send Money)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-200 font-bold mb-1">
                  Free Shipping Threshold (BDT)
                </label>
                <input
                  type="number"
                  value={settingsForm.freeShippingThreshold}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      freeShippingThreshold: Number(e.target.value),
                    })
                  }
                  className="w-full bg-[#0d0f14] border border-white/10 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-[#ff5722]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-200 font-bold mb-1">
                  Standard Delivery Fee (BDT)
                </label>
                <input
                  type="number"
                  value={settingsForm.deliveryChargeStandard}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      deliveryChargeStandard: Number(e.target.value),
                    })
                  }
                  className="w-full bg-[#0d0f14] border border-white/10 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-[#ff5722]"
                />
              </div>

              <div>
                <label className="block text-slate-200 font-bold mb-1">
                  Express Delivery Fee (BDT)
                </label>
                <input
                  type="number"
                  value={settingsForm.deliveryChargeExpress}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      deliveryChargeExpress: Number(e.target.value),
                    })
                  }
                  className="w-full bg-[#0d0f14] border border-white/10 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-[#ff5722]"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-200 font-bold mb-1">
                Store Announcement Bar Text
              </label>
              <input
                type="text"
                value={settingsForm.announcementText}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, announcementText: e.target.value })
                }
                className="w-full bg-[#0d0f14] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#ff5722]"
              />
            </div>

            <div className="pt-3 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#ff5722] hover:bg-[#f4511e] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#ff5722]/20 cursor-pointer"
              >
                Save Settings
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

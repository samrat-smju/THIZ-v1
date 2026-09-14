export interface ProductSpecification {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  category: string;
  sku: string;
  stock: number;
  rating: number;
  reviewCount: number;
  images: string[];
  description: string;
  shortDescription: string;
  specifications: ProductSpecification[];
  featured: boolean;
  active: boolean;
  has3dModel?: boolean;
  tags: string[];
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'PENDING_VERIFICATION'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REJECTED';

export type PaymentStatus =
  | 'UNPAID'
  | 'PENDING_VERIFICATION'
  | 'PAID'
  | 'REJECTED';

export type PaymentMethod = 'BKASH_MANUAL' | 'CASH_ON_DELIVERY';

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  total: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: {
    fullName: string;
    phone: string;
    email?: string;
    address: string;
    city: string;
    notes?: string;
  };
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  paymentVerification?: {
    transactionId: string;
    senderPhone: string;
    reference?: string;
    submittedAt: string;
    verifiedAt?: string;
    verifiedBy?: string;
    rejectionReason?: string;
  };
  adminNotes?: string;
  timeline: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface NavItem {
  id: string;
  label: string;
  type: 'view' | 'category' | 'custom';
  target: string; // e.g. 'home', 'catalog', 'order-tracking', or category name, or URL
  visible: boolean;
  order: number;
  badge?: string;
}

export interface SiteSettings {
  businessName: string;
  tagline: string;
  contactPhone: string;
  contactEmail: string;
  businessAddress: string;
  bkashNumber: string;
  bkashAccountType: 'Merchant' | 'Personal';
  deliveryChargeStandard: number;
  deliveryChargeExpress: number;
  freeShippingThreshold: number;
  currencySymbol: string;
  currencyCode: string;
  announcementText: string;
  announcementActive: boolean;
  logoUrl?: string;
  logoType?: 'monogram' | 'image' | 'text';
  navItems: NavItem[];
  socials: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
}

export type ViewState =
  | 'home'
  | 'catalog'
  | 'product-details'
  | 'cart'
  | 'checkout'
  | 'order-tracking'
  | 'admin';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}

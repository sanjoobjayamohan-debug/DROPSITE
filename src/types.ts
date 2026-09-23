export type ProductCategory = 'Men' | 'Women' | 'Children' | 'All';

export type ClothingMaterial =
  | '100% Pure Cotton'
  | 'Chanderi Silk'
  | 'Mulmul Cotton'
  | 'Linen Blend'
  | 'Georgette'
  | 'Rayon Slub'
  | 'Raw Denim'
  | 'Banarasi Jacquard'
  | 'Kanjeevaram Silk'
  | 'Organic Hosiery Cotton';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  subCategory?: string; // e.g. 'Kurtas', 'Sarees', 'Shirts', 'Kids Sets', 'Lehengas'
  material: ClothingMaterial | string;
  tagline: string;
  description: string;
  price: number; // Retail resale price in ₹ (e.g. 999)
  originalMrp: number; // Strikethrough M.R.P. in ₹ (e.g. 2499)
  supplierCost: number; // Textile manufacturer wholesale cost in ₹ (e.g. 399)
  shippingCost: number; // Domestic courier cost in ₹ (e.g. 49)
  resellerMargin?: number; // Your commission / profit per unit in ₹
  supplierSku: string;
  supplierName: string;
  supplierOrigin: string; // e.g. 'Surat Textile Hub, Gujarat', 'Tirupur Hosiery Cluster, TN', 'Jaipur Sanganer, Rajasthan'
  leadTimeDays: number;
  stock: number;
  safetyStockThreshold: number;
  inStock: boolean;
  autoSyncSupplier: boolean;
  image: string;
  images?: string[]; // Up to 5 product images
  galleryImages: string[]; // Up to 5 product images
  sizes: string[]; // e.g. ['S', 'M', 'L', 'XL', 'XXL']
  specs: { label: string; value: string }[];
  rating: number;
  reviewCount: number;
  featured?: boolean;
}

export type OrderStatus = 'Unfulfilled' | 'Supplier Placed' | 'In Transit' | 'Delivered' | 'Cancelled';

export type CourierType =
  | 'Delhivery Express'
  | 'Delhivery Surface Express'
  | 'BlueDart Air'
  | 'BlueDart Air Express'
  | 'BlueDart Apex Priority'
  | 'Ekart Logistics'
  | 'Shadowfax Superfast'
  | 'DTDC Premium'
  | 'DTDC Super Express'
  | 'Xpressbees Fashion Logistics'
  | 'India Post Speed Post';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  supplierCost: number;
  quantity: number;
  image: string;
  selectedSize?: string;
  material?: string;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string; // Indian 10-digit mobile number
  landmark: string; // Landmark e.g. "Near Apollo Pharmacy / Opp. Metro Gate 2"
  address: string;
  pincode: string; // 6-digit Indian PIN code
  zip?: string;
  city: string;
  state: string;
  country: string;
}

export type PaymentMethod =
  | 'UPI (GPay / PhonePe / Paytm / BHIM)'
  | 'Cash on Delivery (COD)'
  | 'Debit / Credit Card (RuPay / Visa / MC)'
  | 'Net Banking';

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customer: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  totalSupplierCost: number;
  netProfit: number;
  status: OrderStatus;
  courier: CourierType;
  trackingNumber: string;
  trackingHistory: {
    status: string;
    location: string;
    timestamp: string;
    completed: boolean;
  }[];
  paymentMethod: PaymentMethod;
  lastEmailSent?: string;
}

export interface HeroBannerConfig {
  festivalTitle: string; // e.g. "FLIPKART & MYNTRA RESELLER GRAND FESTIVAL"
  mainHeadline: string; // e.g. "Pure Indian Fabrics & Trending Apparel"
  highlightSpan: string; // e.g. "Direct From Master Weavers"
  description: string;
  badgeDiscount: string; // e.g. "FLAT 50% - 75% OFF · COD AVAILABLE"
  ctaPrimaryText: string;
  ctaPrimaryCategory: ProductCategory;
  heroImage: string; // Primary hero image
  heroSecondaryImage: string;
  announcementTicker: string[];
  activeSaleOffer: string; // e.g. "Use Coupon: DESI20 for extra ₹200 OFF"
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  author: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
  status: 'Approved' | 'Pending' | 'Hidden';
  merchantReply?: string;
  likes: number;
}

export interface EmailLog {
  id: string;
  orderNumber: string;
  recipientEmail: string;
  type: 'Order Confirmation' | 'Tracking Information' | 'Out for Delivery' | 'Delivery Confirmed' | 'Price Drop Alert' | 'Price Drop Subscription';
  subject: string;
  sentAt: string;
  status: 'Delivered' | 'Sending' | 'Failed';
  trackingNumber?: string;
  courier?: string;
}

export interface PriceDropSubscription {
  id: string;
  productId: string;
  productName: string;
  currentPriceAtSubscription: number;
  targetPrice?: number;
  email: string;
  createdAt: string;
  status: 'Active' | 'Notified';
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
}

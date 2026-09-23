import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  Order,
  Review,
  EmailLog,
  CartItem,
  OrderStatus,
  CourierType,
  CustomerInfo,
  PaymentMethod,
  PriceDropSubscription,
  HeroBannerConfig,
  ProductCategory,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_REVIEWS,
  INITIAL_EMAIL_LOGS,
  INITIAL_PRICE_DROP_SUBSCRIPTIONS,
  INITIAL_HERO_CONFIG,
} from '../data/mockData';

export const formatINR = (val: number): string => {
  return '₹' + Math.round(val || 0).toLocaleString('en-IN');
};

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning';
  title: string;
  message: string;
}

interface StoreContextType {
  products: Product[];
  orders: Order[];
  reviews: Review[];
  emailLogs: EmailLog[];
  cart: CartItem[];
  currentView: 'storefront' | 'backend' | 'tracking';
  backendTab: 'analytics' | 'products' | 'orders' | 'inventory' | 'reviews' | 'emails' | 'hero';
  selectedProduct: Product | null;
  isCartOpen: boolean;
  isSearchOpen: boolean;
  isCheckoutOpen: boolean;
  searchQuery: string;
  selectedCategory: ProductCategory;
  selectedMaterial: string;
  activeTrackingOrder: Order | null;
  toasts: ToastMessage[];
  discountCode: string;
  appliedDiscount: number; // percentage, e.g. 0.10 for 10%
  heroConfig: HeroBannerConfig;
  
  // View setters
  setCurrentView: (view: 'storefront' | 'backend' | 'tracking') => void;
  setBackendTab: (tab: 'analytics' | 'products' | 'orders' | 'inventory' | 'reviews' | 'emails' | 'hero') => void;
  setSelectedProduct: (product: Product | null) => void;
  setIsCartOpen: (open: boolean) => void;
  setIsSearchOpen: (open: boolean) => void;
  setIsCheckoutOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: ProductCategory) => void;
  setSelectedMaterial: (material: string) => void;
  setActiveTrackingOrder: (order: Order | null) => void;
  updateHeroConfig: (updates: Partial<HeroBannerConfig>) => void;
  openDashboardInNewTab: () => void;

  // Cart actions
  addToCart: (product: Product, quantity?: number, selectedSize?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyPromoCode: (code: string) => boolean;

  // Product actions (Backend)
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleStockStatus: (id: string) => void;

  // Order actions
  placeOrder: (customer: CustomerInfo, paymentMethod: PaymentMethod, courier: CourierType, shippingFee: number) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  assignTracking: (orderId: string, trackingNumber: string, courier: CourierType) => void;
  fulfillWithSupplier: (orderId: string) => void;

  // Review actions
  submitReview: (review: Omit<Review, 'id' | 'date' | 'likes'>) => void;
  updateReviewStatus: (reviewId: string, status: 'Approved' | 'Pending' | 'Hidden') => void;
  replyToReview: (reviewId: string, replyText: string) => void;

  // Email notifications
  sendAutomatedEmail: (order: Order, type: EmailLog['type'], customNote?: string) => void;

  // Price drop alerts
  priceDropSubscriptions: PriceDropSubscription[];
  subscribePriceDrop: (productId: string, email: string, targetPrice?: number) => boolean;
  unsubscribePriceDrop: (subscriptionId: string) => void;

  // Helpers
  showToast: (title: string, message: string, type?: 'success' | 'info' | 'warning') => void;
  dismissToast: (id: string) => void;
  trackOrderLookup: (query: string) => Order | null;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state with localStorage or mock data
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('aura_products_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].material) {
          return parsed;
        }
      } catch (e) {}
    }
    return INITIAL_PRODUCTS;
  });

  const [heroConfig, setHeroConfig] = useState<HeroBannerConfig>(() => {
    const saved = localStorage.getItem('aura_hero_config_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_HERO_CONFIG;
  });

  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('All');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('All');

  const [priceDropSubscriptions, setPriceDropSubscriptions] = useState<PriceDropSubscription[]>(() => {
    const saved = localStorage.getItem('aura_price_drop_subscriptions_v3');
    return saved ? JSON.parse(saved) : INITIAL_PRICE_DROP_SUBSCRIPTIONS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('aura_orders_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].customer?.landmark !== undefined) {
          return parsed;
        }
      } catch (e) {}
    }
    return INITIAL_ORDERS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('aura_reviews_v3');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [emailLogs, setEmailLogs] = useState<EmailLog[]>(() => {
    const saved = localStorage.getItem('aura_email_logs_v3');
    return saved ? JSON.parse(saved) : INITIAL_EMAIL_LOGS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('aura_cart_v3');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentView, setCurrentView] = useState<'storefront' | 'backend' | 'tracking'>(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get('view') === 'backend' || window.location.hash.includes('backend')) {
        return 'backend';
      }
      if (searchParams.get('view') === 'tracking') {
        return 'tracking';
      }
    }
    return 'storefront';
  });

  const [backendTab, setBackendTab] = useState<'analytics' | 'products' | 'orders' | 'inventory' | 'reviews' | 'emails' | 'hero'>('products');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<Order | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('aura_products_v3', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('aura_hero_config_v2', JSON.stringify(heroConfig));
  }, [heroConfig]);

  useEffect(() => {
    localStorage.setItem('aura_orders_v3', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('aura_reviews_v3', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('aura_email_logs_v3', JSON.stringify(emailLogs));
  }, [emailLogs]);

  useEffect(() => {
    localStorage.setItem('aura_cart_v3', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('aura_price_drop_subscriptions_v3', JSON.stringify(priceDropSubscriptions));
  }, [priceDropSubscriptions]);

  const updateHeroConfig = (updates: Partial<HeroBannerConfig>) => {
    setHeroConfig((prev) => {
      const next = { ...prev, ...updates };
      return next;
    });
    showToast('Hero Section Updated', 'Storefront homepage banners updated successfully!');
  };

  const openDashboardInNewTab = () => {
    const url = window.location.origin + window.location.pathname + '?view=backend';
    window.open(url, '_blank');
  };

  const showToast = (title: string, message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = 'toast_' + Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1, selectedSize?: string) => {
    const chosenSize = selectedSize || product.sizes?.[0] || 'Standard';
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.product.id === product.id && item.selectedSize === chosenSize
      );
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.selectedSize === chosenSize
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, selectedSize: chosenSize }];
    });
    showToast('Added to Cart', `${product.name} (${chosenSize}) x${quantity}`);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const applyPromoCode = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'DESI20' || clean === 'FIRST20' || clean === 'BHARAT20') {
      setDiscountCode(clean);
      setAppliedDiscount(0.2);
      showToast('Festive Reseller Code Applied', '20% discount (up to ₹500) applied to your order!');
      return true;
    } else if (clean === 'BHARAT15' || clean === 'MYNTRA15') {
      setDiscountCode(clean);
      setAppliedDiscount(0.15);
      showToast('Promo Code Applied', '15% festive discount applied!');
      return true;
    } else if (clean === 'AURAVIP10' || clean === 'RESELLER10') {
      setDiscountCode(clean);
      setAppliedDiscount(0.1);
      showToast('Reseller Discount Applied', '10% partner discount applied!');
      return true;
    }
    showToast('Invalid Code', 'Try using code "DESI20" or "BHARAT15" for festive discounts.', 'warning');
    return false;
  };

  // Product operations
  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: 'prod-' + Date.now(),
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast('Product Created', `${newProduct.name} mapped to supplier ${newProduct.supplierName}`);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    const currentProduct = products.find((p) => p.id === id);
    const oldPrice = currentProduct ? currentProduct.price : undefined;
    const newPrice = updates.price;

    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );

    // If price was decreased, trigger automated price drop alert emails!
    if (currentProduct && oldPrice !== undefined && newPrice !== undefined && newPrice < oldPrice) {
      const activeSubs = priceDropSubscriptions.filter(
        (sub) => sub.productId === id && sub.status === 'Active'
      );

      let notifiedCount = 0;
      activeSubs.forEach((sub) => {
        // Trigger if newPrice <= targetPrice or if no targetPrice set
        if (!sub.targetPrice || newPrice <= sub.targetPrice) {
          notifiedCount++;
          const alertEmailLog: EmailLog = {
            id: 'em-drop-' + Date.now() + Math.random().toString(36).substring(2, 5),
            orderNumber: 'ALERT-' + Math.floor(1000 + Math.random() * 9000),
            recipientEmail: sub.email,
            type: 'Price Drop Alert',
            subject: `🔥 Price Drop Alert: ${currentProduct.name} is now ₹${newPrice} (was ₹${oldPrice})`,
            sentAt: new Date().toLocaleString('en-IN', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }),
            status: 'Delivered',
          };
          setEmailLogs((prevLogs) => [alertEmailLog, ...prevLogs]);
        }
      });

      if (notifiedCount > 0) {
        setPriceDropSubscriptions((prev) =>
          prev.map((sub) =>
            sub.productId === id && (!sub.targetPrice || newPrice <= sub.targetPrice)
              ? { ...sub, status: 'Notified' as const }
              : sub
          )
        );
        showToast(
          'Price Drop Broadcast Sent',
          `Dispatched automated email notifications to ${notifiedCount} subscriber(s).`,
          'success'
        );
      }
    }

    showToast('Product Updated', 'Catalog entry synchronized.');
  };

  const subscribePriceDrop = (productId: string, email: string, targetPrice?: number): boolean => {
    const product = products.find((p) => p.id === productId);
    if (!product) return false;

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      showToast('Invalid Email', 'Please enter a valid email address.', 'warning');
      return false;
    }

    const existingIndex = priceDropSubscriptions.findIndex(
      (sub) => sub.productId === productId && sub.email.toLowerCase() === trimmedEmail
    );

    const thresholdPrice = targetPrice !== undefined && targetPrice > 0 ? targetPrice : Math.round(product.price * 0.9);

    if (existingIndex >= 0) {
      setPriceDropSubscriptions((prev) =>
        prev.map((s, idx) =>
          idx === existingIndex
            ? {
                ...s,
                targetPrice: thresholdPrice,
                status: 'Active',
                createdAt: new Date().toISOString(),
              }
            : s
        )
      );
      showToast(
        'Price Drop Alert Updated',
        `We'll notify ${trimmedEmail} if ${product.name} drops below ₹${thresholdPrice}.`
      );
    } else {
      const newSub: PriceDropSubscription = {
        id: 'sub-' + Date.now(),
        productId,
        productName: product.name,
        currentPriceAtSubscription: product.price,
        targetPrice: thresholdPrice,
        email: trimmedEmail,
        createdAt: new Date().toISOString(),
        status: 'Active',
      };
      setPriceDropSubscriptions((prev) => [newSub, ...prev]);

      // Trigger instant confirmation email log
      const confirmLog: EmailLog = {
        id: 'em-sub-' + Date.now(),
        orderNumber: 'ALERT-' + Math.floor(1000 + Math.random() * 9000),
        recipientEmail: trimmedEmail,
        type: 'Price Drop Subscription',
        subject: `Price Drop Alert Confirmed: ${product.name} (Alert set at ₹${thresholdPrice})`,
        sentAt: new Date().toLocaleString('en-IN', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        status: 'Delivered',
      };
      setEmailLogs((prev) => [confirmLog, ...prev]);

      showToast(
        'Price Drop Alert Confirmed',
        `We'll email ${trimmedEmail} the moment ${product.name} drops below ₹${thresholdPrice}.`,
        'success'
      );
    }
    return true;
  };

  const unsubscribePriceDrop = (subscriptionId: string) => {
    setPriceDropSubscriptions((prev) => prev.filter((s) => s.id !== subscriptionId));
    showToast('Alert Cancelled', 'You will no longer receive price alerts for this product.');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Product Removed', 'Removed from storefront catalog.');
  };

  const toggleStockStatus = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, inStock: !p.inStock } : p))
    );
  };

  // Email helper
  const sendAutomatedEmail = (order: Order, type: EmailLog['type'], customNote?: string) => {
    const logId = 'em-' + Date.now();
    let subject = '';
    if (type === 'Order Confirmation') {
      subject = `Thank you for your order #${order.orderNumber} — AURA Desi Fashion`;
    } else if (type === 'Tracking Information') {
      subject = `Tracking Update: Order #${order.orderNumber} dispatched via ${order.courier} (${order.trackingNumber})`;
    } else if (type === 'Out for Delivery') {
      subject = `Out for Delivery: Order #${order.orderNumber} is arriving today`;
    } else if (type === 'Delivery Confirmed') {
      subject = `Delivered: Your package #${order.orderNumber} has arrived`;
    }

    const newLog: EmailLog = {
      id: logId,
      orderNumber: order.orderNumber,
      recipientEmail: order.customer.email,
      type,
      subject,
      sentAt: new Date().toLocaleString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: 'Delivered',
      trackingNumber: order.trackingNumber || undefined,
      courier: order.courier,
    };

    setEmailLogs((prev) => [newLog, ...prev]);
    showToast(
      'Automated Email Dispatched',
      `${type} sent to ${order.customer.email}`,
      'info'
    );
  };

  // Place order
  const placeOrder = (
    customer: CustomerInfo,
    paymentMethod: PaymentMethod,
    courier: CourierType,
    shippingFee: number
  ): Order => {
    const rawSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const discountAmount = rawSubtotal * appliedDiscount;
    const finalTotal = rawSubtotal - discountAmount + shippingFee;
    const totalSupplierCost = cart.reduce(
      (sum, item) => sum + item.product.supplierCost * item.quantity,
      0
    );
    const netProfit = finalTotal - totalSupplierCost - shippingFee;

    const orderNumber = 'IND-' + Math.floor(10000 + Math.random() * 90000);
    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      orderNumber,
      createdAt: new Date().toISOString(),
      customer,
      items: cart.map((c) => ({
        productId: c.product.id,
        name: c.product.name,
        price: c.product.price,
        supplierCost: c.product.supplierCost,
        quantity: c.quantity,
        image: c.product.image,
        selectedSize: c.selectedSize,
        material: typeof c.product.material === 'string' ? c.product.material : undefined,
      })),
      subtotal: Math.round(rawSubtotal),
      shippingFee,
      discount: Math.round(discountAmount),
      total: Math.round(finalTotal),
      totalSupplierCost: Math.round(totalSupplierCost),
      netProfit: Math.round(netProfit),
      status: 'Unfulfilled',
      courier,
      trackingNumber: '',
      trackingHistory: [
        {
          status: 'Order Placed & Verified',
          location: 'AURA Storefront',
          timestamp: 'Just now',
          completed: true,
        },
        {
          status: 'Direct Weaver Sourcing Sync',
          location: 'Textile Hub Fulfillment Queue',
          timestamp: 'Pending dispatch',
          completed: false,
        },
      ],
      paymentMethod,
      lastEmailSent: `Order Confirmation sent ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Send automated Order Confirmation email
    sendAutomatedEmail(newOrder, 'Order Confirmation');

    // Deduct stock
    setProducts((prev) =>
      prev.map((p) => {
        const cartMatch = cart.find((c) => c.product.id === p.id);
        if (cartMatch) {
          const nextStock = Math.max(0, p.stock - cartMatch.quantity);
          return {
            ...p,
            stock: nextStock,
            inStock: nextStock > 0,
          };
        }
        return p;
      })
    );

    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updated = { ...ord, status };
          if (status === 'Delivered') {
            sendAutomatedEmail(updated, 'Delivery Confirmed');
          } else if (status === 'In Transit' && updated.trackingNumber) {
            sendAutomatedEmail(updated, 'Tracking Information');
          }
          return updated;
        }
        return ord;
      })
    );
    showToast('Order Status Updated', `Order set to ${status}`);
  };

  const assignTracking = (orderId: string, trackingNumber: string, courier: CourierType) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updated: Order = {
            ...ord,
            courier,
            trackingNumber,
            status: 'In Transit',
            trackingHistory: [
              ...ord.trackingHistory,
              {
                status: 'Handed to Courier ' + courier,
                location: 'Consolidation Air Hub',
                timestamp: 'Just now',
                completed: true,
              },
            ],
            lastEmailSent: `Tracking Update sent ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
          };
          sendAutomatedEmail(updated, 'Tracking Information');
          return updated;
        }
        return ord;
      })
    );
    showToast('Tracking Dispatched', `Tracking #${trackingNumber} assigned with automated email update.`);
  };

  const fulfillWithSupplier = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    // Generate realistic carrier tracking number based on courier
    let prefix = 'YT';
    if (order.courier.includes('Yanwen')) prefix = 'YW';
    if (order.courier.includes('DHL')) prefix = 'DHL';
    if (order.courier.includes('ePacket')) prefix = 'EP';

    const generatedTracking = `${prefix}${Math.floor(100000000 + Math.random() * 900000000)}US`;

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updated: Order = {
            ...ord,
            status: 'Supplier Placed',
            trackingNumber: generatedTracking,
            trackingHistory: [
              {
                status: 'Order Placed',
                location: 'AURA Storefront',
                timestamp: ord.createdAt.slice(0, 10),
                completed: true,
              },
              {
                status: 'Supplier Order Placed',
                location: 'Shenzhen / Ningbo Direct Logistics Hub',
                timestamp: 'Just now',
                completed: true,
              },
              {
                status: 'Awaiting Carrier Airport Scan',
                location: 'Hong Kong International Gateway',
                timestamp: 'In 24h',
                completed: false,
              },
            ],
          };
          sendAutomatedEmail(updated, 'Tracking Information');
          return updated;
        }
        return ord;
      })
    );
    showToast('Supplier Order Synchronized', `Order #${order.orderNumber} sent to supplier. Tracking #${generatedTracking} created.`);
  };

  // Review operations
  const submitReview = (reviewData: Omit<Review, 'id' | 'date' | 'likes'>) => {
    const newReview: Review = {
      ...reviewData,
      id: 'rev-' + Date.now(),
      date: 'Just now',
      likes: 0,
    };
    setReviews((prev) => [newReview, ...prev]);
    showToast('Review Submitted', 'Thank you! Your feedback is in moderation.');
  };

  const updateReviewStatus = (reviewId: string, status: 'Approved' | 'Pending' | 'Hidden') => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, status } : r))
    );
    showToast('Review Updated', `Review set to ${status}`);
  };

  const replyToReview = (reviewId: string, replyText: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, merchantReply: replyText } : r))
    );
    showToast('Reply Saved', 'Merchant response published.');
  };

  const trackOrderLookup = (query: string): Order | null => {
    const clean = query.trim().toLowerCase();
    const found = orders.find(
      (o) =>
        o.orderNumber.toLowerCase() === clean ||
        o.trackingNumber.toLowerCase() === clean ||
        o.customer.email.toLowerCase() === clean
    );
    return found || null;
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        orders,
        reviews,
        emailLogs,
        cart,
        currentView,
        backendTab,
        selectedProduct,
        isCartOpen,
        isSearchOpen,
        isCheckoutOpen,
        searchQuery,
        selectedCategory,
        selectedMaterial,
        activeTrackingOrder,
        toasts,
        discountCode,
        appliedDiscount,
        heroConfig,
        setCurrentView,
        setBackendTab,
        setSelectedProduct,
        setIsCartOpen,
        setIsSearchOpen,
        setIsCheckoutOpen,
        setSearchQuery,
        setSelectedCategory,
        setSelectedMaterial,
        setActiveTrackingOrder,
        updateHeroConfig,
        openDashboardInNewTab,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyPromoCode,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleStockStatus,
        placeOrder,
        updateOrderStatus,
        assignTracking,
        fulfillWithSupplier,
        submitReview,
        updateReviewStatus,
        replyToReview,
        sendAutomatedEmail,
        priceDropSubscriptions,
        subscribePriceDrop,
        unsubscribePriceDrop,
        showToast,
        dismissToast,
        trackOrderLookup,
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

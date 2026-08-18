export interface MenuItemSize {
  name: string; // e.g. "Small (8\")", "Regular (10\")", "Large (13\")", "Jumbo"
  price: number;
}

export interface MenuItemAddon {
  id: string;
  name: string; // e.g. "Extra Cheese", "Dip Sauce", "Jalapeno & Olives", "Espresso Shot"
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  categoryId: string;
  description: string;
  price: number; // Base price
  sizes?: MenuItemSize[];
  addons?: MenuItemAddon[];
  imageUrl: string;
  isPopular?: boolean;
  isSpicy?: boolean;
  isVegetarian?: boolean;
  isAvailable: boolean;
  badge?: string; // e.g. "Chef's Signature", "Best Seller", "New"
  prepTimeMinutes?: number;
}

export interface MenuCategory {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  displayOrder: number;
}

export interface CartItem {
  id: string; // unique cart entry ID (item.id + size + addons hash)
  menuItem: MenuItem;
  selectedSize?: MenuItemSize;
  selectedAddons?: MenuItemAddon[];
  quantity: number;
  specialInstructions?: string;
  totalPrice: number;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
  description?: string;
  isActive: boolean;
  validUntil?: string;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface OrderCustomer {
  fullName: string;
  phone: string;
  email?: string;
  address: string;
  area: string; // e.g. "Kharian Cantt - Garrison", "Sadar Bazar", "Civil Lines", "GT Road", "Lalamusa Road"
  nearbyLandmark?: string;
  orderNotes?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. "BAR-8492"
  customer: OrderCustomer;
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  appliedCoupon?: Coupon;
  deliveryFee: number;
  totalAmount: number;
  paymentMethod: 'cash_on_delivery' | 'jazzcash' | 'easypaisa' | 'card_pos';
  orderType: 'delivery' | 'pickup';
  status: OrderStatus;
  createdAt: string;
  estimatedDeliveryTime?: string;
}

export interface HomepageCMS {
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroImageUrl: string;
  storyTitle: string;
  storyParagraph1: string;
  storyParagraph2: string;
  storyImageUrl: string;
  tagline: string;
  announcementText?: string;
  isAnnouncementActive?: boolean;
}

export interface RestaurantSettings {
  restaurantName: string;
  tagline: string;
  address: string;
  phone: string;
  mobile: string;
  whatsapp: string;
  email: string;
  openingHours: string;
  deliveryFee: number;
  freeDeliveryAbove: number;
  minimumOrderAmount: number;
  deliveryAreas: string[];
  isOpen: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email?: string;
  subject: string;
  message: string;
  createdAt: string;
  isResolved: boolean;
}

export interface Review {
  id: string;
  authorName: string;
  rating: number;
  comment: string;
  date: string;
  isApproved: boolean;
  avatarBg?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'kitchen';
}

export interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  todayOrdersCount: number;
}

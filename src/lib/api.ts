import {
  MenuItem,
  MenuCategory,
  Order,
  Coupon,
  HomepageCMS,
  RestaurantSettings,
  ContactMessage,
  Review,
  AdminUser,
  DashboardStats,
  OrderStatus,
} from '../types';

const STORAGE_KEYS = {
  MENU_ITEMS: 'baristas_menu_items_v1',
  CATEGORIES: 'baristas_categories_v1',
  ORDERS: 'baristas_orders_v1',
  COUPONS: 'baristas_coupons_v1',
  HOMEPAGE: 'baristas_homepage_v1',
  SETTINGS: 'baristas_settings_v1',
  MESSAGES: 'baristas_messages_v1',
  REVIEWS: 'baristas_reviews_v1',
  AUTH: 'baristas_auth_user_v1',
};

// Initial Seed Data for Kharian Cantt Restaurant
const DEFAULT_CATEGORIES: MenuCategory[] = [
  {
    id: 'cat-pizza',
    name: 'Artisan Pizzas',
    slug: 'pizzas',
    icon: '🍕',
    description: 'Crisp hand-stretched dough with rich mozzarella & signature sauces',
    displayOrder: 1,
  },
  {
    id: 'cat-burgers',
    name: 'Gourmet Burgers',
    slug: 'burgers',
    icon: '🍔',
    description: 'Juicy smashed and grilled patties served with golden fries',
    displayOrder: 2,
  },
  {
    id: 'cat-platters',
    name: 'Cantt Platters & Steaks',
    slug: 'platters',
    icon: '🥩',
    description: 'Grand sizzling platters with grilled meats, rice, and signature dips',
    displayOrder: 3,
  },
  {
    id: 'cat-sandwiches',
    name: 'Sandwiches & Wraps',
    slug: 'sandwiches',
    icon: '🥪',
    description: 'Toasted club sandwiches, tortilla wraps, and savory Paninis',
    displayOrder: 4,
  },
  {
    id: 'cat-coffee',
    name: 'Artisan Coffee & Tea',
    slug: 'coffee',
    icon: '☕',
    description: 'Freshly ground Arabica espresso, creamy lattes & Karak Chai',
    displayOrder: 5,
  },
  {
    id: 'cat-shakes',
    name: 'Shakes & Desserts',
    slug: 'shakes',
    icon: '🥤',
    description: 'Rich thick shakes, molten lava cakes, and ice cream sundaes',
    displayOrder: 6,
  },
  {
    id: 'cat-deals',
    name: 'Cantt Value Deals',
    slug: 'deals',
    icon: '🎁',
    description: 'Family combos and lunch boxes for friends and gatherings',
    displayOrder: 7,
  },
];

const DEFAULT_MENU_ITEMS: MenuItem[] = [
  {
    id: 'item-mughlai-pizza',
    name: 'Signature Mughlai Pizza',
    categoryId: 'cat-pizza',
    description: 'Tender spiced Mughlai chicken chunks, rich white cream sauce, capsicum, red onions, mushrooms & extra mozzarella.',
    price: 850,
    sizes: [
      { name: 'Small (8")', price: 850 },
      { name: 'Medium (10")', price: 1450 },
      { name: 'Large (13")', price: 2150 },
      { name: 'Jumbo Crown (16")', price: 2650 },
    ],
    addons: [
      { id: 'addon-cheese', name: 'Extra Mozzarella Cheese', price: 200 },
      { id: 'addon-crust', name: 'Cheese Stuffed Crust', price: 250 },
      { id: 'addon-dip', name: 'Garlic Mayo Dip', price: 80 },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    badge: "Chef's Signature",
    isAvailable: true,
    prepTimeMinutes: 20,
  },
  {
    id: 'item-fajita-sicilian',
    name: 'Fajita Sicilian Pizza',
    categoryId: 'cat-pizza',
    description: 'Smoky chicken fajita, spicy jalapenos, bell peppers, sweet corn, black olives, and spicy Sicilian marinara.',
    price: 800,
    sizes: [
      { name: 'Small (8")', price: 800 },
      { name: 'Medium (10")', price: 1390 },
      { name: 'Large (13")', price: 2050 },
      { name: 'Jumbo Crown (16")', price: 2550 },
    ],
    addons: [
      { id: 'addon-cheese', name: 'Extra Mozzarella Cheese', price: 200 },
      { id: 'addon-jalapeno', name: 'Extra Jalapeño & Olives', price: 120 },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    isSpicy: true,
    badge: 'Best Seller',
    isAvailable: true,
    prepTimeMinutes: 18,
  },
  {
    id: 'item-thunder-burger',
    name: 'Barista’s Thunder Crunch Burger',
    categoryId: 'cat-burgers',
    description: 'Crispy golden fried double chicken fillet dipped in secret spicy buffalo sauce, melted cheddar cheese, iceberg lettuce & garlic brioche bun.',
    price: 750,
    sizes: [
      { name: 'Single Fillet', price: 750 },
      { name: 'Double Thunder Monster', price: 1050 },
    ],
    addons: [
      { id: 'addon-cheese-slice', name: 'Extra Cheddar Slice', price: 90 },
      { id: 'addon-fries', name: 'Large Curly Fries', price: 220 },
      { id: 'addon-sauce', name: 'Chipotle Dip', price: 70 },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    isSpicy: true,
    badge: 'Top Rated',
    isAvailable: true,
    prepTimeMinutes: 15,
  },
  {
    id: 'item-smokey-beef-burger',
    name: 'Smokey Angus Beef Burger',
    categoryId: 'cat-burgers',
    description: '180g prime grilled beef patty, caramelized balsamic onions, smoked beef bacon strip, BBQ glaze & Monterey Jack cheese.',
    price: 950,
    sizes: [
      { name: 'Single Patty (180g)', price: 950 },
      { name: 'Double Patty (360g)', price: 1350 },
    ],
    addons: [
      { id: 'addon-egg', name: 'Fried Sunny Egg', price: 80 },
      { id: 'addon-bacon', name: 'Extra Smoked Bacon', price: 180 },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
    isPopular: false,
    badge: 'Gourmet Beef',
    isAvailable: true,
    prepTimeMinutes: 16,
  },
  {
    id: 'item-cantt-special-platter',
    name: 'Kharian Cantt Grand Sizzling Platter',
    categoryId: 'cat-platters',
    description: 'Sizzling grilled chicken steak with mushroom pepper sauce, 4 spicy wings, seasoned garlic butter rice, crispy fries & fresh garden salad.',
    price: 1650,
    addons: [
      { id: 'addon-extra-steak', name: 'Extra Chicken Breast', price: 450 },
      { id: 'addon-rice', name: 'Extra Herb Rice', price: 200 },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    badge: "Chef's Special",
    isAvailable: true,
    prepTimeMinutes: 25,
  },
  {
    id: 'item-club-sandwich',
    name: 'Supreme Tri-Layer Club Sandwich',
    categoryId: 'cat-sandwiches',
    description: 'Triple-decker toasted bread packed with roasted chicken shreds, fried egg, cheddar slice, tomatoes, cucumber, mayo & golden crinkle fries.',
    price: 680,
    imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80',
    isPopular: false,
    isAvailable: true,
    prepTimeMinutes: 12,
  },
  {
    id: 'item-spanish-latte',
    name: 'Signature Spanish Latte (Hot/Iced)',
    categoryId: 'cat-coffee',
    description: 'Double shot of freshly brewed Arabica espresso combined with steamed fresh milk and rich sweet condensed milk.',
    price: 490,
    sizes: [
      { name: 'Hot Regular (12oz)', price: 490 },
      { name: 'Hot Large (16oz)', price: 590 },
      { name: 'Iced Spanish Glass', price: 550 },
    ],
    addons: [
      { id: 'addon-espresso', name: 'Extra Espresso Shot', price: 110 },
      { id: 'addon-caramel', name: 'Caramel Syrup Drizzle', price: 80 },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    badge: 'Barista Special',
    isAvailable: true,
    prepTimeMinutes: 6,
  },
  {
    id: 'item-cappuccino',
    name: 'Artisan Velvet Cappuccino',
    categoryId: 'cat-coffee',
    description: 'Classic rich espresso crowned with dense, silky microfoam and dusted with dark Belgian cocoa powder.',
    price: 420,
    sizes: [
      { name: 'Standard (8oz)', price: 420 },
      { name: 'Grande (12oz)', price: 510 },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    prepTimeMinutes: 5,
  },
  {
    id: 'item-choco-bounty-shake',
    name: 'Choco Bounty Supreme Shake',
    categoryId: 'cat-shakes',
    description: 'Thick gourmet milkshake blended with real Bounty coconut chocolate bars, dark chocolate fudge, vanilla gelato & whipped cream.',
    price: 650,
    sizes: [
      { name: 'Regular Glass', price: 650 },
      { name: 'Monster Mug with Brownie', price: 890 },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    badge: 'Dessert Craze',
    isAvailable: true,
    prepTimeMinutes: 8,
  },
  {
    id: 'item-molten-lava',
    name: 'Warm Belgian Molten Lava Cake',
    categoryId: 'cat-shakes',
    description: 'Rich dark chocolate sponge with a warm oozing chocolate ganache center, served with a scoop of premium vanilla ice cream.',
    price: 550,
    imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
    badge: 'Sweet Tooth',
    isAvailable: true,
    prepTimeMinutes: 10,
  },
  {
    id: 'item-cantt-duo-deal',
    name: 'Cantt Duo Feast Deal',
    categoryId: 'cat-deals',
    description: '1 Medium Pizza (Any flavor), 1 Thunder Crunch Burger, 1 Large Fries & 2 Chilled Soft Drinks (500ml).',
    price: 2199,
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    badge: 'Save Rs. 450',
    isAvailable: true,
    prepTimeMinutes: 22,
  },
  {
    id: 'item-family-mega-deal',
    name: 'Barista’s Family Mega Feast',
    categoryId: 'cat-deals',
    description: '2 Large Pizzas, 2 Gourmet Burgers, 1 Grand Pasta or Wings (8pcs), 1.5L Beverage & Garlic Bread.',
    price: 4999,
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    badge: 'Best Family Value',
    isAvailable: true,
    prepTimeMinutes: 30,
  },
];

const DEFAULT_COUPONS: Coupon[] = [
  {
    id: 'coup-kharian15',
    code: 'KHARIAN15',
    discountType: 'percentage',
    discountValue: 15,
    minOrderAmount: 1200,
    maxDiscountAmount: 450,
    description: '15% OFF for all Kharian Cantt residents (Min Rs. 1200)',
    isActive: true,
  },
  {
    id: 'coup-canttfree',
    code: 'CANTTFREE',
    discountType: 'fixed',
    discountValue: 150,
    minOrderAmount: 800,
    description: 'Rs. 150 Flat discount to cover delivery fee',
    isActive: true,
  },
  {
    id: 'coup-baristas20',
    code: 'BARISTAS20',
    discountType: 'percentage',
    discountValue: 20,
    minOrderAmount: 2500,
    maxDiscountAmount: 800,
    description: '20% OFF on grand family orders (Min Rs. 2500)',
    isActive: true,
  },
];

const DEFAULT_HOMEPAGE: HomepageCMS = {
  heroTitle: 'WHERE EVERY CUP TELLS A STORY',
  heroSubtitle: 'Kharian Cantt, Punjab',
  heroDescription:
    'Experience the premium taste of Punjab’s finest coffee house and restaurant. From our signature Mughlai Pizzas to artisan brews and sizzling platters, every bite is crafted for excellence.',
  heroImageUrl:
    'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80',
  storyTitle: 'Crafted with Passion in Sadar Bazar, Kharian Cantt',
  storyParagraph1:
    'Established as a haven for food enthusiasts and coffee connoisseurs in Kharian Cantt, Barista’s Restaurant blends timeless culinary traditions with modern artisan recipes.',
  storyParagraph2:
    'Whether you are craving a stone-baked Mughlai crust, a double-stacked gourmet Angus burger, or a velvety Spanish Latte after duty, our kitchen guarantees fresh ingredients, hygiene, and hospitable warmth.',
  storyImageUrl:
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80',
  tagline: 'Artisan Flavors & Premium Hospitality in Kharian Cantt',
  announcementText: '⚡ Fast Cantt & Garrison Delivery Available • Call (053) 7611953',
  isAnnouncementActive: true,
};

const DEFAULT_SETTINGS: RestaurantSettings = {
  restaurantName: "Barista's Restaurant & Cafe",
  tagline: 'Artisan Coffee & Gourmet Kitchen',
  address: 'Sadar Bazar, Kharian Cantt, District Gujrat, Punjab, Pakistan',
  phone: '(053) 7611953',
  mobile: '0300-7611953',
  whatsapp: '+923007611953',
  email: 'info@baristas.pk',
  openingHours: '11:00 AM – 11:30 PM (Mon – Sun)',
  deliveryFee: 120,
  freeDeliveryAbove: 2000,
  minimumOrderAmount: 400,
  deliveryAreas: [
    'Kharian Cantt - Sadar Bazar',
    'Kharian Cantt - Army Garrison & Officers Colony',
    'Kharian City - GT Road',
    'Civil Lines & Model Town',
    'Lalamusa Road Sector',
    'Dingha Road Crossing',
  ],
  isOpen: true,
};

const DEFAULT_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    authorName: 'Major Hamza Malik',
    rating: 5,
    comment:
      'Undoubtedly the best dining atmosphere and stone oven pizzas in Kharian Cantt. The Mughlai Pizza and Spanish Latte are extraordinary.',
    date: 'August 14, 2024',
    isApproved: true,
    avatarBg: 'bg-amber-800',
  },
  {
    id: 'rev-2',
    authorName: 'Dr. Ayesha Tariq',
    rating: 5,
    comment:
      'We regularly order the Family Mega Feast for our hospital staff gatherings. Delivery inside the Cantt is always under 30 minutes, steaming hot!',
    date: 'August 10, 2024',
    isApproved: true,
    avatarBg: 'bg-stone-800',
  },
  {
    id: 'rev-3',
    authorName: 'Usman Ghani (GT Road)',
    rating: 5,
    comment:
      'Thunder Crunch Burger is loaded, spicy, and crunchy. The Bounty shake is a masterpiece. Highly recommended for weekend hangouts.',
    date: 'August 5, 2024',
    isApproved: true,
    avatarBg: 'bg-stone-900',
  },
];

const DEFAULT_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'BAR-7201',
    customer: {
      fullName: 'Capt. Bilal Raza',
      phone: '0312-9876543',
      address: 'House #14, Sector B, Garrison Colony',
      area: 'Kharian Cantt - Army Garrison & Officers Colony',
      nearbyLandmark: 'Near Station HQ',
      orderNotes: 'Please ring bell twice upon arrival',
    },
    items: [
      {
        id: 'cart-1',
        menuItem: DEFAULT_MENU_ITEMS[0],
        selectedSize: DEFAULT_MENU_ITEMS[0].sizes![2],
        quantity: 1,
        totalPrice: 2150,
      },
      {
        id: 'cart-2',
        menuItem: DEFAULT_MENU_ITEMS[6],
        selectedSize: DEFAULT_MENU_ITEMS[6].sizes![0],
        quantity: 2,
        totalPrice: 980,
      },
    ],
    subtotal: 3130,
    discountAmount: 450,
    deliveryFee: 0,
    totalAmount: 2680,
    paymentMethod: 'cash_on_delivery',
    orderType: 'delivery',
    status: 'preparing',
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    estimatedDeliveryTime: '25-35 mins',
  },
  {
    id: 'ord-102',
    orderNumber: 'BAR-7202',
    customer: {
      fullName: 'Sana Farooq',
      phone: '0301-4455667',
      address: 'Main Sadar Bazar, Plaza 4, 2nd Floor',
      area: 'Kharian Cantt - Sadar Bazar',
    },
    items: [
      {
        id: 'cart-3',
        menuItem: DEFAULT_MENU_ITEMS[2],
        quantity: 2,
        totalPrice: 1500,
      },
      {
        id: 'cart-4',
        menuItem: DEFAULT_MENU_ITEMS[8],
        quantity: 2,
        totalPrice: 1300,
      },
    ],
    subtotal: 2800,
    discountAmount: 0,
    deliveryFee: 120,
    totalAmount: 2920,
    paymentMethod: 'cash_on_delivery',
    orderType: 'delivery',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    estimatedDeliveryTime: '35-45 mins',
  },
];

// Helper to safely load / save localStorage
function loadFromStorage<T>(key: string, defaultVal: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaultVal));
      return defaultVal;
    }
    return JSON.parse(raw) as T;
  } catch {
    return defaultVal;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error('LocalStorage write error:', err);
  }
}

export const api = {
  // Public Menu & Data
  async getCategories(): Promise<MenuCategory[]> {
    return loadFromStorage<MenuCategory[]>(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES);
  },

  async getMenuItems(): Promise<MenuItem[]> {
    return loadFromStorage<MenuItem[]>(STORAGE_KEYS.MENU_ITEMS, DEFAULT_MENU_ITEMS);
  },

  async getHomepage(): Promise<HomepageCMS> {
    return loadFromStorage<HomepageCMS>(STORAGE_KEYS.HOMEPAGE, DEFAULT_HOMEPAGE);
  },

  async getSettings(): Promise<RestaurantSettings> {
    return loadFromStorage<RestaurantSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  },

  async getCoupons(): Promise<Coupon[]> {
    return loadFromStorage<Coupon[]>(STORAGE_KEYS.COUPONS, DEFAULT_COUPONS);
  },

  async getReviews(): Promise<Review[]> {
    return loadFromStorage<Review[]>(STORAGE_KEYS.REVIEWS, DEFAULT_REVIEWS);
  },

  // Checkout & Order Placement
  async placeOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status'>): Promise<Order> {
    const orders = loadFromStorage<Order[]>(STORAGE_KEYS.ORDERS, DEFAULT_ORDERS);
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: `BAR-${randomNum}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
      estimatedDeliveryTime: '30-40 mins',
    };

    orders.unshift(newOrder);
    saveToStorage(STORAGE_KEYS.ORDERS, orders);
    return newOrder;
  },

  async getOrderByNumber(orderNumber: string): Promise<Order | null> {
    const orders = loadFromStorage<Order[]>(STORAGE_KEYS.ORDERS, DEFAULT_ORDERS);
    const found = orders.find(
      (o) => o.orderNumber.trim().toUpperCase() === orderNumber.trim().toUpperCase()
    );
    return found || null;
  },

  // Customer Contact Message Submission
  async submitContactMessage(messageData: Omit<ContactMessage, 'id' | 'createdAt' | 'isResolved'>): Promise<ContactMessage> {
    const messages = loadFromStorage<ContactMessage[]>(STORAGE_KEYS.MESSAGES, []);
    const newMsg: ContactMessage = {
      ...messageData,
      id: `msg-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isResolved: false,
    };
    messages.unshift(newMsg);
    saveToStorage(STORAGE_KEYS.MESSAGES, messages);
    return newMsg;
  },

  // Submit Review
  async submitReview(reviewData: Omit<Review, 'id' | 'date' | 'isApproved'>): Promise<Review> {
    const reviews = loadFromStorage<Review[]>(STORAGE_KEYS.REVIEWS, DEFAULT_REVIEWS);
    const newRev: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      isApproved: true,
    };
    reviews.unshift(newRev);
    saveToStorage(STORAGE_KEYS.REVIEWS, reviews);
    return newRev;
  },

  // Admin & Staff Operations
  async getAdminOrders(): Promise<Order[]> {
    return loadFromStorage<Order[]>(STORAGE_KEYS.ORDERS, DEFAULT_ORDERS);
  },

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    const orders = loadFromStorage<Order[]>(STORAGE_KEYS.ORDERS, DEFAULT_ORDERS);
    const idx = orders.findIndex((o) => o.id === orderId);
    if (idx === -1) throw new Error('Order not found');
    orders[idx].status = status;
    saveToStorage(STORAGE_KEYS.ORDERS, orders);
    return orders[idx];
  },

  async getAdminStats(): Promise<DashboardStats> {
    const orders = loadFromStorage<Order[]>(STORAGE_KEYS.ORDERS, DEFAULT_ORDERS);
    const totalOrders = orders.length;
    const pendingOrders = orders.filter((o) => o.status === 'pending' || o.status === 'confirmed' || o.status === 'preparing').length;
    const totalRevenue = orders.reduce((sum, o) => (o.status !== 'cancelled' ? sum + o.totalAmount : sum), 0);
    const averageOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
    return {
      totalOrders,
      pendingOrders,
      totalRevenue,
      averageOrderValue,
      todayOrdersCount: totalOrders,
    };
  },

  // Menu Management
  async createMenuItem(item: Omit<MenuItem, 'id'>): Promise<MenuItem> {
    const items = loadFromStorage<MenuItem[]>(STORAGE_KEYS.MENU_ITEMS, DEFAULT_MENU_ITEMS);
    const newItem: MenuItem = {
      ...item,
      id: `item-${Date.now()}`,
    };
    items.unshift(newItem);
    saveToStorage(STORAGE_KEYS.MENU_ITEMS, items);
    return newItem;
  },

  async updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<MenuItem> {
    const items = loadFromStorage<MenuItem[]>(STORAGE_KEYS.MENU_ITEMS, DEFAULT_MENU_ITEMS);
    const idx = items.findIndex((i) => i.id === id);
    if (idx === -1) throw new Error('Item not found');
    items[idx] = { ...items[idx], ...updates };
    saveToStorage(STORAGE_KEYS.MENU_ITEMS, items);
    return items[idx];
  },

  async deleteMenuItem(id: string): Promise<void> {
    let items = loadFromStorage<MenuItem[]>(STORAGE_KEYS.MENU_ITEMS, DEFAULT_MENU_ITEMS);
    items = items.filter((i) => i.id !== id);
    saveToStorage(STORAGE_KEYS.MENU_ITEMS, items);
  },

  // Category Management
  async createCategory(cat: Omit<MenuCategory, 'id'>): Promise<MenuCategory> {
    const cats = loadFromStorage<MenuCategory[]>(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES);
    const newCat: MenuCategory = {
      ...cat,
      id: `cat-${Date.now()}`,
    };
    cats.push(newCat);
    saveToStorage(STORAGE_KEYS.CATEGORIES, cats);
    return newCat;
  },

  async updateCategory(id: string, updates: Partial<MenuCategory>): Promise<MenuCategory> {
    const cats = loadFromStorage<MenuCategory[]>(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES);
    const idx = cats.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error('Category not found');
    cats[idx] = { ...cats[idx], ...updates };
    saveToStorage(STORAGE_KEYS.CATEGORIES, cats);
    return cats[idx];
  },

  async deleteCategory(id: string): Promise<void> {
    let cats = loadFromStorage<MenuCategory[]>(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES);
    cats = cats.filter((c) => c.id !== id);
    saveToStorage(STORAGE_KEYS.CATEGORIES, cats);
  },

  // Coupon Management
  async createCoupon(coupon: Omit<Coupon, 'id'>): Promise<Coupon> {
    const coupons = loadFromStorage<Coupon[]>(STORAGE_KEYS.COUPONS, DEFAULT_COUPONS);
    const newC: Coupon = {
      ...coupon,
      id: `coup-${Date.now()}`,
    };
    coupons.unshift(newC);
    saveToStorage(STORAGE_KEYS.COUPONS, coupons);
    return newC;
  },

  async deleteCoupon(id: string): Promise<void> {
    let coupons = loadFromStorage<Coupon[]>(STORAGE_KEYS.COUPONS, DEFAULT_COUPONS);
    coupons = coupons.filter((c) => c.id !== id);
    saveToStorage(STORAGE_KEYS.COUPONS, coupons);
  },

  // CMS Content Update
  async updateHomepageContent(data: Partial<HomepageCMS>): Promise<HomepageCMS> {
    const current = loadFromStorage<HomepageCMS>(STORAGE_KEYS.HOMEPAGE, DEFAULT_HOMEPAGE);
    const updated = { ...current, ...data };
    saveToStorage(STORAGE_KEYS.HOMEPAGE, updated);
    return updated;
  },

  // Store Settings Update
  async updateSettings(data: Partial<RestaurantSettings>): Promise<RestaurantSettings> {
    const current = loadFromStorage<RestaurantSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    const updated = { ...current, ...data };
    saveToStorage(STORAGE_KEYS.SETTINGS, updated);
    return updated;
  },

  // Alias methods for clean consumption
  async getOrders(): Promise<Order[]> {
    return loadFromStorage<Order[]>(STORAGE_KEYS.ORDERS, DEFAULT_ORDERS);
  },

  async getOrderById(id: string): Promise<Order | null> {
    const orders = loadFromStorage<Order[]>(STORAGE_KEYS.ORDERS, DEFAULT_ORDERS);
    const found = orders.find(
      (o) =>
        o.id.toLowerCase() === id.toLowerCase() ||
        o.orderNumber.toLowerCase() === id.toLowerCase()
    );
    return found || null;
  },

  async getContactMessages(): Promise<ContactMessage[]> {
    return loadFromStorage<ContactMessage[]>(STORAGE_KEYS.MESSAGES, [
      {
        id: 'msg-seed-1',
        name: 'Brigadier Rashid Khan',
        phone: '0300-5551234',
        email: 'rashid.khan@gmail.com',
        subject: 'Table Reservation for 8 Guests',
        message: 'Looking to reserve the private lounge area this Saturday evening at 8:00 PM for a family dinner.',
        createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
        isResolved: false,
      },
    ]);
  },

  async updateHomepage(data: Partial<HomepageCMS>): Promise<HomepageCMS> {
    const current = loadFromStorage<HomepageCMS>(STORAGE_KEYS.HOMEPAGE, DEFAULT_HOMEPAGE);
    const updated = { ...current, ...data };
    saveToStorage(STORAGE_KEYS.HOMEPAGE, updated);
    return updated;
  },

  // Admin Messages & Reviews
  async getAdminMessages(): Promise<ContactMessage[]> {
    return loadFromStorage<ContactMessage[]>(STORAGE_KEYS.MESSAGES, [
      {
        id: 'msg-seed-1',
        name: 'Brigadier Rashid Khan',
        phone: '0300-5551234',
        email: 'rashid.khan@gmail.com',
        subject: 'Table Reservation for 8 Guests',
        message: 'Looking to reserve the private lounge area this Saturday evening at 8:00 PM for a family dinner.',
        createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
        isResolved: false,
      },
    ]);
  },

  async updateContactMessage(id: string, updates: Partial<ContactMessage>): Promise<void> {
    const msgs = loadFromStorage<ContactMessage[]>(STORAGE_KEYS.MESSAGES, []);
    const idx = msgs.findIndex((m) => m.id === id);
    if (idx !== -1) {
      msgs[idx] = { ...msgs[idx], ...updates };
      saveToStorage(STORAGE_KEYS.MESSAGES, msgs);
    }
  },

  async updateReview(id: string, updates: Partial<Review>): Promise<void> {
    const revs = loadFromStorage<Review[]>(STORAGE_KEYS.REVIEWS, DEFAULT_REVIEWS);
    const idx = revs.findIndex((r) => r.id === id);
    if (idx !== -1) {
      revs[idx] = { ...revs[idx], ...updates };
      saveToStorage(STORAGE_KEYS.REVIEWS, revs);
    }
  },

  async deleteReview(id: string): Promise<void> {
    let revs = loadFromStorage<Review[]>(STORAGE_KEYS.REVIEWS, DEFAULT_REVIEWS);
    revs = revs.filter((r) => r.id !== id);
    saveToStorage(STORAGE_KEYS.REVIEWS, revs);
  },

  // Reset to original seed
  async resetToSeed(): Promise<void> {
    localStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(DEFAULT_MENU_ITEMS));
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(DEFAULT_COUPONS));
    localStorage.setItem(STORAGE_KEYS.HOMEPAGE, JSON.stringify(DEFAULT_HOMEPAGE));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(DEFAULT_REVIEWS));
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(DEFAULT_ORDERS));
  },
};

import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import {
  AdminUser,
  MenuCategory,
  MenuItem,
  Order,
  Customer,
  Review,
  GalleryImage,
  Promotion,
  SiteSettings,
  HomepageContent,
  ContactMessage,
} from '../src/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

export interface DatabaseSchema {
  adminUsers: AdminUser[];
  categories: MenuCategory[];
  menuItems: MenuItem[];
  orders: Order[];
  customers: Customer[];
  reviews: Review[];
  gallery: GalleryImage[];
  promotions: Promotion[];
  settings: SiteSettings;
  homepage: HomepageContent;
  messages: ContactMessage[];
}

// Initial Seed Data for Barista's Restaurant, Kharian Cantt
const getInitialSeedData = (): DatabaseSchema => {
  const salt = bcrypt.genSaltSync(10);
  const defaultPasswordHash = bcrypt.hashSync('baristas2026', salt);

  const adminUsers: AdminUser[] = [
    {
      id: 'usr-1',
      username: 'admin',
      name: 'Barista\'s General Manager',
      email: 'admin@baristas.pk',
      role: 'superadmin',
      createdAt: new Date().toISOString(),
    },
  ];

  const categories: MenuCategory[] = [
    {
      id: 'cat-appetizers',
      name: 'Appetizers',
      slug: 'appetizers',
      description: 'Crispy, saucy, and golden starters to kickstart your meal',
      icon: 'Utensils',
      order: 1,
      isActive: true,
    },
    {
      id: 'cat-specials',
      name: 'Barista\'s Special',
      slug: 'baristas-special',
      description: 'Our legendary Mughlai & Chef signature recipes',
      icon: 'Crown',
      order: 2,
      isActive: true,
    },
    {
      id: 'cat-burgers',
      name: 'Burgers',
      slug: 'burgers',
      description: 'Juicy, flame-grilled and ultra-crispy handcrafted burgers',
      icon: 'Sandwich',
      order: 3,
      isActive: true,
    },
    {
      id: 'cat-shawarma',
      name: 'Shawarma & Wraps',
      slug: 'shawarma-wraps',
      description: 'Authentic Arabic rolls, seekh kebab wraps & zinger pockets',
      icon: 'Flame',
      order: 4,
      isActive: true,
    },
    {
      id: 'cat-shakes',
      name: 'Shakes',
      slug: 'shakes',
      description: 'Thick, creamy gourmet chocolate & premium branded shakes',
      icon: 'Coffee',
      order: 5,
      isActive: true,
    },
  ];

  const commonAddons = [
    { id: 'addon-cheese', name: 'Extra Cheddar Cheese Slice', price: 80 },
    { id: 'addon-garlic-dip', name: 'Signature Garlic Mayo Dip', price: 60 },
    { id: 'addon-peri-sauce', name: 'Spicy Peri Peri Dip', price: 60 },
    { id: 'addon-fries-up', name: 'Upgrade to Masala Fries', price: 150 },
    { id: 'addon-drink-can', name: 'Chilled Soft Drink (345ml)', price: 100 },
  ];

  const menuItems: MenuItem[] = [
    // APPETIZERS
    {
      id: 'item-bbq-wings',
      name: 'BBQ Chicken Wings',
      slug: 'bbq-chicken-wings',
      categoryId: 'cat-appetizers',
      categoryName: 'Appetizers',
      description: 'Succulent chicken wings tossed in rich smoky barbecue glaze with sesame garnish.',
      basePrice: 350,
      image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=800&q=80',
      isAvailable: true,
      isPopular: true,
      isFeatured: true,
      isSpicy: false,
      prepTime: '15-20 min',
      order: 1,
      variants: [
        { id: 'var-bbq-6', name: '6 Pieces', price: 350 },
        { id: 'var-bbq-12', name: '12 Pieces (Sharing)', price: 650 },
      ],
      addons: commonAddons,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'item-crispy-chicken',
      name: 'Crispy Chicken Pieces',
      slug: 'crispy-chicken-pieces',
      categoryId: 'cat-appetizers',
      categoryName: 'Appetizers',
      description: 'Golden, crackling southern-style fried chicken seasoned with authentic Barista herb blend.',
      basePrice: 200,
      image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80',
      isAvailable: true,
      isPopular: true,
      isFeatured: false,
      isSpicy: true,
      prepTime: '15-20 min',
      order: 2,
      variants: [
        { id: 'var-cc-1', name: '1 Piece', price: 200 },
        { id: 'var-cc-2', name: '2 Pieces with Bun & Dip', price: 380 },
        { id: 'var-cc-5', name: '5 Pieces (Family Box)', price: 900 },
      ],
      addons: commonAddons,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'item-peri-wings',
      name: 'Peri Peri Chicken Wings',
      slug: 'peri-peri-chicken-wings',
      categoryId: 'cat-appetizers',
      categoryName: 'Appetizers',
      description: 'Fire-roasted wings glazed in zesty, tangy African bird-eye Peri Peri sauce.',
      basePrice: 350,
      image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=800&q=80',
      isAvailable: true,
      isPopular: false,
      isFeatured: false,
      isSpicy: true,
      prepTime: '15-20 min',
      order: 3,
      variants: [
        { id: 'var-peri-6', name: '6 Pieces', price: 350 },
        { id: 'var-peri-12', name: '12 Pieces (Sharing)', price: 650 },
      ],
      addons: commonAddons,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'item-golden-nuggets',
      name: 'Golden Chicken Nuggets',
      slug: 'golden-chicken-nuggets',
      categoryId: 'cat-appetizers',
      categoryName: 'Appetizers',
      description: 'Tender 100% chicken breast nuggets fried crisp and served with sweet chili honey dip.',
      basePrice: 350,
      image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80',
      isAvailable: true,
      isPopular: false,
      isFeatured: false,
      isSpicy: false,
      prepTime: '10-15 min',
      order: 4,
      variants: [
        { id: 'var-nug-6', name: '6 Pieces with Dip', price: 350 },
        { id: 'var-nug-12', name: '12 Pieces with 2 Dips', price: 650 },
      ],
      addons: commonAddons,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'item-hot-wings',
      name: 'Hot Wings',
      slug: 'hot-wings',
      categoryId: 'cat-appetizers',
      categoryName: 'Appetizers',
      description: 'Fiery crispy battered wings with a bold spicy chili punch.',
      basePrice: 350,
      image: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?auto=format&fit=crop&w=800&q=80',
      isAvailable: true,
      isPopular: true,
      isFeatured: false,
      isSpicy: true,
      prepTime: '15-20 min',
      order: 5,
      variants: [
        { id: 'var-hw-6', name: '6 Pieces', price: 350 },
        { id: 'var-hw-12', name: '12 Pieces', price: 650 },
      ],
      addons: commonAddons,
      createdAt: new Date().toISOString(),
    },

    // BARISTA'S SPECIAL
    {
      id: 'item-mughlai-pizza',
      name: 'Baristas Mughlai Pizza',
      slug: 'baristas-mughlai-pizza',
      categoryId: 'cat-specials',
      categoryName: 'Barista\'s Special',
      description: 'Our royal signature pizza topped with Mughlai chicken boti, creamy white sauce, black olives, sweet corn, mushrooms, and 100% pure mozzarella.',
      basePrice: 850,
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
      isAvailable: true,
      isPopular: true,
      isFeatured: true,
      isSpicy: false,
      prepTime: '20-25 min',
      order: 1,
      variants: [
        { id: 'var-mp-small', name: 'Small (7 Inch)', price: 850 },
        { id: 'var-mp-med', name: 'Medium (10 Inch)', price: 1450 },
        { id: 'var-mp-large', name: 'Large (13 Inch)', price: 1950 },
        { id: 'var-mp-jumbo', name: 'Family / Jumbo (16 Inch)', price: 2300 },
      ],
      addons: [
        { id: 'addon-crust-cheese', name: 'Cheese Stuffed Crust', price: 250 },
        { id: 'addon-crust-kabab', name: 'Kabab Stuffed Crust', price: 300 },
        { id: 'addon-extra-cheese-piz', name: 'Extra Mozzarella Layer', price: 180 },
        { id: 'addon-dip-garlic', name: 'Garlic Ranch Dip Sauce', price: 60 },
      ],
      createdAt: new Date().toISOString(),
    },
    {
      id: 'item-special-pizza',
      name: 'Baristas Special Pizza',
      slug: 'baristas-special-pizza',
      categoryId: 'cat-specials',
      categoryName: 'Barista\'s Special',
      description: 'Chef\'s ultimate combination of smoked chicken fajita, tikka chunks, sausages, bell peppers, onions, jalapenos, and signature secret sauce.',
      basePrice: 850,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
      isAvailable: true,
      isPopular: true,
      isFeatured: true,
      isSpicy: true,
      prepTime: '20-25 min',
      order: 2,
      variants: [
        { id: 'var-sp-small', name: 'Small (7 Inch)', price: 850 },
        { id: 'var-sp-med', name: 'Medium (10 Inch)', price: 1450 },
        { id: 'var-sp-large', name: 'Large (13 Inch)', price: 1950 },
        { id: 'var-sp-jumbo', name: 'Family / Jumbo (16 Inch)', price: 2300 },
      ],
      addons: [
        { id: 'addon-crust-cheese', name: 'Cheese Stuffed Crust', price: 250 },
        { id: 'addon-crust-kabab', name: 'Kabab Stuffed Crust', price: 300 },
        { id: 'addon-extra-cheese-piz', name: 'Extra Mozzarella Layer', price: 180 },
      ],
      createdAt: new Date().toISOString(),
    },

    // BURGERS
    {
      id: 'item-chicken-special-burger',
      name: 'Barista\'s Chicken Special',
      slug: 'baristas-chicken-special',
      categoryId: 'cat-burgers',
      categoryName: 'Burgers',
      description: 'Premium flame-seared chicken fillet layered with melted cheese, caramelized onions, crisp iceberg, and Barista gourmet house dressing.',
      basePrice: 650,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
      isAvailable: true,
      isPopular: true,
      isFeatured: true,
      isSpicy: false,
      prepTime: '15 min',
      order: 1,
      variants: [
        { id: 'var-bcs-single', name: 'Single Fillet Burger', price: 650 },
        { id: 'var-bcs-combo', name: 'Double Fillet Combo (Fries + Drink)', price: 900 },
      ],
      addons: commonAddons,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'item-thunder-burger',
      name: 'Thunder Burger',
      slug: 'thunder-burger',
      categoryId: 'cat-burgers',
      categoryName: 'Burgers',
      description: 'Explosive crunch! Extra large hand-breaded zinger thigh smothered in spicy thunder fire sauce and smoked cheese.',
      basePrice: 750,
      image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
      isAvailable: true,
      isPopular: true,
      isFeatured: true,
      isSpicy: true,
      prepTime: '15 min',
      order: 2,
      variants: [
        { id: 'var-tb-std', name: 'Standard Thunder Burger', price: 750 },
      ],
      addons: commonAddons,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'item-zinger-burger',
      name: 'Zinger Burger',
      slug: 'zinger-burger',
      categoryId: 'cat-burgers',
      categoryName: 'Burgers',
      description: 'Crispy golden spiced chicken fillet nestled on shredded lettuce and creamy mayo in a toasted sesame bun.',
      basePrice: 390,
      image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80',
      isAvailable: true,
      isPopular: true,
      isFeatured: false,
      isSpicy: true,
      prepTime: '12 min',
      order: 3,
      variants: [
        { id: 'var-zb-std', name: 'Standard Zinger', price: 390 },
      ],
      addons: commonAddons,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'item-mega-zingo-burger',
      name: 'Mega Zingo Burger',
      slug: 'mega-zingo-burger',
      categoryId: 'cat-burgers',
      categoryName: 'Burgers',
      description: 'Double layer of massive zinger fillets stacked with double cheddar cheese and crunchy hashbrown.',
      basePrice: 750,
      image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&w=800&q=80',
      isAvailable: true,
      isPopular: true,
      isFeatured: false,
      isSpicy: true,
      prepTime: '15 min',
      order: 4,
      variants: [
        { id: 'var-mzb-std', name: 'Mega Double Zingo', price: 750 },
      ],
      addons: commonAddons,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'item-chicken-patty-burger',
      name: 'Chicken Patty Burger',
      slug: 'chicken-patty-burger',
      categoryId: 'cat-burgers',
      categoryName: 'Burgers',
      description: 'Classic seasoned chicken patty, tomato slice, crunchy cucumber, and traditional mayo.',
      basePrice: 300,
      image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=800&q=80',
      isAvailable: true,
      isPopular: false,
      isFeatured: false,
      isSpicy: false,
      prepTime: '10 min',
      order: 5,
      variants: [
        { id: 'var-cpb-std', name: 'Standard Patty Burger', price: 300 },
      ],
      addons: commonAddons,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'item-classic-beef-burger',
      name: 'Barista\'s Classic Beef',
      slug: 'baristas-classic-beef',
      categoryId: 'cat-burgers',
      categoryName: 'Burgers',
      description: '100% pure seasoned beef patty smashed to juicy perfection with pickles, melted cheddar, and secret relish.',
      basePrice: 650,
      image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=800&q=80',
      isAvailable: true,
      isPopular: true,
      isFeatured: true,
      isSpicy: false,
      prepTime: '18 min',
      order: 6,
      variants: [
        { id: 'var-bcb-single', name: 'Single Beef Patty', price: 650 },
        { id: 'var-bcb-double', name: 'Double Smashed Beef with Bacon & Cheese', price: 900 },
      ],
      addons: commonAddons,
      createdAt: new Date().toISOString(),
    },

    // SHAWARMA & WRAPS
    {
      id: 'item-arabic-shawarma',
      name: 'Arabic Classic Shawarma',
      slug: 'arabic-classic-shawarma',
      categoryId: 'cat-shawarma',
      categoryName: 'Shawarma & Wraps',
      description: 'Authentic Levantine marinated chicken strips, pickled cucumbers, and pure tahini garlic sauce in toasted pita.',
      basePrice: 350,
      image: 'https://images.unsplash.com/photo-1633321702518-7feccafb94d5?auto=format&fit=crop&w=800&q=80',
      isAvailable: true,
      isPopular: true,
      isFeatured: false,
      isSpicy: false,
      prepTime: '10 min',
      order: 1,
      variants: [
        { id: 'var-acs-std', name: 'Standard Arabic Shawarma', price: 350 },
        { id: 'var-acs-cheese', name: 'With Melted Mozzarella & Cheese', price: 390 },
      ],
      addons: commonAddons,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'item-crispy-zinger-roll',
      name: 'Crispy Zinger Roll & Wraps',
      slug: 'crispy-zinger-roll-wraps',
      categoryId: 'cat-shawarma',
      categoryName: 'Shawarma & Wraps',
      description: 'Crunchy zinger tenders wrapped in flaky paratha / tortilla with spicy chipotle drizzle and diced onions.',
      basePrice: 350,
      image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80',
      isAvailable: true,
      isPopular: true,
      isFeatured: true,
      isSpicy: true,
      prepTime: '12 min',
      order: 2,
      variants: [
        { id: 'var-czr-std', name: 'Standard Zinger Roll', price: 350 },
        { id: 'var-czr-cheese', name: 'With Jalapeno & Cheese Burst', price: 390 },
      ],
      addons: commonAddons,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'item-grilled-chicken-shawarma',
      name: 'Grilled Chicken Shawarma',
      slug: 'grilled-chicken-shawarma',
      categoryId: 'cat-shawarma',
      categoryName: 'Shawarma & Wraps',
      description: 'Tender charcoal-grilled chicken chunks folded with garlic aioli and crunchy fresh salad.',
      basePrice: 350,
      image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=800&q=80',
      isAvailable: true,
      isPopular: false,
      isFeatured: false,
      isSpicy: false,
      prepTime: '10 min',
      order: 3,
      variants: [
        { id: 'var-gcs-std', name: 'Standard Grilled Shawarma', price: 350 },
        { id: 'var-gcs-cheese', name: 'With Double Cheese', price: 390 },
      ],
      addons: commonAddons,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'item-seekh-kebab-shawarma',
      name: 'Seekh Kebab Shawarma',
      slug: 'seekh-kebab-shawarma',
      categoryId: 'cat-shawarma',
      categoryName: 'Shawarma & Wraps',
      description: 'Juicy spiced beef seekh kebab grilled over coals, rolled in hot rumali bread with mint yogurt and pickled onion rings.',
      basePrice: 350,
      image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80',
      isAvailable: true,
      isPopular: true,
      isFeatured: false,
      isSpicy: true,
      prepTime: '12 min',
      order: 4,
      variants: [
        { id: 'var-sks-std', name: 'Single Kebab Shawarma', price: 350 },
        { id: 'var-sks-cheese', name: 'With Cheese & Extra Kebab', price: 390 },
      ],
      addons: commonAddons,
      createdAt: new Date().toISOString(),
    },

    // SHAKES
    {
      id: 'item-choco-bounty-shake',
      name: 'Choco Bounty Shake',
      slug: 'choco-bounty-shake',
      categoryId: 'cat-shakes',
      categoryName: 'Shakes',
      description: 'Decadent chocolate shake blended with genuine Bounty coconut candy bars, vanilla cream, and chocolate drizzle.',
      basePrice: 650,
      image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80',
      isAvailable: true,
      isPopular: true,
      isFeatured: true,
      isSpicy: false,
      prepTime: '8 min',
      order: 1,
      variants: [
        { id: 'var-cbs-std', name: 'Regular 450ml Glass', price: 650 },
      ],
      addons: [
        { id: 'addon-whip', name: 'Extra Whipped Cream & Flake', price: 80 },
        { id: 'addon-ice-scoop', name: 'Extra Belgian Chocolate Scoop', price: 120 },
      ],
      createdAt: new Date().toISOString(),
    },
    {
      id: 'item-choco-dairy-milk-shake',
      name: 'Choco Dairy Milk Shake',
      slug: 'choco-dairy-milk-shake',
      categoryId: 'cat-shakes',
      categoryName: 'Shakes',
      description: 'Rich Cadbury Dairy Milk chocolate blended with whole milk and silky chocolate gelato.',
      basePrice: 650,
      image: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&w=800&q=80',
      isAvailable: true,
      isPopular: true,
      isFeatured: false,
      isSpicy: false,
      prepTime: '8 min',
      order: 2,
      variants: [
        { id: 'var-dms-std', name: 'Regular 450ml Glass', price: 650 },
      ],
      addons: [
        { id: 'addon-whip', name: 'Extra Whipped Cream & Flake', price: 80 },
        { id: 'addon-ice-scoop', name: 'Extra Belgian Chocolate Scoop', price: 120 },
      ],
      createdAt: new Date().toISOString(),
    },
    {
      id: 'item-choco-kitkat-shake',
      name: 'Choco KitKat Shake',
      slug: 'choco-kitkat-shake',
      categoryId: 'cat-shakes',
      categoryName: 'Shakes',
      description: 'Crispy wafer KitKat chocolate crushed and blended into a thick velvety milkshake topped with crunchy wafer bars.',
      basePrice: 650,
      image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=800&q=80',
      isAvailable: true,
      isPopular: true,
      isFeatured: true,
      isSpicy: false,
      prepTime: '8 min',
      order: 3,
      variants: [
        { id: 'var-kks-std', name: 'Regular 450ml Glass', price: 650 },
      ],
      addons: [
        { id: 'addon-whip', name: 'Extra Whipped Cream & Flake', price: 80 },
        { id: 'addon-ice-scoop', name: 'Extra Belgian Chocolate Scoop', price: 120 },
      ],
      createdAt: new Date().toISOString(),
    },
    {
      id: 'item-choco-oreo-shake',
      name: 'Choco Oreo Shake',
      slug: 'choco-oreo-shake',
      categoryId: 'cat-shakes',
      categoryName: 'Shakes',
      description: 'All-time favorite cookies & cream shake made with real Oreos, rich vanilla fudge, and dark chocolate sauce.',
      basePrice: 650,
      image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80',
      isAvailable: true,
      isPopular: true,
      isFeatured: false,
      isSpicy: false,
      prepTime: '8 min',
      order: 4,
      variants: [
        { id: 'var-cos-std', name: 'Regular 450ml Glass', price: 650 },
      ],
      addons: [
        { id: 'addon-whip', name: 'Extra Whipped Cream & Flake', price: 80 },
        { id: 'addon-ice-scoop', name: 'Extra Belgian Chocolate Scoop', price: 120 },
      ],
      createdAt: new Date().toISOString(),
    },
  ];

  const siteSettings: SiteSettings = {
    restaurantName: "BARISTA'S",
    tagline: 'Where every cup tells a story.',
    phone: '(053) 7611953',
    mobile: '+92 313 7544796',
    email: 'info@baristas.pk',
    address: 'Sadar Bazar, Kharian Cantt, Iftikhar Janjua Colony, Kharian, 50070, Pakistan',
    city: 'Kharian Cantt, Punjab',
    openingHours: '11:00 AM – 11:30 PM (Daily)',
    deliveryFee: 150,
    freeDeliveryAbove: 2000,
    minOrderAmount: 350,
    currency: 'Rs.',
    googleMapsUrl: 'https://maps.google.com/?q=Baristas+Restaurant+Kharian+Cantt',
    socialLinks: {
      facebook: 'https://facebook.com/baristas.pk',
      instagram: 'https://instagram.com/baristas.pk',
      whatsapp: 'https://wa.me/923137544796',
    },
    announcementBanner: '✨ Welcome to BARISTA\'S Kharian Cantt! Free Delivery across Cantt on orders above Rs. 2,000 | Call (053) 7611953',
    isStoreOpen: true,
  };

  const homepage: HomepageContent = {
    heroTitle: "BARISTA'S",
    heroSubtitle: 'Where every cup tells a story.',
    heroDescription: 'Experience Kharian Cantt’s premier dining destination. Indulge in our famous Baristas Mughlai Pizza, juicy Thunder Burgers, crispy sizzlers, and premium handcrafted chocolate shakes in a warm, welcoming ambience.',
    heroImageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=80',
    heroSecondaryImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80',
    storyTitle: 'Crafted with Passion in Sadar Bazar, Kharian Cantt',
    storyParagraph1: 'Founded with a dedication to culinary excellence, Barista\'s has become the favorite gathering spot for families, friends, and food lovers in Kharian Cantt and surrounding areas.',
    storyParagraph2: 'From our artisanal wood-style pizzas and gourmet burgers to our signature chocolate shake creations, we combine the freshest locally-sourced ingredients with international kitchen standards.',
    storyImageUrl: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80',
    bannerAlert: 'Order online now for lightning-fast hot delivery right to your doorstep in Kharian Cantt!',
  };

  const promotions: Promotion[] = [
    {
      id: 'promo-baristas10',
      code: 'BARISTAS10',
      title: '10% Welcome Discount',
      description: 'Get 10% off on your online order when spending Rs. 1,000 or more!',
      discountType: 'percentage',
      discountValue: 10,
      minOrderAmount: 1000,
      maxDiscount: 500,
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      isActive: true,
      usageCount: 42,
    },
    {
      id: 'promo-canttfree',
      code: 'CANTTFREE',
      title: 'Free Delivery Deal',
      description: 'Rs. 150 off delivery fee on all orders above Rs. 1,500.',
      discountType: 'fixed',
      discountValue: 150,
      minOrderAmount: 1500,
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      isActive: true,
      usageCount: 88,
    },
  ];

  const reviews: Review[] = [
    {
      id: 'rev-1',
      authorName: 'Hamza Malik',
      rating: 5,
      comment: 'Baristas Mughlai Pizza is easily the best pizza in Kharian! The crust is soft yet crispy, and the sauce is so rich. Quick delivery too.',
      date: '2026-08-10',
      isApproved: true,
      isFeatured: true,
      source: 'Customer',
    },
    {
      id: 'rev-2',
      authorName: 'Dr. Ayesha Tariq',
      rating: 5,
      comment: 'Visited the Sadar Bazar branch with my family. The ambience is cozy, service is very polite, and the Choco KitKat Shake was phenomenal!',
      date: '2026-08-04',
      isApproved: true,
      isFeatured: true,
      source: 'Google',
    },
    {
      id: 'rev-3',
      authorName: 'Usman Chaudhry',
      rating: 5,
      comment: 'The Thunder Burger is an absolute beast. Juicy zinger with that spicy fire sauce. Highly recommend ordering online.',
      date: '2026-07-28',
      isApproved: true,
      isFeatured: true,
      source: 'Customer',
    },
    {
      id: 'rev-4',
      authorName: 'Sana Rehman',
      rating: 5,
      comment: 'Arabic Classic Shawarma and BBQ wings were super fresh and flavorful. Barista’s is our regular dinner choice now in Kharian Cantt.',
      date: '2026-07-15',
      isApproved: true,
      isFeatured: true,
      source: 'Direct',
    },
  ];

  const gallery: GalleryImage[] = [
    {
      id: 'gal-1',
      title: 'Baristas Interior & Coffee Bar',
      imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1000&q=80',
      category: 'Ambience',
      caption: 'Warm ambient lighting and cozy seating in Sadar Bazar Kharian',
      order: 1,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'gal-2',
      title: 'Baristas Mughlai Pizza',
      imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1000&q=80',
      category: 'Specialties',
      caption: 'Loaded with creamy Mughlai chicken and fresh mozzarella',
      order: 2,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'gal-3',
      title: 'Thunder Burger & Golden Fries',
      imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1000&q=80',
      category: 'Food',
      caption: 'Massive crispy zinger fillet in toasted brioche bun',
      order: 3,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'gal-4',
      title: 'Artisan Chocolate Shakes',
      imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=1000&q=80',
      category: 'Beverages',
      caption: 'Thick gourmet KitKat, Bounty, and Oreo chocolate shakes',
      order: 4,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'gal-5',
      title: 'Sizzling Wings & Dips',
      imageUrl: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=1000&q=80',
      category: 'Food',
      caption: 'Smoky BBQ wings paired with garlic mayo & peri dips',
      order: 5,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'gal-6',
      title: 'Family Dining Hall',
      imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80',
      category: 'Ambience',
      caption: 'Comfortable family environment in Kharian Cantt',
      order: 6,
      createdAt: new Date().toISOString(),
    },
  ];

  const customers: Customer[] = [
    {
      id: 'cust-1',
      name: 'Hamza Malik',
      phone: '+92 300 1234567',
      email: 'hamza@example.com',
      addresses: ['House 42, St 5, Iftikhar Janjua Colony, Kharian Cantt'],
      totalOrders: 3,
      totalSpent: 4850,
      lastOrderAt: '2026-08-16T19:30:00Z',
      createdAt: '2026-07-01T12:00:00Z',
    },
  ];

  const orders: Order[] = [
    {
      id: 'ord-101',
      orderNumber: 'BAR-2026-1082',
      customerName: 'Hamza Malik',
      customerPhone: '03001234567',
      customerEmail: 'hamza@example.com',
      deliveryAddress: 'House 42, St 5, Iftikhar Janjua Colony, Kharian Cantt',
      orderType: 'delivery',
      status: 'Completed',
      items: [
        {
          id: 'oi-1',
          menuItemId: 'item-mughlai-pizza',
          name: 'Baristas Mughlai Pizza',
          quantity: 1,
          unitPrice: 1450,
          selectedVariant: { id: 'var-mp-med', name: 'Medium (10 Inch)', price: 1450 },
          selectedAddons: [
            { id: 'addon-crust-cheese', name: 'Cheese Stuffed Crust', price: 250 },
          ],
          itemTotal: 1700,
        },
        {
          id: 'oi-2',
          menuItemId: 'item-choco-kitkat-shake',
          name: 'Choco KitKat Shake',
          quantity: 2,
          unitPrice: 650,
          selectedVariant: { id: 'var-kks-std', name: 'Regular 450ml Glass', price: 650 },
          selectedAddons: [],
          itemTotal: 1300,
        },
      ],
      subtotal: 3000,
      deliveryFee: 0,
      discount: 300,
      couponCode: 'BARISTAS10',
      total: 2700,
      paymentMethod: 'Cash on Delivery',
      notes: 'Please bring extra garlic mayo and tissue papers',
      createdAt: '2026-08-16T19:30:00Z',
      updatedAt: '2026-08-16T20:15:00Z',
      estimatedDeliveryMinutes: 35,
    },
  ];

  const messages: ContactMessage[] = [
    {
      id: 'msg-1',
      name: 'Major Farooq',
      email: 'farooq@example.com',
      phone: '03137654321',
      subject: 'Family Birthday Reservation Inquiry',
      message: 'Hi, we would like to book a table for 12 people this Saturday evening at 8:00 PM. Please confirm availability and package options.',
      status: 'read',
      createdAt: '2026-08-15T14:20:00Z',
    },
  ];

  return {
    adminUsers,
    categories,
    menuItems,
    orders,
    customers,
    reviews,
    gallery,
    promotions,
    settings: siteSettings,
    homepage,
    messages,
  };
};

class Database {
  private data: DatabaseSchema;
  private isLoaded = false;

  constructor() {
    this.data = getInitialSeedData();
    this.init();
  }

  private init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        if (fileContent.trim()) {
          const parsed = JSON.parse(fileContent);
          this.data = {
            ...getInitialSeedData(),
            ...parsed,
          };
          this.isLoaded = true;
          return;
        }
      }

      // If no file exists, write the initial seed data
      this.saveSync();
      this.isLoaded = true;
    } catch (err) {
      console.error('Failed to load database from file, using seed memory:', err);
      this.data = getInitialSeedData();
      this.isLoaded = true;
    }
  }

  private saveSync() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write database file:', err);
    }
  }

  // --- Reset/Seed ---
  public resetToSeed(): DatabaseSchema {
    this.data = getInitialSeedData();
    this.saveSync();
    return this.data;
  }

  // --- Admin Auth ---
  public getAdminUsers(): AdminUser[] {
    return this.data.adminUsers;
  }

  public findAdminByUsername(username: string): AdminUser | undefined {
    return this.data.adminUsers.find(
      (u) => u.username.toLowerCase() === username.toLowerCase()
    );
  }

  public getAdminPasswordHash(): string {
    // Return stored hash or fallback
    return bcrypt.hashSync('baristas2026', 10);
  }

  // --- Categories ---
  public getCategories(): MenuCategory[] {
    return this.data.categories.sort((a, b) => a.order - b.order);
  }

  public getCategoryById(id: string): MenuCategory | undefined {
    return this.data.categories.find((c) => c.id === id);
  }

  public createCategory(cat: Omit<MenuCategory, 'id'>): MenuCategory {
    const id = `cat-${Date.now()}`;
    const newCategory: MenuCategory = {
      id,
      ...cat,
    };
    this.data.categories.push(newCategory);
    this.saveSync();
    return newCategory;
  }

  public updateCategory(id: string, updates: Partial<MenuCategory>): MenuCategory | null {
    const idx = this.data.categories.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    this.data.categories[idx] = { ...this.data.categories[idx], ...updates };
    this.saveSync();
    return this.data.categories[idx];
  }

  public deleteCategory(id: string): boolean {
    const prevLen = this.data.categories.length;
    this.data.categories = this.data.categories.filter((c) => c.id !== id);
    // Also remove items or reassign
    this.data.menuItems = this.data.menuItems.filter((i) => i.categoryId !== id);
    this.saveSync();
    return this.data.categories.length < prevLen;
  }

  // --- Menu Items ---
  public getMenuItems(options?: { categoryId?: string; isAvailable?: boolean; search?: string }): MenuItem[] {
    let items = [...this.data.menuItems];
    if (options?.categoryId && options.categoryId !== 'all') {
      items = items.filter((i) => i.categoryId === options.categoryId);
    }
    if (options?.isAvailable !== undefined) {
      items = items.filter((i) => i.isAvailable === options.isAvailable);
    }
    if (options?.search) {
      const q = options.search.toLowerCase();
      items = items.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.categoryName.toLowerCase().includes(q)
      );
    }
    return items.sort((a, b) => a.order - b.order);
  }

  public getMenuItemById(id: string): MenuItem | undefined {
    return this.data.menuItems.find((i) => i.id === id);
  }

  public createMenuItem(item: Omit<MenuItem, 'id' | 'createdAt'>): MenuItem {
    const id = `item-${Date.now()}`;
    const newItem: MenuItem = {
      id,
      createdAt: new Date().toISOString(),
      ...item,
    };
    this.data.menuItems.push(newItem);
    this.saveSync();
    return newItem;
  }

  public updateMenuItem(id: string, updates: Partial<MenuItem>): MenuItem | null {
    const idx = this.data.menuItems.findIndex((i) => i.id === id);
    if (idx === -1) return null;
    this.data.menuItems[idx] = { ...this.data.menuItems[idx], ...updates };
    this.saveSync();
    return this.data.menuItems[idx];
  }

  public deleteMenuItem(id: string): boolean {
    const prevLen = this.data.menuItems.length;
    this.data.menuItems = this.data.menuItems.filter((i) => i.id !== id);
    this.saveSync();
    return this.data.menuItems.length < prevLen;
  }

  // --- Orders ---
  public getOrders(options?: { status?: string; search?: string; limit?: number }): Order[] {
    let orders = [...this.data.orders];
    if (options?.status && options.status !== 'all') {
      orders = orders.filter((o) => o.status === options.status);
    }
    if (options?.search) {
      const q = options.search.toLowerCase();
      orders = orders.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerPhone.includes(q)
      );
    }
    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    if (options?.limit) {
      orders = orders.slice(0, options.limit);
    }
    return orders;
  }

  public getOrderByIdOrNumber(idOrNum: string): Order | undefined {
    const term = idOrNum.trim().toUpperCase();
    return this.data.orders.find(
      (o) => o.id === idOrNum || o.orderNumber.toUpperCase() === term
    );
  }

  public createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Order {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `BAR-${new Date().getFullYear()}-${randomSuffix}`;
    const id = `ord-${Date.now()}`;
    const now = new Date().toISOString();

    const newOrder: Order = {
      id,
      orderNumber,
      createdAt: now,
      updatedAt: now,
      ...orderData,
    };

    this.data.orders.unshift(newOrder);

    // Update or create Customer record
    const existingCustIdx = this.data.customers.findIndex(
      (c) => c.phone.replace(/\D/g, '') === orderData.customerPhone.replace(/\D/g, '')
    );

    if (existingCustIdx !== -1) {
      const cust = this.data.customers[existingCustIdx];
      cust.totalOrders += 1;
      cust.totalSpent += orderData.total;
      cust.lastOrderAt = now;
      if (orderData.deliveryAddress && !cust.addresses.includes(orderData.deliveryAddress)) {
        cust.addresses.push(orderData.deliveryAddress);
      }
      this.data.customers[existingCustIdx] = cust;
    } else {
      this.data.customers.push({
        id: `cust-${Date.now()}`,
        name: orderData.customerName,
        phone: orderData.customerPhone,
        email: orderData.customerEmail,
        addresses: orderData.deliveryAddress ? [orderData.deliveryAddress] : [],
        totalOrders: 1,
        totalSpent: orderData.total,
        lastOrderAt: now,
        createdAt: now,
      });
    }

    // If coupon was used, increment usage count
    if (orderData.couponCode) {
      const promo = this.data.promotions.find(
        (p) => p.code.toUpperCase() === orderData.couponCode?.toUpperCase()
      );
      if (promo) {
        promo.usageCount += 1;
      }
    }

    this.saveSync();
    return newOrder;
  }

  public updateOrderStatus(id: string, status: Order['status']): Order | null {
    const idx = this.data.orders.findIndex((o) => o.id === id || o.orderNumber === id);
    if (idx === -1) return null;
    this.data.orders[idx].status = status;
    this.data.orders[idx].updatedAt = new Date().toISOString();
    this.saveSync();
    return this.data.orders[idx];
  }

  // --- Customers ---
  public getCustomers(): Customer[] {
    return [...this.data.customers].sort(
      (a, b) => new Date(b.lastOrderAt).getTime() - new Date(a.lastOrderAt).getTime()
    );
  }

  // --- Promotions / Coupons ---
  public getPromotions(activeOnly = false): Promotion[] {
    if (activeOnly) {
      return this.data.promotions.filter((p) => p.isActive);
    }
    return this.data.promotions;
  }

  public validateCoupon(code: string, subtotal: number): { valid: boolean; discount: number; message: string; promo?: Promotion } {
    const cleanCode = code.trim().toUpperCase();
    const promo = this.data.promotions.find(
      (p) => p.code.toUpperCase() === cleanCode && p.isActive
    );

    if (!promo) {
      return { valid: false, discount: 0, message: 'Invalid or expired coupon code' };
    }

    if (subtotal < promo.minOrderAmount) {
      return {
        valid: false,
        discount: 0,
        message: `Minimum order amount of Rs. ${promo.minOrderAmount} required for this coupon`,
      };
    }

    let discount = 0;
    if (promo.discountType === 'percentage') {
      discount = Math.round((subtotal * promo.discountValue) / 100);
      if (promo.maxDiscount && discount > promo.maxDiscount) {
        discount = promo.maxDiscount;
      }
    } else {
      discount = promo.discountValue;
    }

    // Can't discount more than subtotal
    discount = Math.min(discount, subtotal);

    return {
      valid: true,
      discount,
      message: `Coupon '${promo.code}' applied! Saved Rs. ${discount}`,
      promo,
    };
  }

  public createPromotion(promo: Omit<Promotion, 'id' | 'usageCount'>): Promotion {
    const id = `promo-${Date.now()}`;
    const newPromo: Promotion = {
      id,
      usageCount: 0,
      ...promo,
    };
    this.data.promotions.push(newPromo);
    this.saveSync();
    return newPromo;
  }

  public updatePromotion(id: string, updates: Partial<Promotion>): Promotion | null {
    const idx = this.data.promotions.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    this.data.promotions[idx] = { ...this.data.promotions[idx], ...updates };
    this.saveSync();
    return this.data.promotions[idx];
  }

  public deletePromotion(id: string): boolean {
    const prevLen = this.data.promotions.length;
    this.data.promotions = this.data.promotions.filter((p) => p.id !== id);
    this.saveSync();
    return this.data.promotions.length < prevLen;
  }

  // --- Reviews ---
  public getReviews(all = false): Review[] {
    if (all) {
      return this.data.reviews;
    }
    return this.data.reviews.filter((r) => r.isApproved);
  }

  public createReview(review: Omit<Review, 'id' | 'date' | 'isApproved' | 'isFeatured'>): Review {
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      isApproved: true, // auto approve or admin flag
      isFeatured: false,
      ...review,
    };
    this.data.reviews.unshift(newRev);
    this.saveSync();
    return newRev;
  }

  public updateReview(id: string, updates: Partial<Review>): Review | null {
    const idx = this.data.reviews.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    this.data.reviews[idx] = { ...this.data.reviews[idx], ...updates };
    this.saveSync();
    return this.data.reviews[idx];
  }

  public deleteReview(id: string): boolean {
    const prevLen = this.data.reviews.length;
    this.data.reviews = this.data.reviews.filter((r) => r.id !== id);
    this.saveSync();
    return this.data.reviews.length < prevLen;
  }

  // --- Gallery ---
  public getGallery(): GalleryImage[] {
    return [...this.data.gallery].sort((a, b) => a.order - b.order);
  }

  public createGalleryImage(img: Omit<GalleryImage, 'id' | 'createdAt'>): GalleryImage {
    const newImg: GalleryImage = {
      id: `gal-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...img,
    };
    this.data.gallery.push(newImg);
    this.saveSync();
    return newImg;
  }

  public updateGalleryImage(id: string, updates: Partial<GalleryImage>): GalleryImage | null {
    const idx = this.data.gallery.findIndex((g) => g.id === id);
    if (idx === -1) return null;
    this.data.gallery[idx] = { ...this.data.gallery[idx], ...updates };
    this.saveSync();
    return this.data.gallery[idx];
  }

  public deleteGalleryImage(id: string): boolean {
    const prevLen = this.data.gallery.length;
    this.data.gallery = this.data.gallery.filter((g) => g.id !== id);
    this.saveSync();
    return this.data.gallery.length < prevLen;
  }

  // --- Site Settings ---
  public getSettings(): SiteSettings {
    return this.data.settings;
  }

  public updateSettings(updates: Partial<SiteSettings>): SiteSettings {
    this.data.settings = { ...this.data.settings, ...updates };
    this.saveSync();
    return this.data.settings;
  }

  // --- Homepage CMS ---
  public getHomepage(): HomepageContent {
    return this.data.homepage;
  }

  public updateHomepage(updates: Partial<HomepageContent>): HomepageContent {
    this.data.homepage = { ...this.data.homepage, ...updates };
    this.saveSync();
    return this.data.homepage;
  }

  // --- Contact Messages ---
  public getMessages(): ContactMessage[] {
    return [...this.data.messages].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public createMessage(msg: Omit<ContactMessage, 'id' | 'status' | 'createdAt'>): ContactMessage {
    const newMsg: ContactMessage = {
      id: `msg-${Date.now()}`,
      status: 'unread',
      createdAt: new Date().toISOString(),
      ...msg,
    };
    this.data.messages.unshift(newMsg);
    this.saveSync();
    return newMsg;
  }

  public updateMessageStatus(id: string, status: ContactMessage['status']): ContactMessage | null {
    const idx = this.data.messages.findIndex((m) => m.id === id);
    if (idx === -1) return null;
    this.data.messages[idx].status = status;
    this.saveSync();
    return this.data.messages[idx];
  }

  public deleteMessage(id: string): boolean {
    const prevLen = this.data.messages.length;
    this.data.messages = this.data.messages.filter((m) => m.id !== id);
    this.saveSync();
    return this.data.messages.length < prevLen;
  }

  // --- Admin Dashboard Stats ---
  public getStats() {
    const orders = this.data.orders;
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    const todayOrders = orders.filter((o) => o.createdAt.startsWith(todayStr));
    const todayRevenue = todayOrders
      .filter((o) => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + o.total, 0);

    const pendingOrdersCount = orders.filter((o) => o.status === 'Pending').length;
    const preparingOrdersCount = orders.filter(
      (o) => o.status === 'Preparing' || o.status === 'Confirmed'
    ).length;
    const completedOrdersCount = orders.filter((o) => o.status === 'Completed').length;

    // Item popularity
    const productStats: Record<string, { count: number; revenue: number }> = {};
    for (const ord of orders) {
      if (ord.status === 'Cancelled') continue;
      for (const item of ord.items) {
        if (!productStats[item.name]) {
          productStats[item.name] = { count: 0, revenue: 0 };
        }
        productStats[item.name].count += item.quantity;
        productStats[item.name].revenue += item.itemTotal;
      }
    }

    const popularProducts = Object.entries(productStats)
      .map(([name, stat]) => ({ name, count: stat.count, revenue: stat.revenue }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    // Last 7 days revenue
    const weeklyRevenue: { date: string; revenue: number; orders: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayOrders = orders.filter(
        (o) => o.createdAt.startsWith(dStr) && o.status !== 'Cancelled'
      );
      const rev = dayOrders.reduce((sum, o) => sum + o.total, 0);
      weeklyRevenue.push({
        date: dayName,
        revenue: rev,
        orders: dayOrders.length,
      });
    }

    return {
      todayOrdersCount: todayOrders.length,
      todayRevenue,
      pendingOrdersCount,
      preparingOrdersCount,
      completedOrdersCount,
      totalCustomersCount: this.data.customers.length,
      popularProducts,
      recentOrders: orders.slice(0, 8),
      weeklyRevenue,
    };
  }
}

export const db = new Database();

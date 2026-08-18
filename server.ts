import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db';

dotenv.config();

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'baristas-kharian-jwt-secret-token-key-2026';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Auth Middleware ---
interface AuthRequest extends Request {
  user?: { id: string; username: string; role: string };
}

function requireAdminAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; username: string; role: string };
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Session expired or invalid' });
  }
}

// ==========================================
// AUTH API
// ==========================================
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const admin = db.findAdminByUsername(username);
  if (!admin) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  // Verify against standard or default password
  const isValid = password === 'baristas2026' || bcrypt.compareSync(password, db.getAdminPasswordHash());
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  const token = jwt.sign(
    { id: admin.id, username: admin.username, role: admin.role, name: admin.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return res.json({
    token,
    user: {
      id: admin.id,
      username: admin.username,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    },
  });
});

app.get('/api/auth/me', requireAdminAuth, (req: AuthRequest, res: Response) => {
  const admin = db.findAdminByUsername(req.user?.username || '');
  if (!admin) return res.status(404).json({ error: 'User not found' });
  return res.json({ user: admin });
});

// ==========================================
// SETTINGS & HOMEPAGE CMS API
// ==========================================
app.get('/api/settings', (req: Request, res: Response) => {
  return res.json(db.getSettings());
});

app.put('/api/settings', requireAdminAuth, (req: Request, res: Response) => {
  const updated = db.updateSettings(req.body);
  return res.json(updated);
});

app.get('/api/homepage', (req: Request, res: Response) => {
  return res.json(db.getHomepage());
});

app.put('/api/homepage', requireAdminAuth, (req: Request, res: Response) => {
  const updated = db.updateHomepage(req.body);
  return res.json(updated);
});

// ==========================================
// CATEGORIES API
// ==========================================
app.get('/api/categories', (req: Request, res: Response) => {
  return res.json(db.getCategories());
});

app.post('/api/categories', requireAdminAuth, (req: Request, res: Response) => {
  const { name, slug, description, icon, order, isActive } = req.body;
  if (!name) return res.status(400).json({ error: 'Category name is required' });

  const newCat = db.createCategory({
    name,
    slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: description || '',
    icon: icon || 'Utensils',
    order: Number(order) || db.getCategories().length + 1,
    isActive: isActive !== undefined ? isActive : true,
  });

  return res.status(201).json(newCat);
});

app.put('/api/categories/:id', requireAdminAuth, (req: Request, res: Response) => {
  const updated = db.updateCategory(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Category not found' });
  return res.json(updated);
});

app.delete('/api/categories/:id', requireAdminAuth, (req: Request, res: Response) => {
  const success = db.deleteCategory(req.params.id);
  if (!success) return res.status(404).json({ error: 'Category not found' });
  return res.json({ success: true, message: 'Category deleted' });
});

// ==========================================
// MENU ITEMS API
// ==========================================
app.get('/api/menu', (req: Request, res: Response) => {
  const { categoryId, isAvailable, search } = req.query;
  const items = db.getMenuItems({
    categoryId: categoryId as string,
    isAvailable: isAvailable === 'true' ? true : isAvailable === 'false' ? false : undefined,
    search: search as string,
  });
  return res.json(items);
});

app.get('/api/menu/:id', (req: Request, res: Response) => {
  const item = db.getMenuItemById(req.params.id);
  if (!item) return res.status(404).json({ error: 'Menu item not found' });
  return res.json(item);
});

app.post('/api/menu', requireAdminAuth, (req: Request, res: Response) => {
  const {
    name,
    categoryId,
    categoryName,
    description,
    basePrice,
    image,
    isAvailable,
    isPopular,
    isFeatured,
    isSpicy,
    prepTime,
    order,
    variants,
    addons,
  } = req.body;

  if (!name || !categoryId || basePrice === undefined) {
    return res.status(400).json({ error: 'Name, category, and base price are required' });
  }

  const category = db.getCategoryById(categoryId);
  const catName = categoryName || category?.name || 'General';

  const newItem = db.createMenuItem({
    name,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    categoryId,
    categoryName: catName,
    description: description || '',
    basePrice: Number(basePrice),
    image: image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    isAvailable: isAvailable !== undefined ? isAvailable : true,
    isPopular: !!isPopular,
    isFeatured: !!isFeatured,
    isSpicy: !!isSpicy,
    prepTime: prepTime || '15 min',
    order: Number(order) || 99,
    variants: Array.isArray(variants) ? variants : [],
    addons: Array.isArray(addons) ? addons : [],
  });

  return res.status(201).json(newItem);
});

app.put('/api/menu/:id', requireAdminAuth, (req: Request, res: Response) => {
  const updated = db.updateMenuItem(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Menu item not found' });
  return res.json(updated);
});

app.delete('/api/menu/:id', requireAdminAuth, (req: Request, res: Response) => {
  const success = db.deleteMenuItem(req.params.id);
  if (!success) return res.status(404).json({ error: 'Menu item not found' });
  return res.json({ success: true, message: 'Menu item deleted' });
});

// ==========================================
// ORDERS API
// ==========================================
app.get('/api/orders', (req: Request, res: Response) => {
  const { status, search, limit } = req.query;
  const orders = db.getOrders({
    status: status as string,
    search: search as string,
    limit: limit ? Number(limit) : undefined,
  });
  return res.json(orders);
});

app.get('/api/orders/:idOrNum', (req: Request, res: Response) => {
  const order = db.getOrderByIdOrNumber(req.params.idOrNum);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  return res.json(order);
});

app.post('/api/orders', (req: Request, res: Response) => {
  const {
    customerName,
    customerPhone,
    customerEmail,
    deliveryAddress,
    orderType,
    items,
    subtotal,
    deliveryFee,
    discount,
    couponCode,
    total,
    paymentMethod,
    notes,
  } = req.body;

  if (!customerName || !customerPhone || !items || !items.length) {
    return res.status(400).json({ error: 'Customer name, phone, and at least one item are required' });
  }

  const newOrder = db.createOrder({
    customerName,
    customerPhone,
    customerEmail,
    deliveryAddress,
    orderType: orderType || 'delivery',
    status: 'Pending',
    items,
    subtotal: Number(subtotal) || 0,
    deliveryFee: Number(deliveryFee) || 0,
    discount: Number(discount) || 0,
    couponCode,
    total: Number(total) || 0,
    paymentMethod: paymentMethod || 'Cash on Delivery',
    notes,
    estimatedDeliveryMinutes: 30,
  });

  return res.status(201).json(newOrder);
});

app.patch('/api/orders/:id/status', requireAdminAuth, (req: Request, res: Response) => {
  const { status } = req.body;
  if (!status) return res.status(400).json({ error: 'Status is required' });

  const updated = db.updateOrderStatus(req.params.id, status);
  if (!updated) return res.status(404).json({ error: 'Order not found' });
  return res.json(updated);
});

// ==========================================
// CUSTOMERS API
// ==========================================
app.get('/api/customers', requireAdminAuth, (req: Request, res: Response) => {
  return res.json(db.getCustomers());
});

// ==========================================
// PROMOTIONS & COUPONS API
// ==========================================
app.get('/api/promotions', (req: Request, res: Response) => {
  const { activeOnly } = req.query;
  return res.json(db.getPromotions(activeOnly === 'true'));
});

app.post('/api/promotions/validate', (req: Request, res: Response) => {
  const { code, subtotal } = req.body;
  if (!code) return res.status(400).json({ error: 'Coupon code required' });
  const result = db.validateCoupon(code, Number(subtotal) || 0);
  return res.json(result);
});

app.post('/api/promotions', requireAdminAuth, (req: Request, res: Response) => {
  const promo = db.createPromotion(req.body);
  return res.status(201).json(promo);
});

app.put('/api/promotions/:id', requireAdminAuth, (req: Request, res: Response) => {
  const updated = db.updatePromotion(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Promotion not found' });
  return res.json(updated);
});

app.delete('/api/promotions/:id', requireAdminAuth, (req: Request, res: Response) => {
  const success = db.deletePromotion(req.params.id);
  if (!success) return res.status(404).json({ error: 'Promotion not found' });
  return res.json({ success: true });
});

// ==========================================
// REVIEWS API
// ==========================================
app.get('/api/reviews', (req: Request, res: Response) => {
  const all = req.query.all === 'true';
  return res.json(db.getReviews(all));
});

app.post('/api/reviews', (req: Request, res: Response) => {
  const { authorName, rating, comment } = req.body;
  if (!authorName || !rating || !comment) {
    return res.status(400).json({ error: 'Author name, rating and comment are required' });
  }
  const rev = db.createReview({
    authorName,
    rating: Number(rating),
    comment,
    source: 'Customer',
  });
  return res.status(201).json(rev);
});

app.put('/api/reviews/:id', requireAdminAuth, (req: Request, res: Response) => {
  const updated = db.updateReview(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Review not found' });
  return res.json(updated);
});

app.delete('/api/reviews/:id', requireAdminAuth, (req: Request, res: Response) => {
  const success = db.deleteReview(req.params.id);
  if (!success) return res.status(404).json({ error: 'Review not found' });
  return res.json({ success: true });
});

// ==========================================
// GALLERY API
// ==========================================
app.get('/api/gallery', (req: Request, res: Response) => {
  return res.json(db.getGallery());
});

app.post('/api/gallery', requireAdminAuth, (req: Request, res: Response) => {
  const { title, imageUrl, category, caption, order } = req.body;
  if (!title || !imageUrl) {
    return res.status(400).json({ error: 'Title and image URL are required' });
  }
  const img = db.createGalleryImage({
    title,
    imageUrl,
    category: category || 'Food',
    caption: caption || '',
    order: Number(order) || 1,
  });
  return res.status(201).json(img);
});

app.put('/api/gallery/:id', requireAdminAuth, (req: Request, res: Response) => {
  const updated = db.updateGalleryImage(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Gallery image not found' });
  return res.json(updated);
});

app.delete('/api/gallery/:id', requireAdminAuth, (req: Request, res: Response) => {
  const success = db.deleteGalleryImage(req.params.id);
  if (!success) return res.status(404).json({ error: 'Gallery image not found' });
  return res.json({ success: true });
});

// ==========================================
// CONTACT MESSAGES API
// ==========================================
app.get('/api/messages', requireAdminAuth, (req: Request, res: Response) => {
  return res.json(db.getMessages());
});

app.post('/api/messages', (req: Request, res: Response) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !message) {
    return res.status(400).json({ error: 'Name and message are required' });
  }
  const msg = db.createMessage({
    name,
    email: email || '',
    phone: phone || '',
    subject: subject || 'General Inquiry',
    message,
  });
  return res.status(201).json(msg);
});

app.patch('/api/messages/:id/status', requireAdminAuth, (req: Request, res: Response) => {
  const { status } = req.body;
  const updated = db.updateMessageStatus(req.params.id, status);
  if (!updated) return res.status(404).json({ error: 'Message not found' });
  return res.json(updated);
});

app.delete('/api/messages/:id', requireAdminAuth, (req: Request, res: Response) => {
  const success = db.deleteMessage(req.params.id);
  if (!success) return res.status(404).json({ error: 'Message not found' });
  return res.json({ success: true });
});

// ==========================================
// DASHBOARD STATS API
// ==========================================
app.get('/api/stats', requireAdminAuth, (req: Request, res: Response) => {
  return res.json(db.getStats());
});

// ==========================================
// DATABASE RESET / SEED API
// ==========================================
app.post('/api/reset-seed', requireAdminAuth, (req: Request, res: Response) => {
  const freshData = db.resetToSeed();
  return res.json({ success: true, message: 'Database reset to initial Baristas seed data', data: freshData });
});

// ==========================================
// SERVER INITIALIZATION WITH VITE
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`☕ Barista's Restaurant server active on http://0.0.0.0:${PORT}`);
  });
}

startServer();

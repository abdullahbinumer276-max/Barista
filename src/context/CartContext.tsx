import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, MenuItem, MenuItemSize, MenuItemAddon, Coupon } from '../types';
import { useRestaurant } from './RestaurantContext';

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (
    item: MenuItem,
    size?: MenuItemSize,
    addons?: MenuItemAddon[],
    quantity?: number,
    specialInstructions?: string
  ) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  removeItem: (cartItemId: string) => void;
  clearCart: () => void;
  appliedCoupon: Coupon | null;
  couponError: string | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  subtotal: number;
  discountAmount: number;
  deliveryFee: number;
  grandTotal: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings, coupons } = useRestaurant();
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem('baristas_cart_items_v1');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isOpen, setIsOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => {
    try {
      const stored = localStorage.getItem('baristas_cart_coupon_v1');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [couponError, setCouponError] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('baristas_cart_items_v1', JSON.stringify(items));
    } catch (err) {
      console.error(err);
    }
  }, [items]);

  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem('baristas_cart_coupon_v1', JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem('baristas_cart_coupon_v1');
      }
    } catch (err) {
      console.error(err);
    }
  }, [appliedCoupon]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);

  const addItem = (
    item: MenuItem,
    size?: MenuItemSize,
    addons: MenuItemAddon[] = [],
    quantity = 1,
    specialInstructions = ''
  ) => {
    const basePrice = size ? size.price : item.price;
    const addonsTotal = addons.reduce((sum, a) => sum + a.price, 0);
    const unitPrice = basePrice + addonsTotal;

    const sizeKey = size ? size.name : 'default';
    const addonsKey = addons.map((a) => a.id).sort().join('-');
    const cartItemId = `${item.id}_${sizeKey}_${addonsKey}`;

    setItems((prev) => {
      const existingIdx = prev.findIndex((ci) => ci.id === cartItemId);
      if (existingIdx > -1) {
        const copy = [...prev];
        const newQty = copy[existingIdx].quantity + quantity;
        copy[existingIdx] = {
          ...copy[existingIdx],
          quantity: newQty,
          totalPrice: unitPrice * newQty,
          specialInstructions: specialInstructions || copy[existingIdx].specialInstructions,
        };
        return copy;
      } else {
        const newItem: CartItem = {
          id: cartItemId,
          menuItem: item,
          selectedSize: size,
          selectedAddons: addons,
          quantity,
          specialInstructions,
          totalPrice: unitPrice * quantity,
        };
        return [...prev, newItem];
      }
    });

    setIsOpen(true);
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setItems((prev) => {
      return prev
        .map((item) => {
          if (item.id === cartItemId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            const basePrice = item.selectedSize ? item.selectedSize.price : item.menuItem.price;
            const addonsTotal = (item.selectedAddons || []).reduce((sum, a) => sum + a.price, 0);
            const unitPrice = basePrice + addonsTotal;
            return {
              ...item,
              quantity: newQty,
              totalPrice: unitPrice * newQty,
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const removeItem = (cartItemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== cartItemId));
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
    setCouponError(null);
  };

  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);

  // Validate coupon min order
  const applyCoupon = (code: string): boolean => {
    setCouponError(null);
    const cleanCode = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === cleanCode && c.isActive);

    if (!found) {
      setCouponError('Invalid or expired promotional code.');
      return false;
    }

    if (subtotal < found.minOrderAmount) {
      setCouponError(`Minimum order of Rs. ${found.minOrderAmount} required for this code.`);
      return false;
    }

    setAppliedCoupon(found);
    return true;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
  };

  let discountAmount = 0;
  if (appliedCoupon && subtotal >= appliedCoupon.minOrderAmount) {
    if (appliedCoupon.discountType === 'percentage') {
      const rawDiscount = (subtotal * appliedCoupon.discountValue) / 100;
      discountAmount = appliedCoupon.maxDiscountAmount
        ? Math.min(rawDiscount, appliedCoupon.maxDiscountAmount)
        : rawDiscount;
    } else {
      discountAmount = appliedCoupon.discountValue;
    }
  }

  const freeDeliveryThreshold = settings?.freeDeliveryAbove || 2000;
  const standardDelivery = settings?.deliveryFee || 120;
  const deliveryFee = subtotal === 0 || subtotal >= freeDeliveryThreshold ? 0 : standardDelivery;

  const grandTotal = Math.max(0, subtotal - discountAmount + deliveryFee);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart,
        closeCart,
        toggleCart,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        appliedCoupon,
        couponError,
        applyCoupon,
        removeCoupon,
        subtotal,
        discountAmount,
        deliveryFee,
        grandTotal,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

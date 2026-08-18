import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  MenuItem,
  MenuCategory,
  HomepageCMS,
  RestaurantSettings,
  Coupon,
  Review,
} from '../types';
import { api } from '../lib/api';

interface RestaurantContextType {
  categories: MenuCategory[];
  menuItems: MenuItem[];
  homepage: HomepageCMS | null;
  settings: RestaurantSettings | null;
  coupons: Coupon[];
  reviews: Review[];
  isLoading: boolean;
  error: string | null;
  refreshAll: () => Promise<void>;
  getCategoryById: (id: string) => MenuCategory | undefined;
  getPopularItems: () => MenuItem[];
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [homepage, setHomepage] = useState<HomepageCMS | null>(null);
  const [settings, setSettings] = useState<RestaurantSettings | null>(null);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshAll = useCallback(async () => {
    try {
      setError(null);
      const [cats, items, home, sett, coup, revs] = await Promise.all([
        api.getCategories(),
        api.getMenuItems(),
        api.getHomepage(),
        api.getSettings(),
        api.getCoupons(),
        api.getReviews(),
      ]);

      setCategories(cats.sort((a, b) => a.displayOrder - b.displayOrder));
      setMenuItems(items);
      setHomepage(home);
      setSettings(sett);
      setCoupons(coup);
      setReviews(revs);
    } catch (err: any) {
      console.error('Failed to load restaurant data:', err);
      setError(err.message || 'Failed to load restaurant data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  const getCategoryById = (id: string) => {
    return categories.find((c) => c.id === id);
  };

  const getPopularItems = () => {
    return menuItems.filter((i) => i.isPopular && i.isAvailable);
  };

  return (
    <RestaurantContext.Provider
      value={{
        categories,
        menuItems,
        homepage,
        settings,
        coupons,
        reviews,
        isLoading,
        error,
        refreshAll,
        getCategoryById,
        getPopularItems,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
};

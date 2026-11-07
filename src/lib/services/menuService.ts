import { MenuItem, Category, CategoryId } from '../types/menu';
import { menuItems as initialMenuItems } from '../data/menuItems';
import { categories as initialCategories } from '../data/categories';

/**
 * ============================================================================
 * MENU SERVICE — CENTRALIZED CATALOG & DATA ACCESS LAYER
 * ============================================================================
 * 
 * ARCHITECTURE FOR FUTURE ADMIN INTEGRATION:
 * 
 * In this phase, menu data is managed in-memory seeded from initial mock data.
 * All UI components (Home, Menu, Hot Meals, Search, Cart) consume menu items
 * strictly through this service layer rather than hardcoding or directly importing
 * static files.
 * 
 * FUTURE ADMIN PANEL INTEGRATION (NOT IMPLEMENTED YET):
 * The future Admin Panel will interact with this exact service interface:
 * - Adding food items (addMenuItem)
 * - Editing food details, prices, images (updateMenuItem)
 * - Toggling item availability in real-time (updateItemAvailability)
 * - Deleting food items (deleteMenuItem)
 * - Managing categories (addCategory, updateCategory)
 * - Setting daily specials (setDailySpecial)
 * 
 * When backend REST / GraphQL APIs are connected, only this file needs to replace
 * local mutations with HTTP requests (`fetch('/api/admin/menu', ...)`).
 * No individual food card or UI component will need structural refactoring.
 * ============================================================================
 */

// In-memory state holding the current menu catalog
let currentMenuItems: MenuItem[] = [...initialMenuItems];
let currentCategories: Category[] = [...initialCategories];

export interface MenuFilterOptions {
  category?: CategoryId;
  search?: string;
  hotOnly?: boolean;
  popularOnly?: boolean;
  availableOnly?: boolean;
}

export const menuService = {
  /**
   * Fetch all menu items matching optional filters
   */
  async getMenuItems(options?: MenuFilterOptions): Promise<MenuItem[]> {
    let result = [...currentMenuItems];

    if (options?.category && options.category !== 'all') {
      result = result.filter(item => item.category === options.category);
    }

    if (options?.search && options.search.trim()) {
      const q = options.search.toLowerCase().trim();
      result = result.filter(
        item =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q)
      );
    }

    if (options?.hotOnly) {
      result = result.filter(item => item.hot);
    }

    if (options?.popularOnly) {
      result = result.filter(item => item.popular);
    }

    if (options?.availableOnly) {
      result = result.filter(item => item.available);
    }

    return result;
  },

  /**
   * Synchronous getter for instant client hydration when needed
   */
  getMenuItemsSync(options?: MenuFilterOptions): MenuItem[] {
    let result = [...currentMenuItems];

    if (options?.category && options.category !== 'all') {
      result = result.filter(item => item.category === options.category);
    }

    if (options?.search && options.search.trim()) {
      const q = options.search.toLowerCase().trim();
      result = result.filter(
        item =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q)
      );
    }

    if (options?.hotOnly) {
      result = result.filter(item => item.hot);
    }

    if (options?.popularOnly) {
      result = result.filter(item => item.popular);
    }

    return result;
  },

  /**
   * Get a single menu item by ID
   */
  async getMenuItemById(id: string): Promise<MenuItem | null> {
    const item = currentMenuItems.find(i => i.id === id);
    return item ? { ...item } : null;
  },

  /**
   * Get all menu categories
   */
  async getCategories(): Promise<Category[]> {
    return [...currentCategories];
  },

  /**
   * Get daily special item or items
   */
  async getDailySpecials(): Promise<MenuItem[]> {
    return currentMenuItems.filter(i => i.hot || i.popular).slice(0, 4);
  },

  /* -------------------------------------------------------------------------- */
  /* FUTURE ADMIN HOOKS (Ready for backend/admin panel API integration)         */
  /* -------------------------------------------------------------------------- */

  /**
   * Future Admin: Update availability status (e.g. toggle in-stock/sold-out)
   */
  async updateItemAvailability(id: string, available: boolean): Promise<MenuItem> {
    const index = currentMenuItems.findIndex(i => i.id === id);
    if (index === -1) throw new Error('Menu item not found');
    currentMenuItems[index] = { ...currentMenuItems[index], available };
    return { ...currentMenuItems[index] };
  },

  /**
   * Future Admin: Update full details of a food item (price, title, image, etc.)
   */
  async updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<MenuItem> {
    const index = currentMenuItems.findIndex(i => i.id === id);
    if (index === -1) throw new Error('Menu item not found');
    currentMenuItems[index] = { ...currentMenuItems[index], ...updates };
    return { ...currentMenuItems[index] };
  },

  /**
   * Future Admin: Add a new food item to the catalog
   */
  async addMenuItem(item: Omit<MenuItem, 'id'>): Promise<MenuItem> {
    const newItem: MenuItem = {
      ...item,
      id: `item-${Date.now()}`,
    };
    currentMenuItems.push(newItem);
    return newItem;
  },

  /**
   * Future Admin: Delete a food item
   */
  async deleteMenuItem(id: string): Promise<boolean> {
    const prevLen = currentMenuItems.length;
    currentMenuItems = currentMenuItems.filter(i => i.id !== id);
    return currentMenuItems.length < prevLen;
  },
};


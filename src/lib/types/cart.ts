import { MenuItem } from './menu';

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
}

export type CartAction =
  | { type: 'ADD_ITEM'; payload: MenuItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QTY'; payload: { id: string; qty: number } }
  | { type: 'CLEAR_CART' };


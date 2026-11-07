'use client';

import { createContext, useReducer, useEffect, ReactNode } from 'react';
import { CartState, CartAction, CartItem } from '@/lib/types/cart';
import { MenuItem } from '@/lib/types/menu';

interface CartContextValue extends CartState {
  addItem: (item: MenuItem) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
}

const initialState: CartState = {
  items: [],
  itemCount: 0,
  subtotal: 0,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  let newItems: CartItem[];

  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.menuItem.id === action.payload.id);
      if (existing) {
        newItems = state.items.map(i =>
          i.menuItem.id === action.payload.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      } else {
        newItems = [...state.items, { menuItem: action.payload, quantity: 1 }];
      }
      break;
    }
    case 'REMOVE_ITEM':
      newItems = state.items.filter(i => i.menuItem.id !== action.payload);
      break;
    case 'UPDATE_QTY':
      if (action.payload.qty <= 0) {
        newItems = state.items.filter(i => i.menuItem.id !== action.payload.id);
      } else {
        newItems = state.items.map(i =>
          i.menuItem.id === action.payload.id
            ? { ...i, quantity: action.payload.qty }
            : i
        );
      }
      break;
    case 'CLEAR_CART':
      newItems = [];
      break;
    default:
      return state;
  }

  const itemCount = newItems.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = newItems.reduce((sum, i) => sum + i.menuItem.price * i.quantity, 0);
  return { items: newItems, itemCount, subtotal };
}

export const CartContext = createContext<CartContextValue>({
  ...initialState,
  addItem: () => {},
  removeItem: () => {},
  updateQty: () => {},
  clearCart: () => {},
});

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Rehydrate from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cafe-ui:cart');
      if (saved) {
        const items: CartItem[] = JSON.parse(saved);
        items.forEach(i => {
          for (let j = 0; j < i.quantity; j++) {
            dispatch({ type: 'ADD_ITEM', payload: i.menuItem });
          }
        });
      }
    } catch {
      // ignore
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('cafe-ui:cart', JSON.stringify(state.items));
  }, [state.items]);

  const addItem = (item: MenuItem) => dispatch({ type: 'ADD_ITEM', payload: item });
  const removeItem = (id: string) => dispatch({ type: 'REMOVE_ITEM', payload: id });
  const updateQty = (id: string, qty: number) =>
    dispatch({ type: 'UPDATE_QTY', payload: { id, qty } });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  return (
    <CartContext.Provider value={{ ...state, addItem, removeItem, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}


import { CartItem } from './cart';

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  serviceCharge: number;
  total: number;
  status: OrderStatus;
  placedAt: string; // ISO date string
  estimatedTime?: number; // minutes
  note?: string;
}


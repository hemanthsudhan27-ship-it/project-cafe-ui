import { CartItem } from './cart';

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
export type PaymentMethod = 'online_upi' | 'pay_at_counter';
export type PaymentStatus = 'paid' | 'pending';

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  serviceCharge: number;
  total: number;
  status: OrderStatus;
  paymentMethod?: PaymentMethod;
  paymentStatus?: PaymentStatus;
  placedAt: string; // ISO date string
  estimatedTime?: number; // minutes
  note?: string;
}

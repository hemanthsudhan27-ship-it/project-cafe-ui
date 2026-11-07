import { Order, OrderStatus } from '../types/order';
import { CartItem } from '../types/cart';
import { mockOrders } from '../data/mockOrders';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const SERVICE_CHARGE_RATE = 0.05; // 5%

// In-memory order store
const orders: Order[] = [...mockOrders];

export const orderService = {
  async placeOrder(items: CartItem[], note?: string): Promise<Order> {
    await delay(1000);
    const subtotal = items.reduce((sum, i) => sum + i.menuItem.price * i.quantity, 0);
    const serviceCharge = Math.round(subtotal * SERVICE_CHARGE_RATE);
    const order: Order = {
      id: `ORD-${Date.now()}`,
      items,
      subtotal,
      serviceCharge,
      total: subtotal + serviceCharge,
      status: 'pending',
      placedAt: new Date().toISOString(),
      estimatedTime: 15 + Math.floor(Math.random() * 10),
      note,
    };
    orders.unshift(order);
    // Simulate status change
    setTimeout(() => {
      order.status = 'preparing';
    }, 5000);
    setTimeout(() => {
      order.status = 'ready';
    }, 15000);
    return order;
  },

  async getOrders(): Promise<Order[]> {
    await delay(400);
    return [...orders];
  },

  async getOrder(id: string): Promise<Order> {
    await delay(300);
    const order = orders.find(o => o.id === id);
    if (!order) throw new Error('Order not found');
    return order;
  },

  async cancelOrder(id: string): Promise<Order> {
    await delay(400);
    const order = orders.find(o => o.id === id);
    if (!order) throw new Error('Order not found');
    if (order.status === 'completed' || order.status === 'cancelled') {
      throw new Error('Cannot cancel this order');
    }
    order.status = 'cancelled';
    return order;
  },

  getServiceChargeRate(): number {
    return SERVICE_CHARGE_RATE;
  },
};


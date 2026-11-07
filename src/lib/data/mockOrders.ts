import { Order } from '../types/order';

export const mockOrders: Order[] = [
  {
    id: 'ORD-20241101-001',
    items: [
      {
        menuItem: {
          id: 'h2',
          name: 'Chicken Biryani',
          description: 'Dum-cooked basmati rice with tender chicken',
          price: 110,
          category: 'hot-meals',
          image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop',
          available: true,
        },
        quantity: 2,
      },
      {
        menuItem: {
          id: 'd2',
          name: 'Filter Coffee',
          description: 'South Indian decoction coffee with milk',
          price: 20,
          category: 'drinks',
          image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop',
          available: true,
        },
        quantity: 2,
      },
    ],
    subtotal: 260,
    serviceCharge: 13,
    total: 273,
    status: 'completed',
    placedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedTime: 20,
  },
  {
    id: 'ORD-20241103-002',
    items: [
      {
        menuItem: {
          id: 'b1',
          name: 'Masala Dosa',
          description: 'Crispy rice crepe with spiced potato filling',
          price: 55,
          category: 'breakfast',
          image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400&h=300&fit=crop',
          available: true,
        },
        quantity: 1,
      },
      {
        menuItem: {
          id: 'd1',
          name: 'Masala Chai',
          description: 'Spiced Indian tea',
          price: 15,
          category: 'drinks',
          image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop',
          available: true,
        },
        quantity: 1,
      },
    ],
    subtotal: 70,
    serviceCharge: 4,
    total: 74,
    status: 'ready',
    placedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    estimatedTime: 10,
  },
  {
    id: 'ORD-20241103-003',
    items: [
      {
        menuItem: {
          id: 'l1',
          name: 'Meals (Full)',
          description: 'Rice, sambar, rasam, 2 curries, papad, pickle and curd',
          price: 80,
          category: 'lunch',
          image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
          available: true,
        },
        quantity: 1,
      },
    ],
    subtotal: 80,
    serviceCharge: 4,
    total: 84,
    status: 'preparing',
    placedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    estimatedTime: 15,
  },
];


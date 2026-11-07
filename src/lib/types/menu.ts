export type CategoryId =
  | 'all'
  | 'breakfast'
  | 'lunch'
  | 'hot-meals'
  | 'snacks'
  | 'drinks'
  | 'desserts';

export interface Category {
  id: CategoryId;
  label: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: CategoryId;
  image: string;
  available: boolean;
  popular?: boolean;
  hot?: boolean;
  tags?: string[];
}


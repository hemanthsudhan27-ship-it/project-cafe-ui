import { CategoryId } from '@/lib/types/menu';
import {
  Utensils,
  Sun,
  UtensilsCrossed,
  Flame,
  Sandwich,
  CupSoda,
  CakeSlice,
  LucideIcon,
} from 'lucide-react';

const categoryIconMap: Record<CategoryId, LucideIcon> = {
  all: Utensils,
  breakfast: Sun,
  lunch: UtensilsCrossed,
  'hot-meals': Flame,
  snacks: Sandwich,
  drinks: CupSoda,
  desserts: CakeSlice,
};

interface CategoryIconProps {
  id: CategoryId;
  size?: number;
  className?: string;
}

export function CategoryIcon({ id, size = 18, className = '' }: CategoryIconProps) {
  const IconComponent = categoryIconMap[id] || Utensils;
  return <IconComponent size={size} className={className} />;
}


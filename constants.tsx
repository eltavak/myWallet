
import React from 'react';
import { 
  Utensils, 
  Car, 
  Home, 
  Film, 
  Wallet, 
  PlusCircle, 
  HeartPulse,
  MoreHorizontal,
  ShoppingBag,
  Zap,
  Coffee,
  Dumbbell,
  Plane,
  Briefcase,
  Gift
} from 'lucide-react';
import { Category } from './types';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'food', name: 'Продукты', icon: 'Utensils', color: 'bg-orange-500' },
  { id: 'transport', name: 'Транспорт', icon: 'Car', color: 'bg-blue-500' },
  { id: 'housing', name: 'Жилье', icon: 'Home', color: 'bg-indigo-500' },
  { id: 'entertainment', name: 'Развлечения', icon: 'Film', color: 'bg-purple-500' },
  { id: 'health', name: 'Здоровье', icon: 'HeartPulse', color: 'bg-red-500' },
  { id: 'income', name: 'Доходы', icon: 'Wallet', color: 'bg-green-500' },
  { id: 'other', name: 'Прочее', icon: 'MoreHorizontal', color: 'bg-gray-500' },
];

export const AVAILABLE_ICONS = [
  'Utensils', 'Car', 'Home', 'Film', 'Wallet', 'HeartPulse', 
  'ShoppingBag', 'Zap', 'Coffee', 'Dumbbell', 'Plane', 'Briefcase', 'Gift', 'MoreHorizontal'
];

export const AVAILABLE_COLORS = [
  'bg-orange-500', 'bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 
  'bg-red-500', 'bg-green-500', 'bg-gray-500', 'bg-pink-500', 'bg-yellow-500', 'bg-teal-500'
];

export const getCategoryIcon = (iconName: string, className?: string) => {
  switch (iconName) {
    case 'Utensils': return <Utensils className={className} />;
    case 'Car': return <Car className={className} />;
    case 'Home': return <Home className={className} />;
    case 'Film': return <Film className={className} />;
    case 'Wallet': return <Wallet className={className} />;
    case 'HeartPulse': return <HeartPulse className={className} />;
    case 'ShoppingBag': return <ShoppingBag className={className} />;
    case 'Zap': return <Zap className={className} />;
    case 'Coffee': return <Coffee className={className} />;
    case 'Dumbbell': return <Dumbbell className={className} />;
    case 'Plane': return <Plane className={className} />;
    case 'Briefcase': return <Briefcase className={className} />;
    case 'Gift': return <Gift className={className} />;
    case 'MoreHorizontal': return <MoreHorizontal className={className} />;
    default: return <PlusCircle className={className} />;
  }
};

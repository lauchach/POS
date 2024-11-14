import { Product, Category } from './types';

export const categories: Category[] = [
  { id: '1', name: 'Beverages', icon: 'coffee' },
  { id: '2', name: 'Food', icon: 'utensils' },
  { id: '3', name: 'Desserts', icon: 'cake' },
  { id: '4', name: 'Snacks', icon: 'cookie' },
];

export const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Cappuccino',
    price: 4.99,
    category: '1',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=300',
  },
  {
    id: '2',
    name: 'Club Sandwich',
    price: 12.99,
    category: '2',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=300',
  },
  {
    id: '3',
    name: 'Chocolate Cake',
    price: 6.99,
    category: '3',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=300',
  },
  {
    id: '4',
    name: 'Green Tea',
    price: 3.99,
    category: '1',
    image: 'https://t0.gstatic.com/licensed-image?q=tbn:ANd9GcTMDEr5rldvWaJICSs3GVqYmdDJjD1x-qQgjiImUXo56bqXaBR_jT0ghmaVeqdANU4S',
  },
  {
    id: '5',
    name: 'Caesar Salad',
    price: 10.99,
    category: '2',
    image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=300',
  },
  {
    id: '6',
    name: 'Mixed Nuts',
    price: 5.99,
    category: '4',
    image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=300',
  },
];
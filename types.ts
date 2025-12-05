export enum ProductCategory {
  Skincare = 'Skincare',
  PainRelief = 'Pain Relief',
  Haircare = 'Haircare',
  Weightloss = 'Weightloss',
  Other = 'Other'
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Manufacturer {
  name: string;
  contact: string;
  email: string;
  address: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  images: string[]; // Changed from single image to array of 5 images
  description: string;
  howToUse: string;
  manufacturer: Manufacturer;
  note: string;
  rating: number;
  reviews: number;
}

export interface CartItem extends Product {
  quantity: number;
  image: string; // Keep a single main image for cart display
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isStreaming?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
}

export interface Order {
  id: string;
  customerName: string;
  items: CartItem[];
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered';
  date: string;
}
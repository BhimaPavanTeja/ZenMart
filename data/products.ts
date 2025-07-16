import { Product } from '@/types';

export const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    price: 129.99,
    description: 'Premium wireless headphones with noise cancellation and 30-hour battery life.',
    images: [
      'https://images.pexels.com/photos/3945667/pexels-photo-3945667.jpeg?auto=compress&cs=tinysrgb&w=500',
      'https://images.pexels.com/photos/8728380/pexels-photo-8728380.jpeg?auto=compress&cs=tinysrgb&w=500'
    ],
    category: 'Electronics',
    brand: 'TechPro',
    rating: 4.5,
    reviews: 234,
    inStock: true,
    tags: ['wireless', 'bluetooth', 'noise-cancelling']
  },
  {
    id: '2',
    name: 'Smart Fitness Watch',
    price: 299.99,
    description: 'Advanced fitness tracking with heart rate monitoring, GPS, and 7-day battery life.',
    images: [
      'https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg?auto=compress&cs=tinysrgb&w=500',
      'https://images.pexels.com/photos/5081916/pexels-photo-5081916.jpeg?auto=compress&cs=tinysrgb&w=500'
    ],
    category: 'Wearables',
    brand: 'FitTech',
    rating: 4.7,
    reviews: 189,
    inStock: true,
    tags: ['fitness', 'smart', 'gps', 'health']
  },
  {
    id: '3',
    name: 'Organic Cotton T-Shirt',
    price: 39.99,
    description: 'Soft, sustainable organic cotton t-shirt in premium quality fabric.',
    images: [
      'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=500',
      'https://images.pexels.com/photos/1020585/pexels-photo-1020585.jpeg?auto=compress&cs=tinysrgb&w=500'
    ],
    category: 'Clothing',
    brand: 'EcoWear',
    rating: 4.3,
    reviews: 156,
    inStock: true,
    tags: ['organic', 'cotton', 'sustainable', 'casual']
  },
  {
    id: '4',
    name: 'Professional Camera Lens',
    price: 599.99,
    description: '50mm f/1.8 prime lens for professional photography with exceptional image quality.',
    images: [
      'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=500',
      'https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg?auto=compress&cs=tinysrgb&w=500'
    ],
    category: 'Photography',
    brand: 'LensMaster',
    rating: 4.8,
    reviews: 89,
    inStock: true,
    tags: ['camera', 'lens', 'photography', 'professional']
  },
  {
    id: '5',
    name: 'Ergonomic Office Chair',
    price: 449.99,
    description: 'Premium ergonomic office chair with lumbar support and adjustable height.',
    images: [
      'https://images.pexels.com/photos/2062431/pexels-photo-2062431.jpeg?auto=compress&cs=tinysrgb&w=500',
      'https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg?auto=compress&cs=tinysrgb&w=500'
    ],
    category: 'Furniture',
    brand: 'ComfortPro',
    rating: 4.6,
    reviews: 203,
    inStock: true,
    tags: ['office', 'ergonomic', 'chair', 'comfort']
  },
  {
    id: '6',
    name: 'HP Pavilion 15.6" Laptop',
    price: 899.99,
    description: 'Powerful HP Pavilion laptop with Intel Core i7 processor, 16GB RAM, 512GB SSD, and NVIDIA GeForce graphics for work and entertainment.',
    images: [
      'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=500',
      'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=500'
    ],
    category: 'Electronics',
    brand: 'HP',
    rating: 4.4,
    reviews: 312,
    inStock: true,
    tags: ['laptop', 'computer', 'gaming', 'work', 'portable']
  }
];
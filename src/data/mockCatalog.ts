export interface CatalogCategory {
  id: string;
  name: string;
  description?: string;
  slug: string;
}

export interface CatalogProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  stock_quantity: number;
  category: Pick<CatalogCategory, 'id' | 'name'>;
  created_at: string;
}

export const MOCK_CATEGORIES: CatalogCategory[] = [
  {
    id: '10000000-0000-4000-8000-000000000001',
    name: 'Tech Gadgets',
    description: 'Smart devices and everyday electronics',
    slug: 'tech-gadgets',
  },
  {
    id: '10000000-0000-4000-8000-000000000002',
    name: 'Clothing',
    description: 'Comfortable modern wardrobe essentials',
    slug: 'clothing',
  },
  {
    id: '10000000-0000-4000-8000-000000000003',
    name: 'Home & Office',
    description: 'Useful upgrades for work and home',
    slug: 'home-office',
  },
];

const [tech, clothing, home] = MOCK_CATEGORIES;

export const MOCK_PRODUCTS: CatalogProduct[] = [
  {
    id: '20000000-0000-4000-8000-000000000001',
    name: 'Pulse Wireless Headphones',
    description: 'Over-ear headphones with active noise cancellation, rich sound and 32-hour battery life.',
    price: 129.99,
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85',
    stock_quantity: 42,
    category: tech,
    created_at: '2026-09-19T10:00:00.000Z',
  },
  {
    id: '20000000-0000-4000-8000-000000000002',
    name: 'Orbit Smartwatch',
    description: 'A lightweight fitness smartwatch with heart-rate tracking, GPS and a crisp AMOLED display.',
    price: 189.0,
    image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85',
    stock_quantity: 28,
    category: tech,
    created_at: '2026-09-18T10:00:00.000Z',
  },
  {
    id: '20000000-0000-4000-8000-000000000003',
    name: 'Pocket Bluetooth Speaker',
    description: 'Compact water-resistant speaker with punchy sound and up to 14 hours of playback.',
    price: 59.95,
    image_url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=85',
    stock_quantity: 65,
    category: tech,
    created_at: '2026-09-17T10:00:00.000Z',
  },
  {
    id: '20000000-0000-4000-8000-000000000004',
    name: 'Everyday Cotton Tee',
    description: 'Soft heavyweight organic-cotton T-shirt with a relaxed unisex fit.',
    price: 29.9,
    image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85',
    stock_quantity: 90,
    category: clothing,
    created_at: '2026-09-16T10:00:00.000Z',
  },
  {
    id: '20000000-0000-4000-8000-000000000005',
    name: 'Classic Denim Jacket',
    description: 'A timeless mid-wash denim jacket designed for easy year-round layering.',
    price: 84.5,
    image_url: 'https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=900&q=85',
    stock_quantity: 24,
    category: clothing,
    created_at: '2026-09-15T10:00:00.000Z',
  },
  {
    id: '20000000-0000-4000-8000-000000000006',
    name: 'Urban Daypack',
    description: 'Minimal 20-litre backpack with a padded laptop sleeve and weather-resistant shell.',
    price: 68.0,
    image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85',
    stock_quantity: 37,
    category: clothing,
    created_at: '2026-09-14T10:00:00.000Z',
  },
  {
    id: '20000000-0000-4000-8000-000000000007',
    name: 'Halo Desk Lamp',
    description: 'Dimmable LED desk lamp with adjustable colour temperature and a USB-C charging port.',
    price: 49.99,
    image_url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85',
    stock_quantity: 31,
    category: home,
    created_at: '2026-09-13T10:00:00.000Z',
  },
  {
    id: '20000000-0000-4000-8000-000000000008',
    name: 'Ceramic Travel Mug',
    description: 'Double-wall reusable mug with a splash-proof lid and a smooth ceramic interior.',
    price: 26.5,
    image_url: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=85',
    stock_quantity: 54,
    category: home,
    created_at: '2026-09-12T10:00:00.000Z',
  },
];


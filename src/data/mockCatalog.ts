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

export const PRODUCT_IMAGE_BY_NAME: Record<string, string> = {
  'Pulse Wireless Headphones': '/products/wireless-headphones.png',
  'Wireless Headphones': '/products/wireless-headphones.png',
  'Orbit Smartwatch': '/products/smartwatch.png',
  'Pocket Bluetooth Speaker': '/products/bluetooth-speaker.png',
  'Everyday Cotton Tee': '/products/cotton-tee.png',
  'Cotton T-Shirt': '/products/cotton-tee.png',
  'Classic Denim Jacket': '/products/denim-jacket.png',
  'Denim Jeans': '/products/denim-jacket.png',
  'Urban Daypack': '/products/urban-daypack.png',
  'Smartphone Case': '/products/urban-daypack.png',
  'Halo Desk Lamp': '/products/desk-lamp.png',
  'Ceramic Travel Mug': '/products/travel-mug.png',
  'Slate Mechanical Keyboard': '/products/mechanical-keyboard.png',
  'Multiport USB-C Hub': '/products/usb-c-hub.png',
  'Essential Pullover Hoodie': '/products/everyday-hoodie.png',
  'Minimal Everyday Sneakers': '/products/minimal-sneakers.png',
  'Oak Desk Organizer': '/products/desk-organizer.png',
  'Insulated Water Bottle': '/products/insulated-bottle.png',
};

export const getCatalogProductImage = (name: string, currentImage?: string | null) =>
  PRODUCT_IMAGE_BY_NAME[name] ?? currentImage ?? undefined;

export const MOCK_PRODUCTS: CatalogProduct[] = [
  {
    id: '20000000-0000-4000-8000-000000000001',
    name: 'Pulse Wireless Headphones',
    description: 'Over-ear headphones with active noise cancellation, rich sound and 32-hour battery life.',
    price: 129.99,
    image_url: '/products/wireless-headphones.png',
    stock_quantity: 42,
    category: tech,
    created_at: '2026-09-19T10:00:00.000Z',
  },
  {
    id: '20000000-0000-4000-8000-000000000002',
    name: 'Orbit Smartwatch',
    description: 'A lightweight fitness smartwatch with heart-rate tracking, GPS and a crisp AMOLED display.',
    price: 189.0,
    image_url: '/products/smartwatch.png',
    stock_quantity: 28,
    category: tech,
    created_at: '2026-09-18T10:00:00.000Z',
  },
  {
    id: '20000000-0000-4000-8000-000000000003',
    name: 'Pocket Bluetooth Speaker',
    description: 'Compact water-resistant speaker with punchy sound and up to 14 hours of playback.',
    price: 59.95,
    image_url: '/products/bluetooth-speaker.png',
    stock_quantity: 65,
    category: tech,
    created_at: '2026-09-17T10:00:00.000Z',
  },
  {
    id: '20000000-0000-4000-8000-000000000004',
    name: 'Everyday Cotton Tee',
    description: 'Soft heavyweight organic-cotton T-shirt with a relaxed unisex fit.',
    price: 29.9,
    image_url: '/products/cotton-tee.png',
    stock_quantity: 90,
    category: clothing,
    created_at: '2026-09-16T10:00:00.000Z',
  },
  {
    id: '20000000-0000-4000-8000-000000000005',
    name: 'Classic Denim Jacket',
    description: 'A timeless mid-wash denim jacket designed for easy year-round layering.',
    price: 84.5,
    image_url: '/products/denim-jacket.png',
    stock_quantity: 24,
    category: clothing,
    created_at: '2026-09-15T10:00:00.000Z',
  },
  {
    id: '20000000-0000-4000-8000-000000000006',
    name: 'Urban Daypack',
    description: 'Minimal 20-litre backpack with a padded laptop sleeve and weather-resistant shell.',
    price: 68.0,
    image_url: '/products/urban-daypack.png',
    stock_quantity: 37,
    category: clothing,
    created_at: '2026-09-14T10:00:00.000Z',
  },
  {
    id: '20000000-0000-4000-8000-000000000007',
    name: 'Halo Desk Lamp',
    description: 'Dimmable LED desk lamp with adjustable colour temperature and a USB-C charging port.',
    price: 49.99,
    image_url: '/products/desk-lamp.png',
    stock_quantity: 31,
    category: home,
    created_at: '2026-09-13T10:00:00.000Z',
  },
  {
    id: '20000000-0000-4000-8000-000000000008',
    name: 'Ceramic Travel Mug',
    description: 'Double-wall reusable mug with a splash-proof lid and a smooth ceramic interior.',
    price: 26.5,
    image_url: '/products/travel-mug.png',
    stock_quantity: 54,
    category: home,
    created_at: '2026-09-12T10:00:00.000Z',
  },
  {
    id: '20000000-0000-4000-8000-000000000009',
    name: 'Slate Mechanical Keyboard',
    description: 'Compact wireless mechanical keyboard with tactile switches and a space-saving 75% layout.',
    price: 94.99,
    image_url: '/products/mechanical-keyboard.png',
    stock_quantity: 36,
    category: tech,
    created_at: '2026-09-11T10:00:00.000Z',
  },
  {
    id: '20000000-0000-4000-8000-000000000010',
    name: 'Multiport USB-C Hub',
    description: 'Slim aluminum hub with HDMI, USB-A, USB-C and memory-card connectivity for modern laptops.',
    price: 44.9,
    image_url: '/products/usb-c-hub.png',
    stock_quantity: 58,
    category: tech,
    created_at: '2026-09-10T10:00:00.000Z',
  },
  {
    id: '20000000-0000-4000-8000-000000000011',
    name: 'Essential Pullover Hoodie',
    description: 'Heavyweight cotton-blend hoodie with a relaxed fit, soft brushed interior and kangaroo pocket.',
    price: 64.0,
    image_url: '/products/everyday-hoodie.png',
    stock_quantity: 47,
    category: clothing,
    created_at: '2026-09-09T10:00:00.000Z',
  },
  {
    id: '20000000-0000-4000-8000-000000000012',
    name: 'Minimal Everyday Sneakers',
    description: 'Clean low-top sneakers with a cushioned insole and versatile off-white finish.',
    price: 79.5,
    image_url: '/products/minimal-sneakers.png',
    stock_quantity: 33,
    category: clothing,
    created_at: '2026-09-08T10:00:00.000Z',
  },
  {
    id: '20000000-0000-4000-8000-000000000013',
    name: 'Oak Desk Organizer',
    description: 'Solid oak organizer with dedicated compartments for pens, notes and everyday desk accessories.',
    price: 39.95,
    image_url: '/products/desk-organizer.png',
    stock_quantity: 29,
    category: home,
    created_at: '2026-09-07T10:00:00.000Z',
  },
  {
    id: '20000000-0000-4000-8000-000000000014',
    name: 'Insulated Water Bottle',
    description: 'Double-wall stainless-steel bottle that keeps drinks cold for 24 hours or hot for 12.',
    price: 31.99,
    image_url: '/products/insulated-bottle.png',
    stock_quantity: 72,
    category: home,
    created_at: '2026-09-06T10:00:00.000Z',
  },
];

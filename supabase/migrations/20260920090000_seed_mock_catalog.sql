-- Idempotent demo catalog for local, preview, and hosted environments.
INSERT INTO public.categories (name, description, slug)
VALUES
  ('Tech Gadgets', 'Smart devices and everyday electronics', 'tech-gadgets'),
  ('Clothing', 'Comfortable modern wardrobe essentials', 'clothing'),
  ('Home & Office', 'Useful upgrades for work and home', 'home-office')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

INSERT INTO public.products
  (name, description, price, category_id, image_url, sku, stock_quantity, is_active, tags, slug)
VALUES
  ('Pulse Wireless Headphones', 'Over-ear headphones with active noise cancellation, rich sound and 32-hour battery life.', 129.99, (SELECT id FROM public.categories WHERE slug = 'tech-gadgets'), '/products/wireless-headphones.png', 'MOCK-TECH-001', 42, true, ARRAY['audio','wireless'], 'pulse-wireless-headphones'),
  ('Orbit Smartwatch', 'A lightweight fitness smartwatch with heart-rate tracking, GPS and a crisp AMOLED display.', 189.00, (SELECT id FROM public.categories WHERE slug = 'tech-gadgets'), '/products/smartwatch.png', 'MOCK-TECH-002', 28, true, ARRAY['wearable','fitness'], 'orbit-smartwatch'),
  ('Pocket Bluetooth Speaker', 'Compact water-resistant speaker with punchy sound and up to 14 hours of playback.', 59.95, (SELECT id FROM public.categories WHERE slug = 'tech-gadgets'), '/products/bluetooth-speaker.png', 'MOCK-TECH-003', 65, true, ARRAY['audio','portable'], 'pocket-bluetooth-speaker'),
  ('Everyday Cotton Tee', 'Soft heavyweight organic-cotton T-shirt with a relaxed unisex fit.', 29.90, (SELECT id FROM public.categories WHERE slug = 'clothing'), '/products/cotton-tee.png', 'MOCK-CLOTH-001', 90, true, ARRAY['cotton','essential'], 'everyday-cotton-tee'),
  ('Classic Denim Jacket', 'A timeless mid-wash denim jacket designed for easy year-round layering.', 84.50, (SELECT id FROM public.categories WHERE slug = 'clothing'), '/products/denim-jacket.png', 'MOCK-CLOTH-002', 24, true, ARRAY['denim','outerwear'], 'classic-denim-jacket'),
  ('Urban Daypack', 'Minimal 20-litre backpack with a padded laptop sleeve and weather-resistant shell.', 68.00, (SELECT id FROM public.categories WHERE slug = 'clothing'), '/products/urban-daypack.png', 'MOCK-CLOTH-003', 37, true, ARRAY['bag','travel'], 'urban-daypack'),
  ('Halo Desk Lamp', 'Dimmable LED desk lamp with adjustable colour temperature and a USB-C charging port.', 49.99, (SELECT id FROM public.categories WHERE slug = 'home-office'), '/products/desk-lamp.png', 'MOCK-HOME-001', 31, true, ARRAY['lighting','office'], 'halo-desk-lamp'),
  ('Ceramic Travel Mug', 'Double-wall reusable mug with a splash-proof lid and a smooth ceramic interior.', 26.50, (SELECT id FROM public.categories WHERE slug = 'home-office'), '/products/travel-mug.png', 'MOCK-HOME-002', 54, true, ARRAY['drinkware','travel'], 'ceramic-travel-mug'),
  ('Slate Mechanical Keyboard', 'Compact wireless mechanical keyboard with tactile switches and a space-saving 75% layout.', 94.99, (SELECT id FROM public.categories WHERE slug = 'tech-gadgets'), '/products/mechanical-keyboard.png', 'MOCK-TECH-004', 36, true, ARRAY['keyboard','wireless'], 'slate-mechanical-keyboard'),
  ('Multiport USB-C Hub', 'Slim aluminum hub with HDMI, USB-A, USB-C and memory-card connectivity for modern laptops.', 44.90, (SELECT id FROM public.categories WHERE slug = 'tech-gadgets'), '/products/usb-c-hub.png', 'MOCK-TECH-005', 58, true, ARRAY['usb-c','connectivity'], 'multiport-usb-c-hub'),
  ('Essential Pullover Hoodie', 'Heavyweight cotton-blend hoodie with a relaxed fit, soft brushed interior and kangaroo pocket.', 64.00, (SELECT id FROM public.categories WHERE slug = 'clothing'), '/products/everyday-hoodie.png', 'MOCK-CLOTH-004', 47, true, ARRAY['hoodie','essential'], 'essential-pullover-hoodie'),
  ('Minimal Everyday Sneakers', 'Clean low-top sneakers with a cushioned insole and versatile off-white finish.', 79.50, (SELECT id FROM public.categories WHERE slug = 'clothing'), '/products/minimal-sneakers.png', 'MOCK-CLOTH-005', 33, true, ARRAY['footwear','sneakers'], 'minimal-everyday-sneakers'),
  ('Oak Desk Organizer', 'Solid oak organizer with dedicated compartments for pens, notes and everyday desk accessories.', 39.95, (SELECT id FROM public.categories WHERE slug = 'home-office'), '/products/desk-organizer.png', 'MOCK-HOME-003', 29, true, ARRAY['desk','organization'], 'oak-desk-organizer'),
  ('Insulated Water Bottle', 'Double-wall stainless-steel bottle that keeps drinks cold for 24 hours or hot for 12.', 31.99, (SELECT id FROM public.categories WHERE slug = 'home-office'), '/products/insulated-bottle.png', 'MOCK-HOME-004', 72, true, ARRAY['drinkware','insulated'], 'insulated-water-bottle')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  category_id = EXCLUDED.category_id,
  image_url = EXCLUDED.image_url,
  sku = EXCLUDED.sku,
  stock_quantity = EXCLUDED.stock_quantity,
  is_active = EXCLUDED.is_active,
  tags = EXCLUDED.tags;

-- Seed data for EcoFinds Marketplace

-- Insert sample products (these will be associated with the first user)
insert into public.products (owner_id, title, description, category, price_cents, images)
select 
  id as owner_id,
  'Kindle Paperwhite (11th Gen)' as title,
  'Gently used e-reader in excellent condition. Perfect for sustainable reading with long battery life and no ads. Includes original charger and case.' as description,
  'Electronics' as category,
  450000 as price_cents,
  '{}' as images
from auth.users 
limit 1;

insert into public.products (owner_id, title, description, category, price_cents, images)
select 
  id as owner_id,
  'Vintage Wooden Study Desk' as title,
  'Beautiful solid wood desk perfect for home office or student use. Some minor scratches that add character. Dimensions: 120cm x 60cm x 75cm.' as description,
  'Home & Living' as category,
  350000 as price_cents,
  '{}' as images
from auth.users 
limit 1;

insert into public.products (owner_id, title, description, category, price_cents, images)
select 
  id as owner_id,
  'English Willow Cricket Bat' as title,
  'Professional grade cricket bat made from premium English willow. Lightweight design with excellent pickup. Perfect for serious players. Size: SH.' as description,
  'Sports & Outdoors' as category,
  220000 as price_cents,
  '{}' as images
from auth.users 
limit 1;

insert into public.products (owner_id, title, description, category, price_cents, images)
select 
  id as owner_id,
  'Vintage Leather Messenger Bag' as title,
  'Handcrafted genuine leather messenger bag with beautiful patina. Perfect for daily use or business meetings. Multiple compartments for organization.' as description,
  'Fashion & Apparel' as category,
  180000 as price_cents,
  '{}' as images
from auth.users 
limit 1;

insert into public.products (owner_id, title, description, category, price_cents, images)
select 
  id as owner_id,
  'Complete Harry Potter Book Set' as title,
  'All 7 books in excellent condition. Perfect for gifting or adding to your collection. Hardcover edition with original dust jackets.' as description,
  'Books & Media' as category,
  120000 as price_cents,
  '{}' as images
from auth.users 
limit 1;

insert into public.products (owner_id, title, description, category, price_cents, images)
select 
  id as owner_id,
  'Retro Vinyl Record Player' as title,
  'Vintage-style turntable with built-in speakers. Great condition, perfect for vinyl enthusiasts. Includes USB output for digitizing records.' as description,
  'Electronics' as category,
  320000 as price_cents,
  '{}' as images
from auth.users 
limit 1;

insert into public.products (owner_id, title, description, category, price_cents, images)
select 
  id as owner_id,
  'Handmade Ceramic Dinner Set' as title,
  'Beautiful handcrafted ceramic plates, bowls, and mugs. Unique glazing and perfect for sustainable dining. Set includes 4 place settings.' as description,
  'Home & Living' as category,
  280000 as price_cents,
  '{}' as images
from auth.users 
limit 1;

insert into public.products (owner_id, title, description, category, price_cents, images)
select 
  id as owner_id,
  'Vintage Camera Collection' as title,
  'Collection of 3 vintage film cameras in working condition. Perfect for photography enthusiasts or collectors. Includes basic accessories.' as description,
  'Collectibles' as category,
  450000 as price_cents,
  '{}' as images
from auth.users 
limit 1;

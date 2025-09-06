-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- ENUMS
create type order_status as enum ('PAID','CANCELLED');

-- USERS (extend auth.users with profile)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null check (char_length(username) between 3 and 20),
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- PRODUCTS
create table public.products (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text not null,
  category text not null,
  price_cents int not null check (price_cents >= 0),
  images text[] not null default '{}', -- store storage URLs
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- CARTS (1 active cart per user)
create table public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  quantity int not null check (quantity > 0),
  unique(cart_id, product_id)
);

-- ORDERS & ITEMS
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  status order_status not null default 'PAID',
  total_cents int not null check (total_cents >= 0),
  created_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  price_cents int not null,
  quantity int not null check (quantity > 0)
);

-- INDEXES
create index products_owner_idx on public.products(owner_id);
create index products_category_idx on public.products(category);
create index products_title_search_idx on public.products using gin (to_tsvector('english', title));
create index products_created_at_idx on public.products(created_at desc);
create index products_price_cents_idx on public.products(price_cents);
create index cart_items_cart_id_idx on public.cart_items(cart_id);
create index order_items_order_id_idx on public.order_items(order_id);
create index orders_user_id_idx on public.orders(user_id);
create index orders_created_at_idx on public.orders(created_at desc);

-- FUNCTIONS
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username)
  values (new.id, 'user_' || substr(new.id::text, 1, 6));
  
  insert into public.carts (user_id)
  values (new.id);
  
  return new;
end;
$$ language plpgsql security definer;

-- TRIGGERS
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- RLS Policies
-- Profiles
create policy "view own profile or public listing" on public.profiles
for select using (true);

create policy "update own profile" on public.profiles
for update using (auth.uid() = id);

create policy "insert own profile" on public.profiles
for insert with check (auth.uid() = id);

-- Products
create policy "read active products" on public.products
for select using (is_active = true or owner_id = auth.uid());

create policy "insert own product" on public.products
for insert with check (owner_id = auth.uid());

create policy "update own product" on public.products
for update using (owner_id = auth.uid());

create policy "delete own product" on public.products
for delete using (owner_id = auth.uid());

-- Carts
create policy "select own cart" on public.carts
for select using (user_id = auth.uid());

create policy "insert own cart" on public.carts
for insert with check (user_id = auth.uid());

create policy "update own cart" on public.carts
for update using (user_id = auth.uid());

-- Cart Items
create policy "CRUD items in own cart" on public.cart_items
for all using (exists (select 1 from public.carts c where c.id = cart_items.cart_id and c.user_id = auth.uid()))
with check (exists (select 1 from public.carts c where c.id = cart_items.cart_id and c.user_id = auth.uid()));

-- Orders
create policy "read own orders" on public.orders
for select using (user_id = auth.uid());

create policy "insert own orders" on public.orders
for insert with check (user_id = auth.uid());

-- Order Items
create policy "read items in own orders" on public.order_items
for select using (exists (select 1 from public.orders o where o.id = order_items.order_id and o.user_id = auth.uid()));

create policy "insert items for own orders" on public.order_items
for insert with check (exists (select 1 from public.orders o where o.id = order_items.order_id and o.user_id = auth.uid()));

-- =====================================================
-- DATABASE.SQL - CREPERÍA APP (VERSIÓN FINAL CORRECTA)
-- =====================================================

-- =========================
-- EXTENSIONES
-- =========================
create extension if not exists "uuid-ossp";

-- =========================
-- TABLA: PROFILES
-- =========================
create table if not exists profiles (
id uuid primary key references auth.users(id) on delete cascade,
email text,
full_name text,
phone text,
role text default 'user',
created_at timestamp default now()
);

-- =========================
-- TABLA: INGREDIENTS
-- =========================
create table if not exists ingredients (
id uuid primary key default gen_random_uuid(),
name text not null,
category text not null,
price numeric not null,
available boolean default true
);

-- =========================
-- TABLA: ORDERS
-- =========================
create table if not exists orders (
id uuid primary key default gen_random_uuid(),
user_id uuid references profiles(id) on delete cascade,
status text default 'pending',
total numeric,
notes text,
created_at timestamp default now(),
updated_at timestamp
);

-- =========================
-- TABLA: ORDER_ITEMS
-- =========================
create table if not exists order_items (
id uuid primary key default gen_random_uuid(),
order_id uuid references orders(id) on delete cascade,
base_ingredient_id uuid references ingredients(id),
price numeric,
created_at timestamp default now()
);

-- =========================
-- TABLA: ORDER_ITEM_TOPPINGS
-- =========================
create table if not exists order_item_toppings (
id uuid primary key default gen_random_uuid(),
order_item_id uuid references order_items(id) on delete cascade,
ingredient_id uuid references ingredients(id)
);

-- =========================
-- TRIGGER: CREAR PROFILE AUTOMÁTICO
-- =========================
create or replace function handle_new_user()
returns trigger as $$
begin
insert into public.profiles (id, email, full_name, role)
values (new.id, new.email, '', 'user');
return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure handle_new_user();

-- =========================
-- TRIGGER: UPDATED_AT AUTOMÁTICO
-- =========================
create or replace function update_timestamp()
returns trigger as $$
begin
new.updated_at = now();
return new;
end;
$$ language plpgsql;

drop trigger if exists update_orders_timestamp on orders;

create trigger update_orders_timestamp
before update on orders
for each row execute procedure update_timestamp();

-- =========================
-- ACTIVAR RLS
-- =========================
alter table profiles enable row level security;
alter table ingredients enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table order_item_toppings enable row level security;

-- =========================
-- POLICIES: PROFILES
-- =========================
create policy "Users can view own profile"
on profiles for select
using (auth.uid() = id);

create policy "Users can update own profile"
on profiles for update
using (auth.uid() = id);

-- =========================
-- POLICIES: INGREDIENTS
-- =========================
create policy "Public can view ingredients"
on ingredients for select
using (true);

-- =========================
-- POLICIES: ORDERS
-- =========================
create policy "Users can create orders"
on orders for insert
with check (auth.uid() = user_id);

create policy "Users can view own orders"
on orders for select
using (auth.uid() = user_id);

create policy "Admin can view all orders"
on orders for select
using (
exists (
select 1 from profiles
where profiles.id = auth.uid()
and profiles.role = 'admin'
)
);

create policy "Admin can update orders"
on orders for update
using (
exists (
select 1 from profiles
where profiles.id = auth.uid()
and profiles.role = 'admin'
)
)
with check (
exists (
select 1 from profiles
where profiles.id = auth.uid()
and profiles.role = 'admin'
)
);

-- =========================
-- POLICIES: ORDER_ITEMS
-- =========================
create policy "Users can insert order_items"
on order_items for insert
with check (true);

create policy "Users can view order_items"
on order_items for select
using (true);

-- =========================
-- POLICIES: TOPPINGS
-- =========================
create policy "Users can insert toppings"
on order_item_toppings for insert
with check (true);

create policy "Users can view toppings"
on order_item_toppings for select
using (true);

-- =========================
-- INGREDIENTES INICIALES
-- =========================
insert into ingredients (name, category, price, available) values
-- BASES
('Nutella', 'base', 20, true),
('Cajeta', 'base', 18, true),
('Chocolate', 'base', 15, true),
('Leche condensada', 'base', 17, true),

-- TOPPINGS
('Fresa', 'topping', 15, true),
('Plátano', 'topping', 15, true),
('Kiwi', 'topping', 18, true),
('Mango', 'topping', 18, true),
('Durazno', 'topping', 17, true),
('Oreo', 'topping', 12, true),
('Galleta María', 'topping', 10, true),

-- EXTRAS
('Lechera extra', 'extra', 10, true),
('Chispas de chocolate', 'extra', 10, true),
('Helado de vainilla', 'extra', 25, true),
('Helado de chocolate', 'extra', 25, true),
('Crema batida', 'extra', 12, true),
('Nueces', 'extra', 15, true);

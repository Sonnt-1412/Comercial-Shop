create schema if not exists private;

create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_full_name_length check (char_length(full_name) <= 120),
  constraint profiles_phone_length check (char_length(phone) <= 30)
);

create table public.products (
  slug text primary key,
  name text not null,
  category text not null,
  price bigint not null check (price >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint products_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint products_name_length check (char_length(name) between 1 and 160),
  constraint products_category_length check (char_length(category) between 1 and 80)
);

create table public.addresses (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  recipient_name text not null,
  phone text not null,
  address_line text not null,
  ward text not null,
  district text not null,
  province text not null,
  note text,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint addresses_recipient_name_length check (char_length(recipient_name) between 1 and 120),
  constraint addresses_phone_length check (char_length(phone) between 8 and 30),
  constraint addresses_address_line_length check (char_length(address_line) between 1 and 240),
  constraint addresses_ward_length check (char_length(ward) between 1 and 120),
  constraint addresses_district_length check (char_length(district) between 1 and 120),
  constraint addresses_province_length check (char_length(province) between 1 and 120),
  constraint addresses_note_length check (note is null or char_length(note) <= 500)
);

create unique index addresses_one_default_per_user_idx
  on public.addresses (user_id)
  where is_default;
create index addresses_user_id_idx on public.addresses (user_id);

create table public.orders (
  id bigint generated always as identity primary key,
  order_number text unique,
  user_id uuid not null references auth.users(id) on delete restrict,
  address_id bigint references public.addresses(id) on delete set null,
  status text not null default 'pending',
  total bigint not null check (total >= 0),
  recipient_name text not null,
  phone text not null,
  address_line text not null,
  ward text not null,
  district text not null,
  province text not null,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint orders_status_allowed check (status in ('pending', 'confirmed', 'preparing', 'shipping', 'delivered', 'cancelled'))
);

create index orders_user_id_created_at_idx on public.orders (user_id, created_at desc);
create index orders_address_id_idx on public.orders (address_id);

create table public.order_items (
  id bigint generated always as identity primary key,
  order_id bigint not null references public.orders(id) on delete cascade,
  product_slug text not null references public.products(slug) on delete restrict,
  product_name text not null,
  unit_price bigint not null check (unit_price >= 0),
  quantity integer not null check (quantity between 1 and 99),
  line_total bigint generated always as (unit_price * quantity) stored,
  created_at timestamptz not null default now(),
  constraint order_items_unique_product unique (order_id, product_slug)
);

create index order_items_order_id_idx on public.order_items (order_id);
create index order_items_product_slug_idx on public.order_items (product_slug);

create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function private.set_updated_at();

create trigger products_set_updated_at
before update on public.products
for each row execute function private.set_updated_at();

create trigger addresses_set_updated_at
before update on public.addresses
for each row execute function private.set_updated_at();

create trigger orders_set_updated_at
before update on public.orders
for each row execute function private.set_updated_at();

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (user_id, full_name)
  values (new.id, nullif(trim(coalesce(new.raw_user_meta_data ->> 'full_name', '')), ''))
  on conflict (user_id) do nothing;
  return new;
end;
$$;

create trigger auth_user_created_profile
after insert on auth.users
for each row execute function private.handle_new_user();

create or replace function private.keep_one_default_address()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.is_default then
    update public.addresses
    set is_default = false
    where user_id = new.user_id
      and id is distinct from new.id
      and is_default;
  end if;
  return new;
end;
$$;

create trigger addresses_keep_one_default
before insert or update of is_default on public.addresses
for each row execute function private.keep_one_default_address();

create or replace function public.place_order(p_address_id bigint, p_items jsonb)
returns table(order_id bigint, order_number text)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_address public.addresses%rowtype;
  v_order_id bigint;
  v_order_number text;
  v_total bigint;
begin
  if v_user_id is null then
    raise exception 'Bạn cần đăng nhập để đặt hàng.' using errcode = '42501';
  end if;

  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 or jsonb_array_length(p_items) > 50 then
    raise exception 'Giỏ hàng không hợp lệ.' using errcode = '22023';
  end if;

  select * into v_address
  from public.addresses
  where id = p_address_id and user_id = v_user_id;

  if not found then
    raise exception 'Không tìm thấy địa chỉ giao hàng.' using errcode = '22023';
  end if;

  with requested as (
    select item ->> 'slug' as slug, sum((item ->> 'quantity')::integer)::integer as quantity
    from jsonb_array_elements(p_items) as item
    where jsonb_typeof(item) = 'object'
      and (item ->> 'quantity') ~ '^[0-9]+$'
    group by item ->> 'slug'
  )
  select sum(product.price * requested.quantity)
  into v_total
  from requested
  join public.products as product on product.slug = requested.slug and product.is_active
  where requested.quantity between 1 and 99;

  if v_total is null or (
    select count(*)
    from (
      select item ->> 'slug' as slug
      from jsonb_array_elements(p_items) as item
      group by item ->> 'slug'
    ) submitted
  ) <> (
    select count(*)
    from (
      select item ->> 'slug' as slug, sum((item ->> 'quantity')::integer)::integer as quantity
      from jsonb_array_elements(p_items) as item
      where jsonb_typeof(item) = 'object'
        and (item ->> 'quantity') ~ '^[0-9]+$'
      group by item ->> 'slug'
    ) requested
    join public.products as product on product.slug = requested.slug and product.is_active
    where requested.quantity between 1 and 99
  ) then
    raise exception 'Giỏ hàng chứa sản phẩm hoặc số lượng không hợp lệ.' using errcode = '22023';
  end if;

  insert into public.orders (
    user_id, address_id, total, recipient_name, phone,
    address_line, ward, district, province, note
  ) values (
    v_user_id, v_address.id, v_total, v_address.recipient_name, v_address.phone,
    v_address.address_line, v_address.ward, v_address.district, v_address.province, v_address.note
  ) returning id into v_order_id;

  v_order_number := 'NOR-' || to_char(now() at time zone 'UTC', 'YYYYMMDD') || '-' || lpad(v_order_id::text, 6, '0');
  update public.orders set order_number = v_order_number where id = v_order_id;

  insert into public.order_items (order_id, product_slug, product_name, unit_price, quantity)
  select v_order_id, product.slug, product.name, product.price, requested.quantity
  from (
    select item ->> 'slug' as slug, sum((item ->> 'quantity')::integer)::integer as quantity
    from jsonb_array_elements(p_items) as item
    where jsonb_typeof(item) = 'object'
      and (item ->> 'quantity') ~ '^[0-9]+$'
    group by item ->> 'slug'
  ) requested
  join public.products as product on product.slug = requested.slug and product.is_active
  where requested.quantity between 1 and 99;

  return query select v_order_id, v_order_number;
end;
$$;

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.addresses enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

create policy profiles_select_own on public.profiles
for select to authenticated using ((select auth.uid()) = user_id);
create policy profiles_update_own on public.profiles
for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy products_read_active on public.products
for select to anon, authenticated using (is_active);

create policy addresses_select_own on public.addresses
for select to authenticated using ((select auth.uid()) = user_id);
create policy addresses_insert_own on public.addresses
for insert to authenticated with check ((select auth.uid()) = user_id);
create policy addresses_update_own on public.addresses
for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
create policy addresses_delete_own on public.addresses
for delete to authenticated using ((select auth.uid()) = user_id);

create policy orders_select_own on public.orders
for select to authenticated using ((select auth.uid()) = user_id);
create policy order_items_select_own on public.order_items
for select to authenticated using (
  exists (
    select 1 from public.orders
    where orders.id = order_items.order_id
      and orders.user_id = (select auth.uid())
  )
);

revoke all on public.profiles, public.products, public.addresses, public.orders, public.order_items from anon, authenticated;
grant select on public.products to anon, authenticated;
grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.addresses to authenticated;
grant select on public.orders, public.order_items to authenticated;
grant usage, select on sequence public.addresses_id_seq to authenticated;

revoke all on function public.place_order(bigint, jsonb) from public, anon;
grant execute on function public.place_order(bigint, jsonb) to authenticated;
revoke all on all functions in schema private from public, anon, authenticated;

insert into public.products (slug, name, category, price) values
  ('esp32-development-board', 'ESP32 Development Board', 'board', 189000),
  ('bme280-environment-sensor', 'BME280 Environment Sensor', 'sensor', 80000),
  ('usb-c-power-module', 'USB-C Power Module', 'module', 120000),
  ('precision-screwdriver-set', 'Precision Screwdriver Set', 'accessories', 265000),
  ('rp2040-microcontroller', 'RP2040 Microcontroller', 'board', 145000),
  ('oled-display-128x64', 'OLED Display 128×64', 'display', 95000),
  ('jumper-wire-kit', 'Jumper Wire Kit', 'accessories', 55000),
  ('logic-level-converter', 'Logic Level Converter', 'module', 65000);

create table public.categories (
  slug text primary key check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null check (char_length(name) between 1 and 80),
  sort_order integer not null default 0
);

alter table public.profiles
  add column customer_attributes jsonb not null default '{}'::jsonb
    check (jsonb_typeof(customer_attributes) = 'object');
revoke update on public.profiles from authenticated;
grant update (full_name, phone) on public.profiles to authenticated;

insert into public.categories (slug, name, sort_order) values
  ('board', 'Board', 10),
  ('sensor', 'Cảm biến', 20),
  ('module', 'Module', 30),
  ('display', 'Hiển thị', 40),
  ('accessories', 'Phụ kiện', 50);

alter table public.categories enable row level security;
revoke all on public.categories from anon, authenticated;
grant select on public.categories to anon, authenticated;
create policy categories_read on public.categories for select to anon, authenticated using (true);

alter table public.products
  add column short_name text,
  add column description text not null default '',
  add column stock integer check (stock >= 0),
  add column art text not null default 'module' check (art in ('board', 'sensor', 'power', 'tools', 'module', 'display')),
  add column accent text not null default '#c8a96b' check (accent ~ '^#[0-9a-fA-F]{6}$'),
  add column specs jsonb not null default '[]'::jsonb check (jsonb_typeof(specs) = 'array'),
  add column images text[] not null default '{}';

alter table public.products
  add constraint products_price_limit check (price <= 1000000000000),
  add constraint products_stock_limit check (stock <= 1000000000);

alter table public.order_items
  add column stock_reserved boolean not null default false;

-- Existing stock is unknown. New products start at zero until an admin enters stock.
alter table public.products alter column stock set default 0;
update public.products set short_name = 'ESP32', description = 'Bo mạch phát triển ESP32 hỗ trợ Wi-Fi và Bluetooth, phù hợp cho các dự án kết nối.', art = 'board', accent = '#d6b675', specs = '[{"label":"Model","value":"ESP32-WROOM-32"},{"label":"Điện áp","value":"3.3V"},{"label":"Flash","value":"4MB"},{"label":"Wi-Fi","value":"Có"},{"label":"Bluetooth","value":"Có"}]'::jsonb where slug = 'esp32-development-board';
update public.products set short_name = 'BME280', description = 'Cảm biến khí quyển chính xác để đo nhiệt độ, độ ẩm và áp suất trong cùng một module.', art = 'sensor', accent = '#9db7a6', specs = '[{"label":"Model","value":"BME280"},{"label":"Giao tiếp","value":"I²C / SPI"},{"label":"Độ ẩm","value":"0–100% RH"},{"label":"Nhiệt độ","value":"-40–85°C"},{"label":"Điện áp","value":"1.8–3.6V"}]'::jsonb where slug = 'bme280-environment-sensor';
update public.products set short_name = 'USB-C POWER', description = 'Nguồn USB-C gọn gàng cho các mạch cần một điểm cấp điện ổn định và dễ tiếp cận.', art = 'power', accent = '#bb9f7b', specs = '[{"label":"Input","value":"USB-C 5V"},{"label":"Output","value":"5V / 3A"},{"label":"Bảo vệ","value":"OVP / OCP"},{"label":"Đèn báo","value":"LED xanh"},{"label":"Kích thước","value":"22 × 18mm"}]'::jsonb where slug = 'usb-c-power-module';
update public.products set short_name = 'PRECISION SET', description = 'Bộ tua vít chính xác gồm 24 mũi cho lắp ráp và sửa chữa thiết bị điện tử.', art = 'tools', accent = '#c8a96b', specs = '[{"label":"Số đầu","value":"24 mũi"},{"label":"Chuôi","value":"Nhôm anodized"},{"label":"Đầu vít","value":"S2 steel"},{"label":"Case","value":"Nam châm"},{"label":"Trọng lượng","value":"280g"}]'::jsonb where slug = 'precision-screwdriver-set';
update public.products set short_name = 'RP2040', description = 'Vi điều khiển hai nhân mạnh mẽ cho các project cần nhiều GPIO và phản hồi nhanh.', art = 'module', accent = '#a7b2c3', specs = '[{"label":"CPU","value":"Dual-core ARM Cortex-M0+"},{"label":"Tốc độ","value":"133 MHz"},{"label":"RAM","value":"264KB SRAM"},{"label":"GPIO","value":"30 pins"},{"label":"Logic","value":"3.3V"}]'::jsonb where slug = 'rp2040-microcontroller';
update public.products set short_name = 'OLED 128×64', description = 'Màn hình OLED đơn sắc, tương phản cao cho các thiết bị nhỏ và giao diện thông tin tối giản.', art = 'display', accent = '#9db7a6', specs = '[{"label":"Độ phân giải","value":"128 × 64 px"},{"label":"Giao tiếp","value":"I²C"},{"label":"Kích thước","value":"0.96 inch"},{"label":"Màu","value":"Trắng đơn sắc"},{"label":"Điện áp","value":"3.3–5V"}]'::jsonb where slug = 'oled-display-128x64';
update public.products set short_name = 'JUMPER KIT', description = 'Bộ dây nối nhiều màu, nhiều chuẩn pin để đi dây nhanh trong quá trình prototyping.', art = 'tools', accent = '#b9a1b8', specs = '[{"label":"Số lượng","value":"120 dây"},{"label":"Đầu nối","value":"M–M / M–F / F–F"},{"label":"Chiều dài","value":"20cm"},{"label":"Bước pin","value":"2.54mm"},{"label":"Vỏ","value":"PVC mềm"}]'::jsonb where slug = 'jumper-wire-kit';
update public.products set short_name = 'LEVEL SHIFT', description = 'Chuyển đổi mức logic hai chiều giữa các mạch 3.3V và 5V.', art = 'module', accent = '#c7a47e', specs = '[{"label":"Kênh","value":"4 kênh hai chiều"},{"label":"Mức thấp","value":"1.8–3.3V"},{"label":"Mức cao","value":"3.3–5V"},{"label":"Tốc độ","value":"≤ 2MHz"},{"label":"Kiểu","value":"BSS138"}]'::jsonb where slug = 'logic-level-converter';

alter table public.products
  add constraint products_category_fk foreign key (category) references public.categories(slug) on update cascade on delete restrict;
create index products_category_active_idx on public.products (category, is_active);

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Product image uploads use the server-only admin client; public access is read-only.

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
  v_line record;
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

  -- Lock each product row in slug order and reserve stock atomically.
  for v_line in
    select item ->> 'slug' as slug, sum((item ->> 'quantity')::integer)::integer as quantity
    from jsonb_array_elements(p_items) as item
    group by item ->> 'slug'
    order by slug
  loop
    update public.products
    set stock = stock - v_line.quantity
    where slug = v_line.slug and is_active and (stock is null or stock >= v_line.quantity);
    if not found then
      raise exception 'Sản phẩm đã hết hàng hoặc không đủ số lượng.' using errcode = '22023';
    end if;
  end loop;

  insert into public.orders (
    user_id, address_id, total, recipient_name, phone,
    address_line, ward, district, province, note
  ) values (
    v_user_id, v_address.id, v_total, v_address.recipient_name, v_address.phone,
    v_address.address_line, v_address.ward, v_address.district, v_address.province, v_address.note
  ) returning id into v_order_id;

  v_order_number := 'XQ-' || to_char(now() at time zone 'UTC', 'YYYYMMDD') || '-' || lpad(v_order_id::text, 6, '0');
  update public.orders set order_number = v_order_number where id = v_order_id;

  insert into public.order_items (order_id, product_slug, product_name, unit_price, quantity, stock_reserved)
  select v_order_id, product.slug, product.name, product.price, requested.quantity, product.stock is not null
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

revoke all on function public.place_order(bigint, jsonb) from public, anon;
grant execute on function public.place_order(bigint, jsonb) to authenticated;

create or replace function public.admin_update_order_status(p_order_id bigint, p_status text)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_previous text;
  v_line record;
begin
  if p_status not in ('pending', 'confirmed', 'preparing', 'shipping', 'delivered', 'cancelled') then
    raise exception 'Trạng thái đơn hàng không hợp lệ.' using errcode = '22023';
  end if;
  select status into v_previous from public.orders where id = p_order_id for update;
  if not found then
    raise exception 'Không tìm thấy đơn hàng.' using errcode = '22023';
  end if;
  if v_previous = p_status then return; end if;

  if v_previous <> 'cancelled' and p_status = 'cancelled' then
    for v_line in select product_slug, quantity from public.order_items where order_id = p_order_id and stock_reserved order by product_slug loop
      update public.products set stock = stock + v_line.quantity where slug = v_line.product_slug;
    end loop;
  elsif v_previous = 'cancelled' and p_status <> 'cancelled' then
    for v_line in select product_slug, quantity from public.order_items where order_id = p_order_id and stock_reserved order by product_slug loop
      update public.products set stock = stock - v_line.quantity where slug = v_line.product_slug and (stock is null or stock >= v_line.quantity);
      if not found then
        raise exception 'Không đủ hàng để mở lại đơn.' using errcode = '22023';
      end if;
    end loop;
  end if;

  update public.orders set status = p_status where id = p_order_id;
end;
$$;

revoke all on function public.admin_update_order_status(bigint, text) from public, anon, authenticated;
grant execute on function public.admin_update_order_status(bigint, text) to service_role;

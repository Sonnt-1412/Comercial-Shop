-- New orders use the Xuanquy prefix; existing order numbers remain unchanged.
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

  v_order_number := 'XQ-' || to_char(now() at time zone 'UTC', 'YYYYMMDD') || '-' || lpad(v_order_id::text, 6, '0');
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

revoke all on function public.place_order(bigint, jsonb) from public, anon;
grant execute on function public.place_order(bigint, jsonb) to authenticated;

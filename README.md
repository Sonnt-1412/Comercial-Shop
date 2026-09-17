# Xuanquy

Vietnamese hardware and electronics storefront built with Next.js 16, React 19, Tailwind CSS 4, and Supabase.

## Local setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local` and add the Supabase project URL and publishable key.
3. Run `npm run dev` and open `http://localhost:3000`.

Never place a Supabase secret or service-role key in a `NEXT_PUBLIC_*` variable.

## Validation

```bash
npm run lint
npm test
npm run build
```

Run all checks together with `npm run check`.

## Supabase

Database migrations are stored under `supabase/migrations/`. Phase 2 uses Supabase Auth for email/password accounts and Postgres for profiles, addresses, products, orders, and order items. All customer-owned records are protected with Row Level Security.

Google and Facebook authentication are deferred to Phase 3 because they require external OAuth application credentials.

## Admin setup

The admin interface is at `/admin`. Apply the migrations in `supabase/migrations/` before using it. Set `SUPABASE_SECRET_KEY` to a server-only Supabase secret key (or `SUPABASE_SERVICE_ROLE_KEY` for a legacy project), and set `ADMIN_USER_IDS` to the comma-separated Supabase Auth UUIDs of trusted administrators. Create the admin account through normal registration first, then copy its user ID from Supabase Auth. Do not prefix either variable with `NEXT_PUBLIC_`.

Admins can manage products, stock, images, categories, order status, customer email, password, profile fields, custom JSON attributes, and delivery addresses. Product image uploads use the public `product-images` bucket created by the Phase 3 migration. Customer passwords are only replaced when a new value is entered. Existing order numbers and order snapshots are retained.

An admin can attach up to six images per product. Each save can send up to 4 MB of images; save again to add more images.

Existing products have unknown stock after migration; the admin list shows “Chưa nhập” until a real quantity is saved. New products start with stock 0. Cancelling an order restores tracked stock, and reopening it checks stock again.

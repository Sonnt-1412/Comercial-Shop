# NØR/SHOP

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

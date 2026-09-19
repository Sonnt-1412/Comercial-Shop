# Admin verification — 2026-09-19

The admin update was verified with `npm run check` (ESLint, 24 Vitest tests, and a production build), plus browser automation against a local production server connected to the configured Supabase project.

Browser tests used temporary admin/customer accounts and a separate local admin allowlist. They did not modify existing customer accounts, products, or orders. All temporary accounts, profiles, addresses, products, categories, orders and uploaded images were removed and cleanup was verified. The deployed website has not been updated by this work.

## Browser scenarios passed

- Anonymous requests to the notifications API return 401; logged-in customers receive 403 and cannot access admin pages.
- Admin login opens the dashboard; storefront navigation exposes the admin entry. Explicit checkout destinations remain intact.
- Create and rename categories; duplicate-code feedback preserves entered values.
- Category product counts include hidden products; deleting a nonempty category is disabled. An empty category can be deleted.
- Create a hidden product with an uploaded image and specification rows; edit its details/specifications; remove its image.
- Search products and switch their visibility.
- A concurrent stock change blocks a stale product edit and preserves the form.
- Deleting a product referenced by an order archives it. Deleting an unreferenced product removes it.
- Search customers by email; update contact details and customer notes.
- Add a default address, edit it, and delete it without changing the order's delivery snapshot.
- A newly inserted test order appears in the pending inbox and triggers the in-app new-order notice.
- Search orders and update their status through confirmation, preparation, shipping and delivery.
- Cancelling an order returns reserved stock once; repeating cancellation does not increase stock again. Reopening reserves stock again.
- Insufficient stock prevents reopening and leaves the order cancelled, with a recoverable message.
- Oversized images are rejected before upload without clearing the form.
- Dashboard, product/category/order/customer lists and detail pages fit a 390 px mobile viewport.
- No browser runtime errors were recorded in the main interaction run.

## Boundaries

Notifications refresh every 30 seconds while the admin tab is visible and on focus/navigation. They are in-app notifications, not email or background push notifications. Validation and service failures intentionally show recovery messages; no application can guarantee every external request succeeds.

The update requires the existing Phase 3 migration and existing server-side environment variables. It adds no schema migration. Vercel still needs a new deployment to use the updated code.

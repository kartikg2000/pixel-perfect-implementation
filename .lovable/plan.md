# Save orders in a real database + secure admin portal

Right now every order lives only in the browser of the person who placed it, and the admin portal uses a shared password typed into the code. This turns on Lovable Cloud so orders are stored for real and only you can see them.

## What changes for customers

Nothing visible. They fill the same order window. On the final step the order is saved to the database and they see a confirmation with their order number. If saving fails, they get a clear message and the WhatsApp option, never a fake success.

## What changes for you (admin)

- Sign in at `/admin` with your own email and password instead of a shared password.
- The dashboard shows real orders from the database, from any device, not just this browser.
- Same stats, filters, search, status dropdown and delete — now saving to the database.
- Only approved admin accounts can see orders; a signed-up stranger sees nothing.

## Setup you will need to do once

1. Turn on Lovable Cloud (I do this).
2. Create your admin account on the sign-in page.
3. Tell me the email you used so I can mark it as admin (first account can be promoted automatically if you prefer).

## What else could go in the database later

Answered: nothing else for now. Good candidates when you want them: menu items and prices editable from the portal, delivery PIN codes and fees, WhatsApp/contact enquiries, and a customer-facing "track my order" page.

## Technical outline

- Enable Lovable Cloud; enable email/password auth.
- Migration:
  - `app_role` enum + `user_roles` table + `has_role()` security-definer function (roles never on a profile table).
  - `orders` table: id (text order code), items (jsonb), customer fields, delivery_date, subtotal, discount, delivery_fee, total, status (enum matching current `OrderStatus`), created_at, updated_at.
  - GRANTs: `INSERT` to `anon` + `authenticated` (guest checkout), `SELECT/UPDATE/DELETE` to `authenticated`; `ALL` to `service_role`.
  - RLS: insert-only policy for public; select/update/delete gated on `has_role(auth.uid(),'admin')`. No public read of customer data.
- Server functions in `src/lib/orders.functions.ts`:
  - `createOrder` — public, Zod-validated, recomputes totals server-side from the menu data so prices cannot be tampered with.
  - `listOrders`, `setOrderStatus`, `removeOrder` — `requireSupabaseAuth` + admin role check.
- `src/lib/admin-store.ts`: drop localStorage order + auth helpers, keep `OrderStatus`, `ORDER_STATUS_CONFIG`, types, `generateOrderId`.
- `/admin` becomes a Supabase email/password sign-in page (same visual design); dashboard moves under the managed `_authenticated` layout and loads orders via TanStack Query, with an "admin access required" state for non-admin accounts.
- Checkout review step in `src/routes/index.tsx` calls `createOrder`, shows pending/error states and an order-number confirmation.

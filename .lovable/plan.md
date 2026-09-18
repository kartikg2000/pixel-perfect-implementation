# Make orders work on the Vercel site

## What's happening

On the Vercel copy of the site, the pages load and admin login works, but placing an order and loading the orders list fail silently.

Login works because the sign-in screen talks to the database straight from the browser using settings baked into the page at build time. Saving an order and listing orders happen on the server side, and the server on Vercel has none of the database settings. Every server request there fails, so:

- "Place order" errors out
- The admin dashboard shows no orders

The Lovable-hosted site works because Lovable supplies those settings to its own server automatically.

## Fix

### 1. Add the database settings to Vercel

In the Vercel project, under Settings > Environment Variables, add these three for Production, Preview and Development, then redeploy:

- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_PROJECT_ID`

The values are the same ones already in the project's `.env` file. I'll give you the exact values to paste in once you approve.

### 2. Build the server for Vercel

The project currently builds its server for Cloudflare, not Vercel. I'll add a Vercel build target to `vite.config.ts` so the server side (order saving, orders list) is packaged in the format Vercel runs. This is a one-line config addition and does not change how the Lovable-hosted site behaves.

### 3. Verify after redeploy

Once the settings are in and the redeploy finishes, I'll walk through the checks with you: place a test order on the Vercel URL, confirm it appears in the admin dashboard, then delete the test order.

## Note on which site to treat as live

Both sites talk to the same database, so orders placed on either appear in both dashboards. Worth deciding which URL you hand to customers, so you're not maintaining two.

## Technical detail

- Server-side code reads `process.env['SUPABASE_URL']` / `SUPABASE_PUBLISHABLE_KEY` (`src/lib/orders.functions.ts`, `src/integrations/supabase/auth-middleware.ts`). Vercel does not read the committed `.env` at runtime, hence 500s on every `createServerFn` call.
- Client code uses `import.meta.env.VITE_*`, inlined at build time from the committed `.env` — this is why auth still works.
- `vite.config.ts` uses `@lovable.dev/vite-tanstack-config`, whose nitro build defaults to the `cloudflare` preset. Add a Vercel preset (via `NITRO_PRESET=vercel` in Vercel env, or explicit nitro config) so the SSR/server-function output matches Vercel's runtime.
- Do not add `SUPABASE_SERVICE_ROLE_KEY` to Vercel; nothing in the app needs it, and it isn't available on Lovable Cloud.

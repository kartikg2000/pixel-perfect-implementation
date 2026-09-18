DROP POLICY IF EXISTS "Anyone can place an order" ON public.orders;
REVOKE INSERT ON public.orders FROM anon;
REVOKE INSERT ON public.orders FROM authenticated;
REVOKE SELECT, UPDATE, DELETE ON public.orders FROM anon;
GRANT ALL ON public.orders TO service_role;
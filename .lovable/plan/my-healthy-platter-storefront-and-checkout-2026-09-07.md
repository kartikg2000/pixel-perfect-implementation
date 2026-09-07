# My Healthy Platter storefront and checkout

## Goal

Turn the blank home page into a premium, mobile-first food ecommerce experience for My Healthy Platter. The first screen will sell fresh breakfast clearly, make one-time ordering feel safe, recommend the 6-day routine without forcing it, and let a customer reach a complete order review in one continuous flow.

## Customer experience

1. Replace the placeholder home page with a focused storefront:
   - restrained deep-green, fresh-green, warm-cream, white, and natural food-color system
   - brand-led header with Menu, How It Works, FAQ, WhatsApp, and Order Now
   - food-first hero using the supplied real logo/product imagery when provided
   - “Breakfast, Sorted.” messaging, operational trust points, and editable-looking launch offer presentation without fabricated claims
   - short try-once reassurance directly below the hero
2. Add the four product choices with image, description, ingredients, portion, price, “Add to order”, and “Make it a plan” actions.
3. Add the plan selector with one-time, 6-day, and 26-day choices. The 6-day option is selected by default and visually recommended; the other choices remain equally accessible. Prices will come from the user-provided values, with calculations for per-delivery price and savings and no invented numbers.
4. Add concise Why Plans, How It Works, delivery/freshness, FAQ, and final CTA sections. Do not show fake reviews, statistics, certifications, awards, or unsupported health claims.
5. Make WhatsApp and phone actions functional with contextual prefilled messages using 9780035199.
6. Add the mobile sticky purchase bar without obscuring page content.

## Continuous checkout

Create a clean drawer or modal that opens from product and plan actions rather than sending the customer through separate cart/account pages:

```text
Breakfast → Delivery → Review
products + routine → date + essential details → complete cost + next action
```

- Step 1: choose one or more enabled breakfast products.
- Step 2: choose one-time, 6-day, or 26-day routine, preserving the selected plan.
- Step 3: choose the first delivery date.
- Step 4: collect only name, mobile/WhatsApp, address, area/PIN, landmark, and delivery window.
- Step 5: show products, plan, delivery count, price, discount, delivery fee, and total.
- Make the 10% launch offer visibly configurable in the data model but do not hard-code an expiry date.
- End at a truthful review state with a clear note that payment is not connected yet; do not simulate payment success.
- Guest checkout is the default; no account creation is added in this milestone.

## Technical implementation

- Keep the existing TanStack Start routing and use `/` as the storefront.
- Add focused local customer-facing components and typed product/plan/config data so later Cloud persistence and admin editing can replace the data source without redesigning the checkout.
- Use the existing design-system components for buttons, dialogs/drawers, inputs, radio/select controls, and notifications.
- Add route-level metadata for the storefront and remove the placeholder/root “Lovable App” metadata.
- Use semantic sections, a single H1, accessible labels, real alt text, lazy loading below the fold, reduced-motion-safe transitions, and responsive layouts with mobile as the priority.
- Keep social proof hidden until real testimonials are supplied.

## Not included in this milestone

- Lovable Cloud/database tables, admin CMS, customer dashboard, delivery operations, delivery-zone management, persisted orders, OTP access, analytics storage, and subscription management.
- Razorpay connection or any fake payment result. The checkout will stop at review and leave a clear integration seam for a later payment milestone.
- Campaign-specific routes and A/B testing controls; the shared checkout model will be structured so those can be added later.

## Required inputs before final storefront polish

- The user’s real logo and product/food photos, since the uploaded brief contains text only.
- Final one-time, 6-day, and 26-day prices, plus any actual delivery fee or area rules that should appear in the review calculation.
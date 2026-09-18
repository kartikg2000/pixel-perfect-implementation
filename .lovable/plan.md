# Menu, pricing and mobile ordering cleanup

## 1. Remove the 10% discount everywhere

- Turn the offer off in the shared settings so no discount is ever applied.
- Remove the discount line from the order review and from the totals shown to customers.
- Remove the "10% OFF TILL 30 SEPTEMBER" badge under the hero (keep the free-delivery message).
- The server-side order calculation stops subtracting any discount, so saved orders and the WhatsApp message show the full amount. Existing saved orders are untouched.

## 2. Delivery time slots: 8:00 AM - 2:00 PM

- Replace the current 7:00-11:00 AM list with 30-minute slots from 8:00 AM to 2:00 PM (8:00-8:30 through 1:30-2:00).
- Update the wording that mentions the old morning window in the checkout step, the validation message, and any banner/FAQ text that quotes delivery timings.

## 3. Portion wording

- Every 500 ml item (fruit bowl, salads, sauté bowl) shows "500 ml (approx. 250 g)".
- Juices keep "300 ml" with no gram figure.
- Combos show the same per-component wording.

## 4. Testimonials

- Remove the area/location line ("Phase 7, Mohali" etc.) from every review card, keeping name, role and quote.

## 5. Mobile: show the menu instead of an empty cart

- On phones, tapping the sticky "Order my breakfast" bar scrolls to the menu so the customer can browse and add items.
- Once something is in the cart, the bar switches to "View my order · total" and still opens the cart.
- Desktop behaviour is unchanged.

## Technical notes

- `src/lib/storefront-data.ts`: `offer.enabled = false`, portion strings, testimonial location field, `DELIVERY_TIME_SLOTS` rebuilt as 8:00 AM-2:00 PM half-hour slots, validation copy updated.
- `src/routes/index.tsx`: drop the offer badge and review discount row, remove `review.location` from the card, change the sticky bar handler to scroll to the menu section when the cart is empty on mobile.
- `src/lib/orders.functions.ts`: discount resolves to 0 via the disabled offer config; no schema change.
- Verify with a mobile-viewport Playwright pass (sticky bar scrolls to menu, add works) plus a desktop checkout run through the new slot list and a discount-free review total.

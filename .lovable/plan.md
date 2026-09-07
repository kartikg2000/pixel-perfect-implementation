# My Healthy Platter visual update before backend

## Goal
Bring the current storefront closer to the supplied My Healthy Platter reference while keeping the existing review-only checkout usable. Use the uploaded reference as the source for the brand mark and food imagery, add realistic proposed INR pricing, and make WhatsApp a clear primary contact action without adding backend or payment dependencies.

## What will change

1. **Use the supplied brand assets**
   - Extract the MHP logo/wordmark from the uploaded reference for the site header instead of the current text-and-placeholder mark.
   - Prepare the four supplied food visuals as separate website images: Cut Fruit Bowl, Sprout Bowl, Detox Juice, and Sauté Veggies.
   - Preserve the reference’s recognizable category color language while keeping text and buttons accessible.
   - Add a matching small favicon derived from the updated brand mark.

2. **Refresh the first screen and product presentation**
   - Make the logo the primary header identity and tighten the header around Menu, How It Works, FAQ, WhatsApp, and Order Now.
   - Replace the current illustrated food placeholders with the actual supplied food pictures.
   - Keep the existing “Breakfast, Sorted.” buying message, but make the imagery and product cards carry more of the reference’s food-first feel.
   - Keep the layout mobile-first and ensure the sticky order bar does not cover content.

3. **Make WhatsApp feel genuine and useful**
   - Add the recognizable WhatsApp icon in the desktop and mobile navigation using an icon asset treatment rather than the generic chat bubble.
   - Keep the contextual prefilled WhatsApp links for support and ordering.
   - Retain the visible phone number `9780035199` where it supports trust and contact.

4. **Add proposed INR launch pricing**
   - Use an editable local data model so the numbers can be replaced later without redesigning checkout.
   - Start with these clearly presented proposed prices:
     - Cut Fruit Bowl: ₹149
     - Sprout Bowl: ₹169
     - Detox Juice: ₹129
     - Sauté Veggies: ₹179
     - One-time breakfast routine: ₹149
     - 6-day plan: ₹799 (about ₹133 per delivery)
     - 26-day plan: ₹3,199 (about ₹123 per delivery)
   - Keep the 10% first-order offer configurable and apply it transparently in the review calculation.
   - Use free delivery in the visible launch presentation only as a proposed launch assumption, with the checkout data left easy to change if delivery zones or fees differ.
   - Do not add an expiry date, fake discount comparison, health claim, review, certification, or performance statistic.

5. **Pre-backend content and UX cleanup**
   - Align the offer and contact sections with the supplied reference without copying unsupported campaign claims as permanent facts.
   - Add a clear “coming soon / ordering availability” state only where it is truthful for the current review-only flow.
   - Check every order path: product add, plan selection, first delivery date, required contact/address details, discount, delivery fee, and final review with payment-not-connected language.
   - Review accessibility basics: image alt text, keyboard focus, readable contrast, tap targets, and reduced-motion behavior.
   - Keep social proof, service-area promises, delivery windows, and payment confirmation out until real business details/backend support exist.

## Before backend: recommended decisions to confirm later

- Final product and plan prices, including whether ₹149 should be the one-time price for every breakfast or only the fruit bowl.
- Delivery area/PIN coverage, delivery fee, and delivery time window.
- Whether “free delivery” is permanent, launch-only, or limited to selected plans/areas.
- Final offer validity and whether the 10% discount applies to one-time orders, plans, or both.
- Final Instagram handle and whether it should be linked from the footer.
- Payment provider and order persistence can be added after the storefront copy and commercial rules are confirmed.

## Technical details

- Keep TanStack Start routing and the `/` storefront.
- Store the extracted image assets through the project asset flow and import their generated asset pointers; do not hotlink the uploaded file.
- Keep the existing typed storefront data and checkout components, changing only the presentation/data values needed for this pass.
- Use existing design-system buttons and controls, semantic HTML, route-level metadata, and the current token-based color system.
- No Lovable Cloud, database, admin dashboard, customer accounts, payment integration, or persisted orders in this milestone.

## Acceptance checks

- The header visibly uses the MHP logo and a recognizable WhatsApp icon.
- All four product cards show actual food images with correct names and INR prices.
- The plan cards show the proposed prices, per-delivery values, and savings without arithmetic errors.
- The 10% offer and delivery assumption are visible but not presented with an invented expiry date.
- The existing checkout reaches a truthful final review state and does not simulate payment success.
- Desktop and mobile views have no clipped images, overlapping text, or hidden purchase controls.

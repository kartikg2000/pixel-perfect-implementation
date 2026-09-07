# Updated menu and visible cart

## Goal
Sync the storefront and “Complete your order” flow with the user’s updated menu, then make every add-to-order action visibly update a right-side cart so customers immediately know what was added.

## Implementation
1. **Read and model the new menu**
   - Use the re-uploaded clear menu image as the source of truth for item names, descriptions, ingredients/portions, prices, and any menu-specific notes.
   - Replace the current placeholder/local product entries with the menu values while preserving typed data so the menu can later move to Cloud without redesigning the page.
   - Keep the existing food images where they match the menu; flag any menu item that needs a new image rather than inventing one.

2. **Add a real cart state**
   - Replace the current selected/not-selected product behavior with cart line items and quantities.
   - “Add to order” will always add or increment the item, show a success confirmation, and open/ reveal the cart on the right on desktop.
   - Add quantity increase/decrease and remove controls in the cart, with item count and subtotal kept in sync.
   - Keep the cart usable on smaller screens as a slide-over panel so it does not cover the page without a clear close control.
   - Keep plan selection separate but synchronized: the selected breakfast items, routine, discounts, delivery fee, and final total will use the same cart data.

3. **Update the page presentation**
   - Make the visible cart entry point part of the navigation with a bag icon, item count, and total.
   - Update product cards and the mobile purchase bar to reflect cart quantities instead of only a binary “Added” state.
   - Keep the existing brand, logo, real food photos, WhatsApp actions, and review-only payment messaging unless the new menu explicitly requires different copy.

4. **Sync “Complete your order”**
   - Step 1 will show the new menu with quantities and editable cart lines rather than a selection checklist.
   - The plan, delivery date, customer details, and review steps will preserve the cart when navigating back and forth.
   - The review will list each cart item and quantity, show the routine, item/plan pricing, offer discount, delivery fee, and total using one shared calculation.
   - Empty-cart states will guide the customer back to the menu and prevent continuing without an item.
   - Keep the final state truthful: review only, no order creation or payment success simulation.

5. **Runtime and accessibility verification**
   - Investigate the reported dynamic-import failure first and make the smallest project-level correction supported by the runtime signal; do not mask it with UI changes.
   - Verify the storefront loads without console/runtime errors, cart add/increment/decrement/remove behavior, desktop right-side cart, mobile cart presentation, checkout synchronization, and final review totals.
   - Check keyboard focus, accessible labels, image alt text, and that the cart/sticky bar does not obscure content.

## Not included

- Lovable Cloud, persisted orders, customer accounts, admin menu editing, payment processing, or delivery-zone validation.
- Guessing menu values from an unreadable/empty upload; implementation will use the clear re-upload as the source of truth.

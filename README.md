# GERPINA Wear — Test Storefront

Next.js storefront for **gerpina-wear.com**.

## Current test behavior

- Bulgarian default + English switch.
- Persistent Women / Men / Kids store scope.
- Inventory imported from the supplied Excel workbook.
- Sold items remain visible as sold out.
- Product variants, colour swatches, cart, favourites and checkout.
- Econt production account may be used for **office/city lookup and safe price calculation/validation**.
- Sender origin is resolved as the official Econt office matching **Полтава №3Ж, Велико Търново**.
- Econt shipments use **Review + Test** fields.
- The checkout automatically calculates delivery; there is no manual calculate button.
- The final test-order button creates a waybill **only in Econt DEMO**. There is no production `mode:create` path in this build.
- Order notification email is sent through Resend when the email ENV variables are configured. A browser preview is also returned after the test order.
- Terms, Privacy, Delivery & Returns, Cookie Policy and Contact pages are included.
- Checkout requires acceptance of Terms and Privacy.

## Vercel Environment Variables

```env
ECONT_ENV=production
ECONT_USERNAME=...
ECONT_PASSWORD=...
ECONT_CD_AGREEMENT=CD270387
ECONT_SENDER_AGENT_NAME=Петър Станиславов Петров

ORDER_TO_EMAIL=psp03101995@gmail.com
ORDER_FROM_EMAIL=orders@gerpina-wear.com
RESEND_API_KEY=...
```

Optional sender-office overrides:

```env
# ECONT_SENDER_OFFICE_CODE=...
# ECONT_SENDER_OFFICE_CITY=Велико Търново
# ECONT_SENDER_OFFICE_SEARCH=Полтава 3Ж
```

## Deployment

Copy the contents of this folder to the root of the GitHub repository connected to Vercel and push. Vercel will detect Next.js automatically.

## Before enabling real orders

The production launch still needs an explicit code change to enable Econt `mode:create` against the production endpoint. Before that switch:

- replace all DEMO/reference prices with verified public pricing;
- complete remaining product photos and actual weights/weight rules;
- review the legal texts for the final operational procedure;
- complete the required Bulgarian e-shop/NRA setup;
- test Resend delivery from the verified domain;
- remove test/safe-mode labels from customer-facing checkout.


## Econt weight workflow

- Checkout and test waybills currently use a provisional 1.00 kg shipment weight.
- The GERPINA sender must verify the physical parcel before handing it to Econt and correct the waybill if the real parcel is heavier than 1.00 kg.
- Exact product weights can later replace the provisional estimate without changing the checkout flow.
- Econt DEMO may not contain the real Poltava 3Zh sender office; the DEMO creator automatically falls back to a staffed test office in Veliko Tarnovo. Production pricing still resolves the real Poltava 3Zh office from Econt's production nomenclature.

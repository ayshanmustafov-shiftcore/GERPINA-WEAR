# GERPINA Wear

Next.js storefront for GERPINA Wear.

## Current build

- Stock List 3 integrated: 160 catalogue entries (Pepe Jeans floral shorts removed after stock confirmation).
- GERPINA selling prices come from the cleaned Stock List 3 workbook.
- Supplied brand/original prices are shown as `Цена на марката`.
- Where the exact kids SKU could not be verified, comparable current Minoti retail examples are shown as `Референтна цена на марката` rather than being presented as GERPINA's previous price.
- Sold/taken items remain visible as sold out and cannot be added to cart.
- Econt production is used for live office/address data and delivery calculation.
- Final waybill creation remains hard-wired to Econt DEMO in this test build.
- Resend test-order email support is included.

## Vercel

The project is designed to deploy directly from the repository root on Vercel.

Environment variables used by the current setup include:

```env
ECONT_ENV=production
ECONT_USERNAME=...
ECONT_PASSWORD=...
ECONT_CD_AGREEMENT=CD270387
ECONT_SENDER_AGENT_NAME=...
ORDER_TO_EMAIL=...
ORDER_FROM_EMAIL=orders@gerpina-wear.com
RESEND_API_KEY=...
```

Do not commit production credentials to Git.

## Safety

This is still a test-order build. `mode: create` exists only in the Econt DEMO module. The production Econt account is not used to create waybills or courier requests.

- 2026-08-22 photo pass: GAP dress, NG ORDER trousers, VILA floral blouse, ONLY floral shorts, Even&Odd skirt, NA-KD blazer and PIECES jacket mapped/refined from supplied photos.

## 2026-08-27 stock + mobile cleanup
- Sold/taken products are archived under `source-material/archived-sold-products.json` and are not rendered on the storefront.
- Cart/favorites are revalidated against the current active catalogue; removed products cannot remain in a stale mobile cart.
- Mobile header now keeps Women / Men / Kids directly accessible and hides the oversized desktop category row.
- Shop filters collapse into a mobile-friendly filter panel.
- Cart layout has been simplified for unique/one-piece stock and narrow screens.
- Homepage Women / Men / Kids are separate swipeable collection slides.
- Existing Levi's photo `IMG-20260809-WA0002.jpg` was confidently linked to `gw-0003`.
- Three image files remain unlinked and are listed in the photo-audit workbook for manual confirmation.

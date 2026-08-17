# GERPINA Wear — Next.js storefront

Next.js storefront for GERPINA Wear, designed for deployment to Vercel.

## Current catalogue

- Bulgarian default language + English switch
- Women / Men / Kids storefront navigation
- ABOUT YOU-inspired ecommerce hierarchy using GERPINA's own branding
- 161 catalogue entries imported from `source-material/GERPINA WEAR Stock list 2.xlsx`
- Selling prices, sizes and availability from the spreadsheet
- Sold/unavailable products remain visible but cannot be added to the cart
- Original retail prices from the spreadsheet where provided
- Temporary estimated original prices where the spreadsheet has none; these are visibly marked `DEMO`
- Automatically calculated discount percentages
- Existing product photos matched only where reasonably identifiable
- GERPINA placeholders for products whose photos have not yet been supplied
- Search plus category, brand, size, colour, availability and kids-gender filters
- Favorites and shopping cart stored in the browser
- Product size selection and per-item stock limit
- Full checkout preview prepared for Econt office/address delivery
- Responsive mobile / desktop design

## Checkout status

The checkout UI is functional for previewing the order flow, but **order submission is intentionally still demo-only**. It does not send email or create an Econt shipment yet.

The final integration points are:

1. Econt office/city data and delivery calculation/API
2. The real order email recipient
3. Order validation/submission in `app/api/order/route.js`

## Important price note

Estimated original prices are only placeholders to preview the discount presentation. Replace every `originalPriceEstimated: true` value before using those discount claims on the final public store.

## Run locally

```bash
npm install
npm run dev
```

## Vercel

Put the contents of this folder in the root of the GitHub repository and connect the repository to Vercel. Vercel should detect Next.js automatically.

## Main inventory file

`data/products.js`

## Econt test integration

The checkout is wired to Econt's SOAP/JSON test API through server-side Next.js API routes.

Implemented in test mode:
- Bulgarian city search from Econt
- Econt office lookup by selected city
- delivery price calculation with `LabelService.createLabel` in `calculate` mode
- checkout validation with `LabelService.createLabel` in `validate` mode
- cash-on-delivery amount in EUR
- delivery to Econt office or typed address

The browser never receives Econt credentials. Calls go through `/api/econt/*` routes on the server.

### Current demo assumptions
- Public Econt demo credentials are used automatically when `ECONT_ENV=test`.
- The sender uses Econt's sample test sender / office 1000 until GERPINA's real e-Econt account is configured.
- Shipment weight is estimated at 0.5 kg per cart item until real weights are added to inventory.
- The receiver pays 100% of the Econt courier fee in the current test calculation.
- The checkout NEVER uses `mode=create`; it cannot create a real waybill or request a courier.

### Production later
Copy `.env.example` values into Vercel Environment Variables, set `ECONT_ENV=production`, and add GERPINA's e-Econt credentials + real sender details. Before enabling real orders, review shipment weight, COD agreement, review/test service, delivery payer rules and order email handling.

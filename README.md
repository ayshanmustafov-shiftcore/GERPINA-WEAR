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

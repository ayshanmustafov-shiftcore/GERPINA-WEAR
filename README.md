# GERPINA Wear — storefront base

A responsive Next.js App Router storefront base for GERPINA Wear.

## What is already built

- White / black / gold GERPINA visual system
- Bulgarian-first interface with BG / EN switch
- Responsive desktop and mobile navigation
- Home page with hero, category cards, discount story, catalogue preview and brand benefits
- Shop catalogue layout and filters (disabled until inventory arrives)
- Women / Kids / Men category shells
- About page
- Cart shell
- Checkout preview (order submission intentionally disabled)
- Contact page placeholder (no fake contact data)
- Delivery & returns, Terms and Privacy layout drafts
- Product data model prepared for Excel import
- EUR pricing and automatic discount-percentage utility
- Source logo and selected product photos included under `/public`

## Intentionally not active yet

- Real stock/product names/prices/sizes/colours/quantities
- Contact information
- Email order submission
- Econt office/address automation
- Legal/business identity fields

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Build

```bash
npm run build
npm start
```

## When the inventory Excel arrives

The intended import fields are:

- Product name
- Audience (Women / Kids / Men)
- Category
- Brand
- Original/tag price EUR
- GERPINA price EUR
- EU size
- Letter size, when reliable
- Colour
- Quantity
- Description
- SKU
- Image filename(s)
- Notes

Use one row per variant. Variants with the same product can be merged into one product page.

Discount % is generated automatically from `originalPrice` and `price`; do not store a manually calculated percentage.

## Order integration later

The checkout is currently informational. `.env.example` contains placeholders for order-email settings. Once the exact Econt/payment process and recipient email are confirmed, add the order API/email provider and enable checkout.

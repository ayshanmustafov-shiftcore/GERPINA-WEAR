# GERPINA Wear — storefront preview

Next.js storefront for GERPINA Wear, designed for deployment to Vercel.

## Current preview

- Bulgarian default language + English switch
- Women / Men / Kids storefront navigation
- ABOUT YOU-inspired ecommerce structure using GERPINA's own branding
- 22 supplied clothing photos loaded as temporary products
- Temporary selling price: **€10.00 for every product**
- Demo original retail prices + automatically calculated discount percentages
- Temporary descriptive product names based on the photos
- Search
- Category filters
- Sorting
- Product detail pages
- Favorites stored in the browser
- Shopping cart stored in the browser
- Larger text for important shop/filter/product/cart controls
- Quantity controls with unit price + line total in the cart
- Full demo checkout UI
- Econt office/address delivery choice prepared for a future API integration
- Cash-on-delivery payment presentation
- Responsive mobile / desktop design

## Checkout status

The checkout page is visually functional and can be tested, but **order submission is intentionally kept in demo mode**. It does not send emails or create Econt shipments yet.

When the final ordering process is known, the integration points can be connected to:

1. Econt office/city data and shipping calculations/API
2. The real order email recipient
3. Order validation and submission in `app/api/order/route.js`

## Important temporary data

The current catalogue is for visual review only. Product names, audience/category assignments, sizes, quantities, brands, original prices and selling prices must be replaced with the final Excel inventory.

The current `originalPrice` values are **demo values only**. `getDiscountPercent()` in `data/products.js` automatically calculates the displayed discount percentage.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Vercel

Put the contents of this folder in the root of the GitHub repository and connect that repository to Vercel. Vercel should detect Next.js automatically.

## Main inventory file

`data/products.js`

The product model can later be extended with real sizes, colour variants and quantities without redesigning the storefront.

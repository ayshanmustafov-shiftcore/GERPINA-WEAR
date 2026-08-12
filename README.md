# GERPINA Wear — storefront preview

Next.js storefront for GERPINA Wear, designed for deployment to Vercel.

## Current preview

- Bulgarian default language + English switch
- Women / Men / Kids storefront navigation
- ABOUT YOU-inspired ecommerce structure using GERPINA's own branding
- 22 supplied clothing photos loaded as temporary products
- Temporary price: **€10.00 for every product**
- Temporary descriptive product names based on the photos
- Search
- Category filters
- Sorting
- Product detail pages
- Favorites stored in the browser
- Shopping cart stored in the browser
- Responsive mobile / desktop design
- Econt delivery messaging
- Contact, checkout, legal delivery details remain intentionally unfinished

## Important temporary data

The current catalogue is for visual review only. Product names, audience/category assignments, sizes, quantities, brands, original prices and selling prices must be replaced with the final Excel inventory.

When original/tag prices are available, `getDiscountPercent()` in `data/products.js` automatically calculates the displayed discount percentage.

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

Each product currently follows this shape:

```js
{
  id: 'gw-0000',
  slug: '...',
  audience: 'women',
  category: 'dresses',
  name: { bg: '...', en: '...' },
  description: { bg: '...', en: '...' },
  price: 10,
  originalPrice: null,
  image: '/images/products/...jpg',
  colour: { bg: '...', en: '...' },
  inStock: true,
}
```

Once the Excel file arrives this can be extended with real sizes, colour variants and quantities without redesigning the storefront.

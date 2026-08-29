# Build notes — stock update 29 August 2026

## Catalogue

- 161 active product cards.
- 64 products currently have a linked image.
- 97 active products still have no linked image.
- 22 product cards were added from the new kids-stock sheet (23 sheet rows; the same Bonprix dress + bolero model was consolidated into one card with two sizes).
- Sold/taken products remain outside the public catalogue.

## Variant inventory

The catalogue now supports per-size quantity. A new-stock size separated with `+` is stored as a separate selectable size with provisional quantity 1. This makes later physical stock counts easy to update without duplicating product cards.

`gw-0168` (Bonprix boys jeans) is the only new variant currently set to quantity 2 because the source explicitly says `2 чифта`.

Cart validation and Econt server-side order validation use the selected-size quantity, so a customer cannot add more units than are recorded for that variant.

## Photo corrections from numbered audit files

The numbered files were used to correct/link the corresponding audited garments. Audit references 11 and 51 are intentionally left unresolved. `2.jpeg` was mapped by visible Marc O'Polo Denim branding rather than its numeric filename.

## Storefront behaviour

- When a product has no remaining available sizes, it is excluded from shop grids/product lookup rather than displayed as `Изчерпан`.
- Individual unavailable sizes are hidden instead of rendered as sold-out buttons.
- Shop filters/counts, home sections, favorites and Women/Men/Kids collection slides use only available stock.
- Existing mobile navigation/cart/filter cleanup and separate Women/Men/Kids slides are retained.

## Econt

No production-switch change was made. Econt remains in the existing safe/test architecture: real account data/quotes where configured, but test order creation remains isolated from live production waybill creation.

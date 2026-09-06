# GERPINA Wear

Next.js storefront for GERPINA Wear, Bulgaria.

## Current order flow

- Product, size and quantity inventory is validated server-side before an order is created.
- Econt production API is used for cities, offices, delivery calculation, validation and waybill creation.
- Real waybill creation is protected by `ECONT_CREATE_ENABLED`.
- Cash on delivery is configured through the authenticated GERPINA Econt company profile and the configured COD agreement.
- Printed shipment description is intentionally generic: `Дрехи`.
- Exact product, size and quantity details are kept in the digital packing list and the internal GERPINA order email.
- The receiver pays the courier charge.
- `Преглед и тест` is enabled where accepted by Econt.
- No courier pickup is requested by the website; parcels are dropped off at the configured sender office.
- Provisional waybill weight is 1 kg. The sender must verify and correct the physical parcel weight before handoff when needed.

## Production safety gate

Set `ECONT_CREATE_ENABLED=false` while reviewing the site. Econt prices and office/address validation can still be used, but the checkout cannot create a real shipment.

For a controlled real production validation, set `ECONT_CREATE_ENABLED=true`, deploy, place one controlled order, verify the waybill in e-Econt and the internal order email, then decide whether to leave ordering enabled.

## Required environment variables

See `.env.example`. Never commit API passwords or email API keys.

## Important inventory note

The product catalogue is file-based. A successfully created shipment does not automatically write stock back to a database. Before opening the store to normal traffic, either keep manual stock updates very tight or add persistent order/inventory storage to prevent two customers ordering the same one-off item at nearly the same time.

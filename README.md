# GERPINA Wear

Next.js storefront for GERPINA Wear with Bulgarian/English UI, catalogue/cart, persistent Women/Men/Kids scope and Econt checkout integration.

## Econt: production-connected SAFE build

This version can connect to GERPINA's real e-Econt account, but it is intentionally incapable of creating a real waybill.

### What it can do

- authenticate to Econt server-side with Vercel Environment Variables;
- load the authenticated Econt client profile through `ProfileService.getClientProfiles`;
- use the GERPINA company profile together with the configured dispatch address at ул. Полтава №3Ж for price calculation and validation;
- load real Bulgarian cities and Econt offices;
- use the account's existing COD payout configuration returned by Econt;
- calculate a real delivery price with `mode: calculate`;
- validate the shipment data with `mode: validate`;
- submit the cart as a digital packing list for future item-level sales/receipt handling.

### What it cannot do

- there is no `mode: create` call in the project;
- there is no API route for creating a waybill;
- there is no courier-request endpoint;
- the final checkout button only validates data.

Econt's official SOAP/JSON API supports `calculate`, `validate` and `create`. This build only implements the first two.

## Vercel Environment Variables

For the real account, add these to **Production** in Vercel:

```env
ECONT_ENV=production
ECONT_USERNAME=YOUR_E_ECONT_USERNAME
ECONT_PASSWORD=YOUR_E_ECONT_PASSWORD
ECONT_CD_AGREEMENT=CD270387

ECONT_SENDER_CITY=Велико Търново
ECONT_SENDER_QUARTER=Кольо Фичето
ECONT_SENDER_STREET=Полтава
ECONT_SENDER_STREET_NUM=3Ж
ECONT_SENDER_AGENT_NAME=Петър Станиславов Петров
```

Do not commit the username/password to GitHub.

Optional settings:

```env
# Only if Econt confirms the exact SOAP/JSON COD template name:
ECONT_CD_PAY_TEMPLATE=

# Only if the login later returns more than one Econt client profile:
ECONT_PROFILE_CLIENT_NUMBER=

# Use this only if GERPINA later hands parcels in at one fixed Econt office.
# Leave blank while parcels are dispatched from the street address above.
ECONT_SENDER_OFFICE_CODE=

# Optional if you want to pin the sender city by postcode as well.
ECONT_SENDER_POSTCODE=
```

### COD agreement note

The GERPINA agreement number is `CD270387`. In Econt's SOAP/JSON API, COD payout is represented by `cdPayOptionsTemplate` or `cdPayOptions`, not by the XML-only `cd_agreement_num` field. This safe build therefore retrieves GERPINA's existing COD payout options from the authenticated account and uses them server-to-server. `ECONT_CD_AGREEMENT` is retained as the known agreement reference and as a selector if Econt returns multiple identifiable COD options.

Before enabling real waybill creation in a later build, verify the exact COD template/option returned by the production account and confirm the sender location.

## First production-safe test after deployment

1. Deploy with the four production variables above.
2. Open checkout with an item in the cart.
3. The badge should read **ECONT · LIVE SAFE**.
4. Enter customer name and phone.
5. Search a Bulgarian city and select an Econt office/address.
6. Wait for the delivery price to appear automatically.
7. Click **Validate order with Econt**.
8. A successful result confirms the real account/profile/COD/sender-address setup without creating a shipment.

If the live account is not ready, the final validation button stays disabled and the checkout displays the server-side configuration error without exposing credentials or bank details.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Inventory

The current catalogue is generated from `source-material/GERPINA WEAR Stock list 2.xlsx`. Product data is in `data/products.js`. Missing product photos use a GERPINA placeholder until the corresponding image is supplied.

## Latest Econt safe-mode behaviour

- Delivery price calculation is automatic after the required customer and Econt destination fields are complete.
- There is no manual "calculate delivery" button.
- Production company profiles send `senderAgent` server-side. GERPINA can override the authorised-person name through `ECONT_SENDER_AGENT_NAME`; the checkout also shows the sender/company/contact details because GERPINA requested them to be customer-visible.
- The COD agreement remains server-side in `ECONT_CD_AGREEMENT` and is used to identify the correct company/COD profile.
- This build still contains only Econt `calculate` and `validate` calls. It has no `mode: create` shipment call and no courier-request route.


## GERPINA dispatch identity

Customer-facing checkout details:

- **Company:** ГЕРПИНА УЕЪР ЕООД
- **On behalf of:** Петър Станиславов Петров
- **Dispatch address:** гр. Велико Търново, кв. Кольо Фичето, ул. Полтава №3Ж

Server-side Econt requests use the same dispatch point. The code resolves Велико Търново through Econt's nomenclature service and validates the configured street address before using it as `senderAddress`.

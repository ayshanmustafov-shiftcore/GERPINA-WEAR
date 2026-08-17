# GERPINA Wear

Next.js storefront for GERPINA Wear with Bulgarian/English UI, catalogue/cart, persistent Women/Men/Kids scope and Econt checkout integration.

## Econt: production-connected SAFE build

This version can connect to GERPINA's real e-Econt account, but it is intentionally incapable of creating a real waybill.

### What it can do

- authenticate to Econt server-side with Vercel Environment Variables;
- load the authenticated Econt client profile through `ProfileService.getClientProfiles`;
- use the account's registered sender profile/address for price calculation and validation;
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
```

Do not commit the username/password to GitHub.

Optional settings:

```env
# Only if Econt confirms the exact SOAP/JSON COD template name:
ECONT_CD_PAY_TEMPLATE=

# Only if the login later returns more than one Econt client profile:
ECONT_PROFILE_CLIENT_NUMBER=

# Use this only if GERPINA always hands parcels in at one specific sender office.
# If blank, the build uses the first registered sender address returned by the Econt profile.
ECONT_SENDER_OFFICE_CODE=
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
6. Click **Calculate Econt delivery**.
7. Click **Validate order with Econt**.
8. A successful result confirms the real account/profile/COD setup without creating a shipment.

If the live account is not ready, the final validation button stays disabled and the checkout displays the server-side configuration error without exposing credentials or bank details.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Inventory

The current catalogue is generated from `source-material/GERPINA WEAR Stock list 2.xlsx`. Product data is in `data/products.js`. Missing product photos use a GERPINA placeholder until the corresponding image is supplied.

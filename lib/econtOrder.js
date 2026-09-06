import { buildLabel, econtRequest, getEcontConfig } from '@/lib/econt';

export async function createProductionEcontOrder(body, orderNumber) {
  const config = getEcontConfig();
  if (!config.createEnabled) {
    throw new Error('Онлайн поръчките временно не са активирани.');
  }

  const { label, merchandiseTotal, shipmentWeightKg, setupMeta } = await buildLabel(body);
  const response = await econtRequest('Shipments/LabelService.createLabel.json', {
    mode: 'create',
    label: {
      ...label,
      orderNumber,
      // Keep the printed courier label generic. Exact ordered items remain in the
      // digital packing list and in GERPINA's internal order email.
      shipmentDescription: 'Дрехи',
    },
  });

  const created = response?.label || {};
  if (!created.shipmentNumber) {
    throw new Error('Еконт не върна номер на товарителница след създаването на поръчката.');
  }

  const shippingPrice = Number(Number(created.receiverDueAmount ?? created.totalPrice ?? 0).toFixed(2));

  return {
    environment: 'production',
    orderNumber,
    shipmentNumber: String(created.shipmentNumber),
    pdfURL: created.pdfURL || null,
    expectedDeliveryDate: created.expectedDeliveryDate || null,
    shippingPrice,
    currency: created.currency || 'EUR',
    merchandiseTotal,
    payableOnDelivery: Number((merchandiseTotal + shippingPrice).toFixed(2)),
    shipmentWeightKg,
    weightNeedsVerification: true,
    senderOffice: {
      code: setupMeta.senderOfficeCode || null,
      name: setupMeta.senderOfficeName || null,
      address: setupMeta.senderOfficeAddress || null,
    },
  };
}

function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function buildOrderEmail({ order, body, cart }) {
  const receiver = body.receiver || {};
  const selectedOffice = body.office || null;
  const destination = body.deliveryType === 'office'
    ? `${selectedOffice?.name || 'Офис на Еконт'}${selectedOffice?.address ? ` — ${selectedOffice.address}` : ''}`
    : `${body.city?.name || ''}, ${body.address || ''}`.trim();

  const lines = cart.map((item) => {
    const size = item.selectedSize ? ` · размер ${item.selectedSize}` : '';
    const inventory = item.inventoryNumbers?.length ? ` · GW: ${item.inventoryNumbers.join(', ')}` : ` · GW: ${item.id}`;
    return `${item.quantity} × ${item.name}${size}${inventory} — €${(item.price * item.quantity).toFixed(2)}`;
  });

  const subject = `GERPINA поръчка ${order.orderNumber} · Econt ${order.shipmentNumber}`;
  const text = [
    `Поръчка: ${order.orderNumber}`,
    `Товарителница Econt: ${order.shipmentNumber}`,
    `Клиент: ${receiver.name || ''}`,
    `Телефон: ${receiver.phone || ''}`,
    `Имейл: ${receiver.email || '-'}`,
    `Доставка: ${destination}`,
    'Преглед и тест: активиран',
    `Предварително тегло в товарителницата: ${order.shipmentWeightKg.toFixed(2)} kg`,
    'ВАЖНО: Провери реалното тегло преди предаване в Еконт и коригирай товарителницата, ако е необходимо.',
    '',
    'Продукти:',
    ...lines,
    '',
    `Стойност продукти: €${order.merchandiseTotal.toFixed(2)}`,
    `Доставка по товарителницата: €${order.shippingPrice.toFixed(2)}`,
    `Общо при получаване: €${order.payableOnDelivery.toFixed(2)}`,
    body.note ? `Бележка: ${body.note}` : '',
    '',
    `PDF товарителница: ${order.pdfURL || 'няма върнат PDF URL'}`,
  ].filter(Boolean).join('\n');

  const rows = cart.map((item) => `
    <tr>
      <td style="padding:8px;border-bottom:1px solid #eee">${esc(item.name)}${item.selectedSize ? ` · размер ${esc(item.selectedSize)}` : ''}<br><small>GW: ${esc((item.inventoryNumbers?.length ? item.inventoryNumbers : [item.id]).join(', '))}</small></td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${item.quantity}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">€${(item.price * item.quantity).toFixed(2)}</td>
    </tr>`).join('');

  const html = `
  <div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;color:#111">
    <div style="background:#111;color:#fff;padding:14px 18px;font-weight:700">GERPINA WEAR · НОВА ПОРЪЧКА</div>
    <div style="padding:20px;border:1px solid #e5e5e5;border-top:0">
      <h2 style="margin-top:0;margin-bottom:8px">Поръчка ${esc(order.orderNumber)}</h2>
      <p><b>Товарителница:</b> ${esc(order.shipmentNumber)}</p>
      <p><b>Клиент:</b> ${esc(receiver.name)}<br><b>Телефон:</b> ${esc(receiver.phone)}<br><b>Имейл:</b> ${esc(receiver.email || '-')}</p>
      <p><b>Доставка:</b> ${esc(destination)}<br><b>Преглед и тест:</b> активиран</p>
      <div style="padding:12px 14px;background:#fff7e6;border:1px solid #d7aa52;margin:14px 0"><b>Провери теглото преди изпращане</b><br>Предварително тегло: ${order.shipmentWeightKg.toFixed(2)} kg. Ако реалното тегло е различно/по-високо, коригирай товарителницата преди да предадеш пратката в Еконт.</div>
      <table style="width:100%;border-collapse:collapse;margin:18px 0">
        <thead><tr><th style="text-align:left;padding:8px">Продукт</th><th style="padding:8px">Бр.</th><th style="text-align:right;padding:8px">Сума</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <p><b>Продукти:</b> €${order.merchandiseTotal.toFixed(2)}<br><b>Доставка:</b> €${order.shippingPrice.toFixed(2)}<br><b>Общо при получаване:</b> €${order.payableOnDelivery.toFixed(2)}</p>
      ${body.note ? `<p><b>Бележка:</b> ${esc(body.note)}</p>` : ''}
      ${order.pdfURL ? `<p><a href="${esc(order.pdfURL)}">Отвори товарителницата</a></p>` : ''}
    </div>
  </div>`;

  return { subject, text, html };
}

export function buildCustomerOrderEmail({ order, body, cart }) {
  const receiver = body.receiver || {};
  const selectedOffice = body.office || null;
  const destination = body.deliveryType === 'office'
    ? `${selectedOffice?.name || 'Офис на Еконт'}${selectedOffice?.address ? ` — ${selectedOffice.address}` : ''}`
    : `${body.city?.name || ''}, ${body.address || ''}`.trim();
  const lines = cart.map((item) => {
    const size = item.selectedSize ? ` · размер ${item.selectedSize}` : '';
    const inventory = item.inventoryNumbers?.length ? ` · GW: ${item.inventoryNumbers.join(', ')}` : ` · GW: ${item.id}`;
    return `${item.quantity} × ${item.name}${size}${inventory} — €${(item.price * item.quantity).toFixed(2)}`;
  });
  const subject = `Потвърждение за поръчка ${order.orderNumber} · GERPINA Wear`;
  const text = [
    `Здравейте${receiver.name ? `, ${receiver.name}` : ''}!`,
    '',
    'Вашата поръчка е приета успешно.',
    `Поръчка: ${order.orderNumber}`,
    `Товарителница Econt: ${order.shipmentNumber}`,
    `Доставка: ${destination}`,
    'Плащане: наложен платеж при получаване',
    'Преглед и тест: активиран',
    '',
    'Продукти:',
    ...lines,
    '',
    `Стойност продукти: €${order.merchandiseTotal.toFixed(2)}`,
    `Доставка: €${order.shippingPrice.toFixed(2)}`,
    `Общо при получаване: €${order.payableOnDelivery.toFixed(2)}`,
    '',
    'Благодарим Ви, че пазарувате от GERPINA Wear.',
  ].join('\n');
  const rows = cart.map((item) => `
    <tr>
      <td style="padding:8px;border-bottom:1px solid #eee">${esc(item.name)}${item.selectedSize ? ` · размер ${esc(item.selectedSize)}` : ''}<br><small>GW: ${esc((item.inventoryNumbers?.length ? item.inventoryNumbers : [item.id]).join(', '))}</small></td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${item.quantity}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">€${(item.price * item.quantity).toFixed(2)}</td>
    </tr>`).join('');
  const html = `
  <div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;color:#111">
    <div style="background:#111;color:#fff;padding:14px 18px;font-weight:700">GERPINA WEAR · ПОТВЪРЖДЕНИЕ</div>
    <div style="padding:20px;border:1px solid #e5e5e5;border-top:0">
      <h2 style="margin-top:0">Поръчката Ви е приета успешно</h2>
      <p>Здравейте${receiver.name ? `, ${esc(receiver.name)}` : ''}!</p>
      <p><b>Поръчка:</b> ${esc(order.orderNumber)}<br><b>Товарителница Econt:</b> ${esc(order.shipmentNumber)}</p>
      <p><b>Доставка:</b> ${esc(destination)}<br><b>Плащане:</b> наложен платеж при получаване<br><b>Преглед и тест:</b> активиран</p>
      <table style="width:100%;border-collapse:collapse;margin:18px 0">
        <thead><tr><th style="text-align:left;padding:8px">Продукт</th><th style="padding:8px">Бр.</th><th style="text-align:right;padding:8px">Сума</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <p><b>Продукти:</b> €${order.merchandiseTotal.toFixed(2)}<br><b>Доставка:</b> €${order.shippingPrice.toFixed(2)}<br><b>Общо при получаване:</b> €${order.payableOnDelivery.toFixed(2)}</p>
      <p>Благодарим Ви, че пазарувате от GERPINA Wear.</p>
    </div>
  </div>`;
  return { subject, text, html };
}

async function sendEmail(email, recipient) {
  const apiKey = String(process.env.RESEND_API_KEY || process.env.EMAIL_PROVIDER_API_KEY || '').trim();
  const from = String(process.env.ORDER_FROM_EMAIL || '').trim();
  const to = String(recipient || '').trim();

  if (!apiKey || !to || !from) {
    return { sent: false, reason: 'Email settings are incomplete.' };
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: from.includes('<') ? from : `GERPINA Wear <${from}>`,
      to: [to],
      subject: email.subject,
      html: email.html,
      text: email.text,
    }),
    cache: 'no-store',
    signal: AbortSignal.timeout(12000),
  });

  let data = null;
  try { data = await response.json(); } catch {}
  if (!response.ok) {
    return { sent: false, reason: data?.message || `Email provider returned ${response.status}.` };
  }

  return { sent: true, id: data?.id || null };
}

export async function sendOrderEmails({ internalEmail, customerEmail, customerAddress }) {
  const internalAddress = String(process.env.ORDER_TO_EMAIL || '').trim();
  const [internal, customer] = await Promise.all([
    sendEmail(internalEmail, internalAddress),
    customerAddress
      ? sendEmail(customerEmail, customerAddress)
      : Promise.resolve({ sent: false, skipped: true, reason: 'Customer did not provide an email address.' }),
  ]);
  return { internal, customer };
}

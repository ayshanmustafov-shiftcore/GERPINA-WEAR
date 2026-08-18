function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function buildTestOrderEmail({ order, body }) {
  const receiver = body.receiver || {};
  const selectedOffice = body.office || null;
  const destination = body.deliveryType === 'office'
    ? `${selectedOffice?.name || 'Econt office'}${selectedOffice?.address ? ` — ${selectedOffice.address}` : ''}`
    : `${body.city?.name || ''}, ${body.address || ''}`.trim();

  const lines = order.cart.map((item) => {
    const size = item.selectedSize ? ` · размер ${item.selectedSize}` : '';
    return `${item.quantity} × ${item.name}${size} — €${(item.price * item.quantity).toFixed(2)}`;
  });

  const subject = `[TEST] GERPINA поръчка ${order.orderNumber} · Econt ${order.shipmentNumber}`;
  const text = [
    'ТЕСТОВА ПОРЪЧКА — НЕ Е РЕАЛНА ПРАТКА',
    '',
    `Поръчка: ${order.orderNumber}`,
    `Тестова товарителница Econt: ${order.shipmentNumber}`,
    `Клиент: ${receiver.name || ''}`,
    `Телефон: ${receiver.phone || ''}`,
    `Имейл: ${receiver.email || '-'}`,
    `Доставка: ${destination}`,
    'Преглед и тест: активиран',
    `Предварително тегло в товарителницата: ${order.shipmentWeightKg.toFixed(2)} kg`,
    'ВАЖНО: Провери реалното тегло преди предаване в Еконт. Ако е различно/над предварителното, коригирай товарителницата.',
    ...(order.demoFallbacks?.senderOffice ? [`DEMO бележка: Полтава №3Ж не е наличен в тестовата номенклатура; използван е DEMO офис ${order.senderOffice?.name || order.senderOffice?.code}. Production остава Полтава №3Ж.`] : []),
    ...(order.demoFallbacks?.receiverOffice ? ['DEMO бележка: избраният клиентски офис няма точен еквивалент в DEMO и е използван тестов офис в същия град.'] : []),
    '',
    'Продукти:',
    ...lines,
    '',
    `Стойност продукти: €${order.merchandiseTotal.toFixed(2)}`,
    ...(typeof body.quotedShippingPrice === 'number' ? [`Реална изчислена доставка в checkout: €${Number(body.quotedShippingPrice).toFixed(2)}`] : []),
    `Econt доставка на DEMO товарителницата: €${order.shippingPrice.toFixed(2)} (само технически тест)`,
    `DEMO общо ориентировъчно: €${(order.merchandiseTotal + order.shippingPrice).toFixed(2)} (не е сумата за клиента)`,
    body.note ? `Бележка: ${body.note}` : '',
    '',
    `PDF товарителница: ${order.pdfURL || 'няма върнат PDF URL'}`,
  ].filter(Boolean).join('\n');

  const rows = order.cart.map((item) => `
    <tr>
      <td style="padding:8px;border-bottom:1px solid #eee">${esc(item.name)}${item.selectedSize ? ` · размер ${esc(item.selectedSize)}` : ''}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${item.quantity}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">€${(item.price * item.quantity).toFixed(2)}</td>
    </tr>`).join('');

  const html = `
  <div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;color:#111">
    <div style="background:#111;color:#fff;padding:14px 18px;font-weight:700">GERPINA WEAR · TEST ORDER</div>
    <div style="padding:20px;border:1px solid #e5e5e5;border-top:0">
      <p style="margin-top:0;color:#b42318;font-weight:700">Това е тестова поръчка. Не е създадена реална пратка в production e-Econt.</p>
      <h2 style="margin-bottom:8px">Поръчка ${esc(order.orderNumber)}</h2>
      <p><b>Тестова товарителница:</b> ${esc(order.shipmentNumber)}</p>
      <p><b>Клиент:</b> ${esc(receiver.name)}<br><b>Телефон:</b> ${esc(receiver.phone)}<br><b>Имейл:</b> ${esc(receiver.email || '-')}</p>
      <p><b>Доставка:</b> ${esc(destination)}<br><b>Преглед и тест:</b> активиран</p>
      <div style="padding:12px 14px;background:#fff7e6;border:1px solid #d7aa52;margin:14px 0"><b>Провери теглото преди изпращане</b><br>Предварително тегло в товарителницата: ${order.shipmentWeightKg.toFixed(2)} kg. Ако реалното тегло е различно/по-високо, коригирай товарителницата преди да предадеш пратката в Еконт.</div>
      ${order.demoFallbacks?.senderOffice ? `<p style="color:#7a5a00"><b>DEMO:</b> Полтава №3Ж не е наличен в тестовата номенклатура. За тестовата товарителница е използван ${esc(order.senderOffice?.name || order.senderOffice?.code || 'друг DEMO офис')}. Production остава Полтава №3Ж.</p>` : ''}
      ${order.demoFallbacks?.receiverOffice ? `<p style="color:#7a5a00"><b>DEMO:</b> избраният клиентски офис няма точен еквивалент в DEMO и е използван тестов офис в същия град.</p>` : ''}
      <table style="width:100%;border-collapse:collapse;margin:18px 0">
        <thead><tr><th style="text-align:left;padding:8px">Продукт</th><th style="padding:8px">Бр.</th><th style="text-align:right;padding:8px">Сума</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <p><b>Продукти:</b> €${order.merchandiseTotal.toFixed(2)}<br>${typeof body.quotedShippingPrice === 'number' ? `<b>Реална checkout доставка:</b> €${Number(body.quotedShippingPrice).toFixed(2)}<br>` : ''}<b>Econt доставка (DEMO товарителница):</b> €${order.shippingPrice.toFixed(2)} <span style="color:#777">(само технически тест)</span><br><b>DEMO общо:</b> €${(order.merchandiseTotal + order.shippingPrice).toFixed(2)} <span style="color:#777">(не е сумата за клиента)</span></p>
      ${body.note ? `<p><b>Бележка:</b> ${esc(body.note)}</p>` : ''}
      ${order.pdfURL ? `<p><a href="${esc(order.pdfURL)}">Отвори тестовата товарителница</a></p>` : ''}
    </div>
  </div>`;

  return { subject, text, html };
}

export async function sendTestOrderEmail(email) {
  const apiKey = String(process.env.RESEND_API_KEY || process.env.EMAIL_PROVIDER_API_KEY || '').trim();
  const to = String(process.env.ORDER_TO_EMAIL || '').trim();
  const from = String(process.env.ORDER_FROM_EMAIL || '').trim();

  if (!apiKey || !to || !from) {
    return {
      sent: false,
      mode: 'preview-only',
      reason: 'ORDER_TO_EMAIL, ORDER_FROM_EMAIL and RESEND_API_KEY are not all configured.',
    };
  }

  // Test implementation uses Resend's HTTPS API directly, so no mail package is required.
  // The API key stays server-side in Vercel Environment Variables.
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: from.includes('<') ? from : `GERPINA Wear <${from}>`, to: [to], subject: email.subject, html: email.html, text: email.text }),
    cache: 'no-store',
    signal: AbortSignal.timeout(12000),
  });

  let data = null;
  try { data = await response.json(); } catch {}
  if (!response.ok) {
    return {
      sent: false,
      mode: 'send-failed',
      reason: data?.message || `Email provider returned ${response.status}.`,
    };
  }

  return { sent: true, mode: 'sent', id: data?.id || null };
}

const COLOUR_DEFINITIONS = [
  { key: 'navy', css: '#17233f', bg: 'Тъмносин', en: 'Navy', terms: ['тъмносин', 'тъмно син', 'navy', 'dark blue'] },
  { key: 'black', css: '#111111', bg: 'Черен', en: 'Black', terms: ['черен', 'черна', 'черно', 'black'] },
  { key: 'white', css: '#ffffff', bg: 'Бял', en: 'White', terms: ['бял', 'бяла', 'бяло', 'white'] },
  { key: 'grey', css: '#9a9a9a', bg: 'Сив', en: 'Grey', terms: ['сив', 'сива', 'сиво', 'grey', 'gray'] },
  { key: 'beige', css: '#d8c7a7', bg: 'Бежов', en: 'Beige', terms: ['бежов', 'бежова', 'бежово', 'beige'] },
  { key: 'brown', css: '#76533a', bg: 'Кафяв', en: 'Brown', terms: ['кафяв', 'кафява', 'кафяво', 'brown'] },
  { key: 'pink', css: '#e7a5b6', bg: 'Розов', en: 'Pink', terms: ['розов', 'розова', 'розово', 'pink'] },
  { key: 'red', css: '#c62b32', bg: 'Червен', en: 'Red', terms: ['червен', 'червена', 'червено', 'red'] },
  { key: 'burgundy', css: '#6e1f2a', bg: 'Бордо', en: 'Burgundy', terms: ['бордо', 'burgundy', 'bordeaux'] },
  { key: 'blue', css: '#3978b8', bg: 'Син', en: 'Blue', terms: ['син', 'синя', 'синьо', 'blue'] },
  { key: 'green', css: '#4d7d55', bg: 'Зелен', en: 'Green', terms: ['зелен', 'зелена', 'зелено', 'green'] },
  { key: 'khaki', css: '#777451', bg: 'Каки', en: 'Khaki', terms: ['каки', 'khaki'] },
  { key: 'yellow', css: '#e5c43a', bg: 'Жълт', en: 'Yellow', terms: ['жълт', 'жълта', 'жълто', 'yellow'] },
  { key: 'orange', css: '#df7a2d', bg: 'Оранжев', en: 'Orange', terms: ['оранжев', 'оранжева', 'оранжево', 'orange'] },
  { key: 'purple', css: '#76539b', bg: 'Лилав', en: 'Purple', terms: ['лилав', 'лилава', 'лилаво', 'purple'] },
  { key: 'gold', css: '#caa24b', bg: 'Златист', en: 'Gold', terms: ['златист', 'златна', 'златно', 'gold'] },
  { key: 'silver', css: '#c3c7ca', bg: 'Сребрист', en: 'Silver', terms: ['сребрист', 'сребър', 'silver'] },
  { key: 'multicolour', css: 'conic-gradient(#d44 0 16%, #e5c43a 16% 32%, #4d7d55 32% 48%, #3978b8 48% 64%, #76539b 64% 80%, #e7a5b6 80% 100%)', bg: 'Многоцветен', en: 'Multicolour', terms: ['многоцвет', 'multicolour', 'multicolor', 'цветя', 'flowers'] },
];

function uniqueByKey(items) {
  const seen = new Set();
  return items.filter((item) => {
    if (seen.has(item.key)) return false;
    seen.add(item.key);
    return true;
  });
}

function swatchesFromText(text) {
  const normalized = String(text || '').toLowerCase();
  if (!normalized || normalized.includes('неуточнен') || normalized.includes('unspecified')) return [];
  return uniqueByKey(COLOUR_DEFINITIONS.filter((definition) => definition.terms.some((term) => normalized.includes(term))));
}

export function getProductSwatches(product, language = 'bg') {
  // Future-proofing: if the inventory later contains true colour variants, each entry
  // can be placed in product.colours and will render as its own selectable swatch.
  if (Array.isArray(product?.colours) && product.colours.length) {
    const result = product.colours.flatMap((colour) => {
      const text = typeof colour === 'string' ? colour : (colour?.[language] || colour?.bg || colour?.en || '');
      const matches = swatchesFromText(text);
      return matches.length ? matches : [{ key: String(text).toLowerCase(), css: '#f4f4f4', bg: colour?.bg || text, en: colour?.en || text }];
    });
    return uniqueByKey(result);
  }

  const combined = `${product?.colour?.bg || ''} ${product?.colour?.en || ''}`;
  const matches = swatchesFromText(combined);
  if (matches.length) return matches;

  const labelBg = product?.colour?.bg || 'Неуточнен';
  const labelEn = product?.colour?.en || 'Unspecified';
  if (labelBg === 'Неуточнен' || labelEn === 'Unspecified') return [];
  return [{ key: 'other', css: '#f4f4f4', bg: labelBg, en: labelEn }];
}

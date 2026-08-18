const TEXT_SIZE_ORDER = [
  'XXXS', 'XXS', 'XS', 'XS/S', 'S', 'S/M', 'M', 'M/L', 'L', 'L/XL',
  'XL', '2XL', 'XXL', '3XL', 'XXXL', '4XL', 'XXXXL', '5XL', 'XXXXXL'
];

const TEXT_SIZE_RANK = new Map(TEXT_SIZE_ORDER.map((value, index) => [value, index]));

function normalizeSizeLabel(label = '') {
  return String(label)
    .trim()
    .toUpperCase()
    .replace(/М/g, 'M')
    .replace(/Х/g, 'X')
    .replace(/\s*\/\s*/g, '/')
    .replace(/^2XL$/, '2XL')
    .replace(/^3XL$/, '3XL')
    .replace(/^4XL$/, '4XL')
    .replace(/^5XL$/, '5XL');
}

function textRank(label) {
  const normalized = normalizeSizeLabel(label);
  if (TEXT_SIZE_RANK.has(normalized)) return TEXT_SIZE_RANK.get(normalized);

  // Common aliases so 2XL/XXL etc. sit next to each other.
  if (normalized === 'XXL') return TEXT_SIZE_RANK.get('2XL') + 0.1;
  if (normalized === 'XXXL') return TEXT_SIZE_RANK.get('3XL') + 0.1;
  if (normalized === 'XXXXL') return TEXT_SIZE_RANK.get('4XL') + 0.1;
  return null;
}

function ageRange(label) {
  const value = String(label).trim().toLowerCase();
  if (value.includes('новород')) return { start: -1, end: 0, unit: 'months' };

  const match = value.match(/(\d+)\s*\/\s*(\d+)\s*(месеца|месец|м\.|г\.|год|години)?/i);
  if (!match) return null;

  const start = Number(match[1]);
  const end = Number(match[2]);
  const unitToken = match[3] || '';
  const isMonths = /мес/.test(unitToken);
  return {
    start: isMonths ? start : start * 12,
    end: isMonths ? end : end * 12,
    unit: 'months',
  };
}

function euNumeric(label) {
  const value = String(label).trim();
  const match = value.match(/^(\d{2,3})(?:\s|$)/);
  if (!match) return null;
  const n = Number(match[1]);
  // Exclude age-like values such as 50cm unless explicitly a clothing size.
  if (/см|cm/i.test(value)) return null;
  return n;
}

function alphaFallback(a, b) {
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
}

export function compareSizes(a, b) {
  const aLabel = typeof a === 'string' ? a : a?.label || '';
  const bLabel = typeof b === 'string' ? b : b?.label || '';

  const aText = textRank(aLabel);
  const bText = textRank(bLabel);

  // Text apparel sizes first in natural clothing order.
  if (aText !== null || bText !== null) {
    if (aText === null) return 1;
    if (bText === null) return -1;
    return aText - bText || alphaFallback(aLabel, bLabel);
  }

  // EU numeric sizes in ascending order.
  const aEu = euNumeric(aLabel);
  const bEu = euNumeric(bLabel);
  if (aEu !== null || bEu !== null) {
    if (aEu === null) return 1;
    if (bEu === null) return -1;
    return aEu - bEu || alphaFallback(aLabel, bLabel);
  }

  // Kids sizes: newborn, months, then years chronologically.
  const aAge = ageRange(aLabel);
  const bAge = ageRange(bLabel);
  if (aAge || bAge) {
    if (!aAge) return 1;
    if (!bAge) return -1;
    return aAge.start - bAge.start || aAge.end - bAge.end || alphaFallback(aLabel, bLabel);
  }

  return alphaFallback(aLabel, bLabel);
}

export function sortSizes(sizes = []) {
  return [...sizes].sort(compareSizes);
}

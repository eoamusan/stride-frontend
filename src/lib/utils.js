import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const toPositiveNumber = (value) => {
  const num = Number(value);
  return Number.isFinite(num) && num > 0 ? num : undefined;
};

export const toNumber = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : undefined;
};

export const buildQueryUrl = (basePath, params = {}) => {
  if (!basePath) return '';

  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;

    if (Array.isArray(value)) {
      value.forEach((val) => {
        if (val !== undefined && val !== null) {
          query.append(key, val);
        }
      });
    } else {
      query.append(key, value);
    }
  });

  const queryString = query.toString();
  if (!queryString) return basePath;

  return basePath.includes('?')
    ? `${basePath}&${queryString}`
    : `${basePath}?${queryString}`;
};

export const normalizeApiCollection = (payload, candidateKeys = []) => {
  if (!payload) return [];

  const defaultKeys = ['items', 'data', 'docs'];
  const keysToCheck = [...candidateKeys, ...defaultKeys];
  const layers = [payload?.data, payload];

  for (const layer of layers) {
    if (!layer) continue;

    for (const key of keysToCheck) {
      if (Array.isArray(layer?.[key])) return layer[key];
    }

    if (Array.isArray(layer)) return layer;
  }

  if (Array.isArray(payload)) return payload;
  return [];
};

export const extractPaginationMeta = (payload, options = {}) => {
  const {
    page: fallbackPage = 1,
    perPage: fallbackPerPage = 10,
    totalDocs: fallbackTotalDocs = 0,
  } = options;

  const dataLayer = payload?.data ?? payload ?? {};
  const paginationSource =
    dataLayer?.meta ||
    dataLayer?.pagination ||
    dataLayer?.pageData ||
    dataLayer;

  const perPage =
    toPositiveNumber(
      paginationSource?.perPage ??
        paginationSource?.limit ??
        paginationSource?.pageSize ??
        fallbackPerPage
    ) ?? 10;

  const totalDocs =
    toNumber(
      paginationSource?.totalDocs ??
        paginationSource?.total ??
        paginationSource?.count
    ) ??
    fallbackTotalDocs ??
    0;

  const totalPages =
    toPositiveNumber(paginationSource?.totalPages) ??
    (perPage > 0 ? Math.max(1, Math.ceil(totalDocs / perPage)) : 1);

  const page =
    toPositiveNumber(paginationSource?.page ?? paginationSource?.currentPage) ??
    fallbackPage ??
    1;

  return {
    page,
    perPage,
    totalPages,
    totalDocs,
  };
};

export const normalizeStatus = (status, fallback = '') => {
  if (status === undefined || status === null) return fallback;
  return status
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, '-')
    .replace(/-+/g, '-');
};

export const formatStatusLabel = (status, fallback = 'Unknown') => {
  const normalized = normalizeStatus(status);
  if (!normalized) return fallback;
  return normalized
    .split('-')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
};

export const formatCurrencyValue = (value, options = {}) => {
  const {
    locale = 'en-NG',
    currency = 'NGN',
    minimumFractionDigits = 0,
    maximumFractionDigits = 2,
    fallback = '—',
  } = options;

  const num = Number(value);
  if (!Number.isFinite(num)) return fallback;

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(num);
  } catch (error) {
    return `${currency} ${num.toFixed(maximumFractionDigits)}`;
  }
};

export const resolveEntityIdentifier = (entity, preferredKeys = []) => {
  if (!entity || typeof entity !== 'object') return undefined;

  const defaultKeys = ['id', '_id', 'uuid', 'key'];
  const keysToCheck = [...preferredKeys, ...defaultKeys];

  for (const key of keysToCheck) {
    if (entity[key]) return entity[key];
  }

  return undefined;
};

export const formatDateLabel = (value, fallback = '—') => {
  if (!value) return fallback;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  try {
    const month = parsed.toLocaleString('en-US', { month: 'short' });
    const day = String(parsed.getDate()).padStart(2, '0');
    const year = parsed.getFullYear();
    return `${month} -${day}-${year}`;
  } catch (error) {
    return value;
  }
};

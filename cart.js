import { getApiExpand } from './index';

/**
 * Get base URL from request headers or environment
 * @param {Object} req - Request object
 * @returns {string} Base URL
 */
const getBaseUrl = req => {
  const proto = req?.headers?.['x-forwarded-proto'] ?? 'http';
  const host = req?.headers?.host ?? '';
  const envBase = process.env.NEXT_PUBLIC_DOMAIN_HOST || process.env.NEXT_PUBLIC_APPLICATION_URL;

  if (host) return `${proto}://${host}`;
  if (envBase) return envBase;
  return 'http://localhost';
};

/**
 * Check if current page is extended cart page
 * @param {Object} req - Request object
 * @returns {boolean} True if on cart checkout pages
 */
const isExtendedCart = req => {
  const referer = req?.headers?.referer ?? '';

  try {
    const url = new URL(referer, getBaseUrl(req));
    const cartPages = ['/kosik', '/kosik/kontakt', '/kosik/doprava-a-platba'];
    return cartPages.includes(url.pathname);
  } catch {
    return false;
  }
};

export const addCartUrlField = (url, req) => {
  if (getApiExpand('CART')) {
    url += '?' + getApiExpand('CART', true);
  }

  if (getApiExpand('CART', false, 'FIELDS')) {
    url +=
      (getApiExpand('CART') ? '&' : '?') + getApiExpand('CART', true, 'FIELDS');

    if (isExtendedCart(req) && getApiExpand('CART_EXTENDED', false, 'FIELDS')) {
      url += `,${getApiExpand('CART_EXTENDED', false, 'FIELDS')}`;
    }
  }

  return url;
};

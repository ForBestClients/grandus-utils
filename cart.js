import { getApiExpand } from './index';
import get from 'lodash/get';

const getBaseUrl = req => {
  const proto = get(req, 'headers.x-forwarded-proto', 'http');
  const host = get(req, 'headers.host', '');
  const envBase =
    process.env.NEXT_PUBLIC_DOMAIN_HOST ||
    process.env.NEXT_PUBLIC_APPLICATION_URL;
  if (host) return `${proto}://${host}`;
  if (envBase) return envBase;
  return 'http://localhost';
};

const isExtendedCart = req => {
  const referer = get(req, 'headers.referer', '');
  let obj;
  try {
    obj = new URL(referer, getBaseUrl(req));
  } catch {
    return false;
  }

  switch (obj.pathname) {
    case '/kosik':
    case '/kosik/kontakt':
    case '/kosik/doprava-a-platba':
      return true;
    default:
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

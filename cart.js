import { getApiExpand } from './index';
import get from 'lodash/get';

const isExtendedCart = req => {
  const referer = req.headers.get('referer');
  const obj = new URL(referer);

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

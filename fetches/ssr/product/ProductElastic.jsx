import { reqApiHost } from 'grandus-lib/utils/edge';
import { get } from 'lodash';
import getRequestObject from 'grandus-utils/request';
import { reqGetHeaders } from '@/grandus-utils';

export const getProductPromiseElastic = async params => {
  const urlTitle = get(params, 'urlTitle', '');
  const req = await getRequestObject();

  return fetch(`${reqApiHost({})}/api/v2/products?urlTitle=${urlTitle}`, {
    headers: reqGetHeaders(req),
    cache: 'no-cache',
  })
    .then(result => result.json())
    .then(r => get(r, 'data[0]'));
};

const getProduct = async params => {
  return await getProductPromiseElastic(params);
};

export default getProduct;

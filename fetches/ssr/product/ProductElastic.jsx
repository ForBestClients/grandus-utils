import { reqApiHost } from 'grandus-lib/utils/edge';
import { reqGetHeaders } from 'grandus-utils';
import getRequestObject from 'grandus-utils/request';
import { get } from 'lodash';

export const getProductPromiseElastic = async params => {
  const req = await getRequestObject();
  const urlTitle = get(params, 'urlTitle', '');

  return fetch(
    `${reqApiHost(req)}/api/v2/products?urlTitle=${urlTitle}`,
    {
      headers: reqGetHeaders(req),
      next: { revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE) },
    },
  )
    .then(result => result.json())
    .then(r => get(r, 'data[0]'));
};

const getProduct = async params => {
  return await getProductPromiseElastic(params);
};

export default getProduct;

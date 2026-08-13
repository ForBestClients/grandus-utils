import { reqApiHost, reqGetHeadersBasic } from 'grandus-lib/utils/edge';
import { get } from 'lodash';
import { getRequestContext } from 'grandus-utils/context';

export const getProductPromiseElastic = async params => {
  const urlTitle = get(params, 'urlTitle', '');

  return fetch(
    `${reqApiHost({})}/api/v2/products?urlTitle=${urlTitle}`,
    {
      headers: reqGetHeadersBasic(getRequestContext(params)),
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

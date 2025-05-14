import { reqApiHost } from 'grandus-lib/utils/edge';
import { getApiExpand, getApiFields, reqGetHeaders } from 'grandus-utils';
import { getProcessedCardFields } from 'utils';
import getRequestObject from 'grandus-utils/request';

export const getProductPromise = async (params, user) => {
  const req = await getRequestObject();

  const uri = [];
  const productDetailFields = getApiFields('PRODUCT_DETAIL').split(',');
  const processedFields = getProcessedCardFields('crosssaleProducts.products.');

  uri.push(`fields=${[...productDetailFields, ...processedFields].join(',')}`);

  if (params?.expand) {
    uri.push(`expand=${params.expand}`);
  } else {
    uri.push(getApiExpand('PRODUCT_DETAIL', true));
  }

  const headers = reqGetHeaders(req);

  if (user?.accessToken) {
    headers['Authorization'] = `Bearer ${user.accessToken}`;
  }

  console.log(headers);

  return fetch(
    `${reqApiHost(req)}/api/v2/products/${params?.urlTitle}?${uri.join('&')}`,
    {
      headers: headers,
      next: { revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE) },
    },
  ).then(result => result.json());
};

export const getProductData = async (params, user) => {
  const [product] = await Promise.all([getProductPromise(params, user)]);

  return product;
};

const getProduct = async (params, user) => {
  const productData = await getProductData(params, user);

  return productData?.data;
};

export default getProduct;

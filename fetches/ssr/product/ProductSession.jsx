import { reqApiHost, reqGetHeadersBasic } from 'grandus-lib/utils/edge';
import { getApiExpand, getApiFields } from 'grandus-utils';
import { getProcessedCardFields } from 'utils';

export const getProductPromise = async (params, user) => {
  const req = {};

  const uri = [];
  const productDetailFields = getApiFields('PRODUCT_DETAIL').split(',');
  const processedFields = getProcessedCardFields('crosssaleProducts.products.');

  uri.push(`fields=${[...productDetailFields, ...processedFields].join(',')}`);

  if (params?.expand) {
    uri.push(`expand=${params.expand}`);
  } else {
    uri.push(getApiExpand('PRODUCT_DETAIL', true));
  }

  const headers = reqGetHeadersBasic(req);

  if (user?.accessToken) {
    headers['Authorization'] = `Bearer ${user.accessToken}`;
  }

  const url = `${reqApiHost(req)}/api/v2/products/${params?.urlTitle}?${uri.join('&')}`;

  // IMPORTANT: Do not cache authenticated requests. Otherwise, personalized
  // responses may be served to other users via Next.js fetch cache/CDN.
  const fetchOptions = user?.accessToken
    ? { headers, cache: 'no-store' }
    : { headers, next: { revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE) } };

  return fetch(url, fetchOptions).then(result => result.json());
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

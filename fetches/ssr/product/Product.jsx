import { reqApiHost, reqGetHeadersBasic } from 'grandus-lib/utils/edge';
import { getApiExpand, getApiFields } from 'grandus-utils';
import { getProcessedCardFields } from 'utils';

export const getProductPromise = async (params, options = {}) => {
  const req = {};

  const uri = [];
  const productDetailFields = getApiFields('PRODUCT_DETAIL')
    .split(',')
    .filter(i => !!i);
  const processedFields =
    productDetailFields.length > 0
      ? getProcessedCardFields('crosssaleProducts.products.')
      : [];

  uri.push(`fields=${[...productDetailFields, ...processedFields].join(',')}`);

  if (params?.expand) {
    uri.push(`expand=${params.expand}`);
  } else {
    uri.push(getApiExpand('PRODUCT_DETAIL', true));
  }

  const revalidate = options?.revalidate;

  const reqOptions = {
    headers: reqGetHeadersBasic(req),
  };

  if (typeof revalidate === 'number') {
    reqOptions.next = { revalidate: revalidate };
  } else if (revalidate === null) {
    reqOptions.cache = 'no-store';
  } else {
    reqOptions.next = {
      revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE),
    };
  }

  return fetch(
    `${reqApiHost(req)}/api/v2/products/${params?.urlTitle}?${uri.join('&')}`,
    reqOptions,
  ).then(result => result.json());
};

export const getProductData = async (params, options = {}) => {
  const [product] = await Promise.all([getProductPromise(params, options)]);

  return product;
};

const getProduct = async params => {
  const productData = await getProductData(params);

  return productData?.data;
};

export default getProduct;

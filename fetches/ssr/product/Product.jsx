import { reqApiHost, getApiExpand, getApiFields, reqGetHeaders } from 'grandus-utils';
import { getProcessedCardFields } from 'utils';
import getRequestObject from 'grandus-utils/request';

export const getProductPromise = async params => {
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

  return fetch(
    `${reqApiHost(req)}/api/v2/products/${params?.urlTitle}?${uri.join('&')}`,
    {
      headers: reqGetHeaders(req),
      next: { revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE) },
    },
  ).then(result => result.json());
};

export const getProductData = async params => {
  const [product] = await Promise.all([getProductPromise(params)]);

  return product;
};

const getProduct = async params => {
  const productData = await getProductData(params);

  return productData?.data;
};

export default getProduct;

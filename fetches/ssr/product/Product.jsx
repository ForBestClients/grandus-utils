import { reqApiHost, reqGetHeadersBasic } from 'grandus-lib/utils/edge';
import { getApiExpand, getApiFields } from 'grandus-utils';
import reduce from "lodash/reduce";
import {cookies} from "next/headers";
import { getProcessedCardFields } from 'utils';

export const getProductPromise = async params => {
  const req = {};
  const cookieStore = cookies()
  const cookieObject = reduce(cookieStore.getAll(), (acc, item)=> {
    acc[item?.name]=item?.value
    return acc
  }, {});
  req.cookies = cookieObject

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
      headers: reqGetHeadersBasic(req),
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

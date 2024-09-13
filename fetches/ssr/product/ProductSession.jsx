import { reqApiHost, reqGetHeadersBasic } from 'grandus-lib/utils/edge';
import { getApiExpand, getApiFields } from 'grandus-utils';
import reduce from "lodash/reduce";
import {cookies} from "next/headers";
import { getProcessedCardFields } from 'utils';

export const getProductPromise = async (params, user) => {
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

  const headers = reqGetHeadersBasic(req);

  if (user?.accessToken) {
    headers['Authorization'] = `Bearer ${user.accessToken}`;
  }

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

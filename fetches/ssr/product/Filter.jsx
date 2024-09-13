import crypto from 'crypto';

import {
  reqGetHeaders,
  reqApiHost,
  getProductCardFields,
  getPaginationFromHeaders,
} from '/grandus-lib/utils';

import get from 'lodash/get';

import { getApiBodyFromParams, arrayToParams } from 'grandus-lib/utils/filter';
import reduce from "lodash/reduce";
import {cookies} from "next/headers";

const getProductsData = async data => {
  const req = {};
  const cookieStore = cookies()
  const cookieObject = reduce(cookieStore.getAll(), (acc, item)=> {
    acc[item?.name]=item?.value
    return acc
  }, {});
  req.cookies = cookieObject
  const params = get(data, 'params');

  const orderBy = get(data, 'searchParams.orderBy', process.env.NEXT_PUBLIC_PRODUCT_DEFAULT_ORDERING);

  const category = get(data, 'params.category');
  const parameters = get(data, 'params.parameters', []);

  const urlHost = reqApiHost(req);
  const urlPage = data?.searchParams?.page ? data?.searchParams?.page : 1;
  const urlPerPage = data?.searchParams?.perPage
    ? data?.searchParams?.perPage
    : process.env.NEXT_PUBLIC_PRODUCT_DEFAULT_PER_PAGE;
  const urlFields = getProductCardFields();

  const body = {
    categoryName: category,
    orderBy: orderBy,
    ...getApiBodyFromParams(arrayToParams(parameters)),
  };

  const fetchData = {
    url: `${urlHost}/api/v2/products/filter?fields=${urlFields}&page=${urlPage}&per-page=${urlPerPage}`,
    body: {
      method: 'POST',
      headers: reqGetHeaders(req),
      body: JSON.stringify(body),
      next: { revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE) },
    },
  };

  const urlHash = crypto
    .createHash('md5')
    .update(JSON.stringify(fetchData))
    .digest('hex');

  let pagination = {};
  const products = await fetch(
    `${fetchData?.url}&hash=${urlHash}`,
    fetchData?.body,
  )
    .then(result => {
      pagination = getPaginationFromHeaders(result.headers);
      return result.json();
    })
    .then(r => get(r, 'data', []));

  const result = {
    products: products,
    pagination: pagination,
  };

  return result;
};

export default getProductsData;

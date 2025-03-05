import crypto from 'crypto';

import { reqApiHost, reqGetHeaders, reqExtractUri } from 'grandus-lib/utils';
import { getApiBodyFromParams, arrayToParams } from 'grandus-lib/utils/filter';

import cache, {
  getCachedDataProps,
  saveDataToCacheProps,
} from 'grandus-lib/utils/cache';

import isEmpty from 'lodash/isEmpty';

const createUrl = (fetchData, fields = null) => {
  const urlHash = crypto
    .createHash('md5')
    .update(JSON.stringify(fetchData))
    .digest('hex');

  let url = `${fetchData?.url}${
    (fetchData?.url.indexOf('?') > 0 ? '&cacheHash=' : '?cacheHash=') + urlHash
  }`;

  if (fields) {
    url = url + `&fields=${fields}`;
  }

  return url;
};

const getPromise = async (params, fields = null) => {
  const req = {};

  const propParams = await params?.props?.params;

  const search = propParams?.search;
  const category = propParams?.category;
  const parameters = propParams?.parameters;

  const body = {
    categoryName: category,
    ...getApiBodyFromParams(arrayToParams(parameters)),
  };

  if (search) {
    body.search = search;
  }

  const fetchData = {
    url: `${reqApiHost(req)}/api/v2/filters${reqExtractUri(req?.url)}`,
    body: {
      method: 'POST',
      headers: reqGetHeaders(req),
      body: JSON.stringify(body),
    },
  };

  return fetch(createUrl(fetchData, fields), fetchData?.body)
    .then(result => result.json())
    .catch(() => {
      console.error('error Filter.jsx', params);
      return {};
    });
};

export const getFilterCategoryDataPromise = async params => {
  return getPromise(
    params,
    'selected,stores,brands,storeLocations,statuses,parameters,selectedCategory',
  );
};

export const getFilterDataPromise = async params => {
  return getPromise(params);
};

export const getFilterData = async params => {
  const cachedData = await getCachedDataProps(
    cache,
    params,
    '/grandus-utils/fetches/ssr/category/Filter.jsx',
  );

  if (!isEmpty(cachedData)) {
    return cachedData;
  }

  const data = await getFilterDataPromise(params);

  await saveDataToCacheProps(
    cache,
    data,
    params,
    '/grandus-utils/fetches/ssr/category/Filter.jsx',
  );

  return data;
};

const getFilter = async params => {
  const filterData = await getFilterData(params);

  return filterData?.data;
};

export default getFilter;

import { reqApiHost, reqGetHeadersBasic } from 'grandus-lib/utils/edge';

import cache, {
  getCachedDataProps,
  saveDataToCacheProps,
} from 'grandus-lib/utils/cache';

import { cache as cacheReact } from 'react';

const CACHE_ID = '/grandus-utils/fetches/ssr/category/Categories.jsx';

/**
 * Check if data has content
 */
const hasData = data => {
  if (!data) return false;
  if (Array.isArray(data)) return data.length > 0;
  if (typeof data === 'object') return Object.keys(data).length > 0;
  return !!data;
};

/**
 * React-cached categories fetcher
 */
const getCategoriesData = cacheReact(async props => {
  // Build query params (note: some not implemented on backend)
  const queryParams = [];

  if (props?.depth !== false) {
    queryParams.push(`depth=${props?.depth ?? '0'}`);
  }

  if (props?.expand) {
    queryParams.push(`expand=${props.expand}`);
  }

  if (props?.fields) {
    queryParams.push(`fields=${props.fields}`);
  }

  const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

  const response = await fetch(
    `${reqApiHost()}/api/v2/categories${queryString}`,
    {
      headers: reqGetHeadersBasic({}),
    },
  );

  return response.json();
});

/**
 * Get categories with Redis caching
 * @param {Object} props - Query parameters
 * @returns {Promise<Array>} Categories data array
 */
const getCategories = async props => {
  const cachedData = await getCachedDataProps(cache, props, CACHE_ID);

  if (hasData(cachedData)) {
    return cachedData?.data;
  }

  const data = await getCategoriesData(props);

  await saveDataToCacheProps(cache, data, props, CACHE_ID);

  return data?.data;
};

export default getCategories;

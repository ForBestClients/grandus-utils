import { reqGetHeaders, reqApiHost } from 'grandus-lib/utils';

import cache, {
  getCachedDataProps,
  saveDataToCacheProps,
} from 'grandus-lib/utils/cache';

import { cache as cacheReact } from 'react';

const CACHE_ID = '/grandus-utils/fetches/ssr/Banners.jsx';

/**
 * Check if data is empty (handles arrays and objects)
 */
const isDataEmpty = data => {
  if (!data) return true;
  if (Array.isArray(data)) return data.length === 0;
  if (typeof data === 'object') return Object.keys(data).length === 0;
  return false;
};

/**
 * Fetch banners with React + Redis caching
 * @param {Object} params - Query parameters
 * @returns {Promise<Array>} Array of banner objects
 */
const getBannersData = cacheReact(async params => {
  // Check Redis cache
  const cachedData = await getCachedDataProps(cache, params, CACHE_ID);

  if (!isDataEmpty(cachedData)) {
    return cachedData;
  }

  // Build request object
  const req = params?.cookies ? { cookies: params.cookies } : {};

  // Build query params
  const queryParams = [];
  if (params?.type) queryParams.push(`type=${params.type}`);
  if (params?.propertyId) queryParams.push(`propertyId=${params.propertyId}`);
  if (params?.limit) queryParams.push(`limit=${params.limit}`);
  if (params?.expand) queryParams.push(`expand=${params.expand}`);

  const queryString = queryParams.length > 0 ? `?v=2&${queryParams.join('&')}` : '';

  const response = await fetch(
    `${reqApiHost()}/api/v2/banners${queryString}`,
    {
      headers: reqGetHeaders(req),
      next: {
        revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE),
        tags: ['banner'],
      },
    },
  );

  const data = await response.json();
  const result = data?.data;

  // Save to cache
  await saveDataToCacheProps(cache, result, params, CACHE_ID);

  return result;
});

export default getBannersData;

import cache, {
  getCachedDataProps,
  saveDataToCacheProps,
} from 'grandus-lib/utils/cache';

import { cache as cacheReact } from 'react';
import { getWebInstanceRawPromise } from 'grandus-utils/fetches/promises/WebInstance';

const CACHE_ID = '/grandus-utils/fetches/ssr/WebInstance.jsx';

/**
 * React-cached web instance fetcher
 */
export const getWebInstancePromise = cacheReact(async () => {
  return getWebInstanceRawPromise();
});

/**
 * Get web instance data with Redis caching
 * @returns {Promise<Object>} Web instance configuration
 */
const getWebInstance = async () => {
  // Check Redis cache first
  const cachedData = await getCachedDataProps(cache, {}, CACHE_ID);

  if (cachedData && Object.keys(cachedData).length > 0) {
    return cachedData;
  }

  // Fetch fresh data
  const webinstance = await getWebInstancePromise();

  // Save to cache
  await saveDataToCacheProps(cache, webinstance, {}, CACHE_ID);

  return webinstance;
};

export default getWebInstance;

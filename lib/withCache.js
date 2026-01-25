/**
 * Cache wrapper utility
 * Eliminates repetitive cache check/save patterns across fetchers
 */

import cache, {
  getCachedDataProps,
  saveDataToCacheProps,
} from 'grandus-lib/utils/cache';

/**
 * Wrap a fetch function with caching logic
 * Automatically checks cache before fetching and saves result after
 *
 * @param {Function} fetchFn - Async function that fetches data
 * @param {string} cacheId - Unique cache identifier (usually file path)
 * @param {Object} options - Additional options
 * @param {boolean} options.extractData - Whether to extract .data from cached result (default: false)
 * @returns {Function} Wrapped function with caching
 */
export const withCache = (fetchFn, cacheId, options = {}) => {
  const { extractData = false } = options;

  return async (props = {}) => {
    // Skip cache if explicitly disabled
    if (props?.disableCache) {
      const data = await fetchFn(props);
      return extractData ? data?.data : data;
    }

    // Check cache first
    const cachedData = await getCachedDataProps(cache, props, cacheId);

    if (cachedData !== false && cachedData !== null && cachedData !== undefined) {
      // Handle isEmpty check - return cached if it has data
      if (typeof cachedData === 'object') {
        const hasData = Array.isArray(cachedData)
          ? cachedData.length > 0
          : Object.keys(cachedData).length > 0;

        if (hasData) {
          return extractData ? cachedData?.data : cachedData;
        }
      } else if (cachedData) {
        return extractData ? cachedData?.data : cachedData;
      }
    }

    // Fetch fresh data
    const data = await fetchFn(props);

    // Save to cache
    await saveDataToCacheProps(cache, data, props, cacheId);

    return extractData ? data?.data : data;
  };
};

/**
 * Create a cached fetcher with React cache + Redis cache (dual layer)
 * Used for frequently accessed data like categories, banners
 *
 * @param {Function} fetchFn - Async function that fetches data
 * @param {string} cacheId - Unique cache identifier
 * @param {Object} options - Options for caching behavior
 * @returns {Object} Object with getData (cached) and getDataDirect (uncached) functions
 */
export const createCachedFetcher = (fetchFn, cacheId, options = {}) => {
  const cachedFn = withCache(fetchFn, cacheId, options);

  return {
    getData: cachedFn,
    getDataDirect: fetchFn,
    cacheId,
  };
};

export default withCache;

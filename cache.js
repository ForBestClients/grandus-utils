import Redis from 'ioredis';

import {
  USER_CONSTANT,
  USER_WISHLIST_CONSTANT,
} from 'grandus-lib/constants/SessionConstants';

/**
 * Initialize Redis client based on environment configuration
 */
let client = null;

if (process.env.CACHE_ENABLED) {
  if (process.env.CACHE_USE_CLUSTER) {
    // Build cluster configuration from comma-separated host/port values
    const ports = (process.env.CACHE_PORT ?? '').split(',');
    const hosts = (process.env.CACHE_HOST ?? '').split(',');

    const clusterConfig = ports.map((port, index) => ({
      port,
      host: hosts[index],
    }));

    client = new Redis.Cluster(clusterConfig);
  } else {
    client = new Redis(
      process.env.CACHE_PORT ?? undefined,
      process.env.CACHE_HOST ?? undefined,
      { lazyConnect: true },
    );
  }
}

/**
 * Extract user access token from session
 * Returns 0 if user is not logged in (for consistent cache keys)
 *
 * @param {Object} req - Request object with session
 * @returns {string|number} Access token or 0
 */
const extractUserAccessToken = req => {
  const user = req?.session?.[USER_CONSTANT] ?? {};
  return user?.accessToken ?? 0;
};

/**
 * Initialized Redis client
 */
export default client;

/**
 * Generate unified cache KEY from provided array enriched with env prefix and suffix
 *
 * @param {Array} keyParts - parts which will be concated
 */
export const getCacheKey = (keyParts = []) => {
  return [
    process.env.CACHE_KEY_PREFIX ? process.env.CACHE_KEY_PREFIX : 'prefix',
    process.env.HOST ? process.env.HOST : 'undefined-host',
    ...keyParts,
    process.env.CACHE_KEY_SUFFIX ? process.env.CACHE_KEY_SUFFIX : 'suffix',
  ]
    .join('-')
    .replace(/ /gi, '--'); //regex to replace all occurances of ' '
};

/**
 * Generate unified cache KEY from request
 *
 * @param {Object} req - Request object
 * @returns {string} Cache key including URL and user token
 */
export const getCacheKeyByRequest = req => {
  return getCacheKey([req?.url ?? '/', extractUserAccessToken(req)]);
};

export const getCacheKeyByProps = props => {
  return getCacheKey(['props', JSON.stringify(props)]);
};

/**
 * Generate unified cache KEY by type
 *
 * @param {string} type - Cache type (webinstance, header, footer, custom, request, props, wishlist)
 * @param {Object} options - Options for cache key generation
 * @returns {string} Generated cache key
 */
export const getCacheKeyByType = (type = 'request', options = {}) => {
  switch (type) {
    case 'webinstance':
      return getCacheKey(['system-webinstance']);
    case 'header':
      return getCacheKey(['system-layout-header']);
    case 'footer':
      return getCacheKey(['system-layout-footer']);
    case 'custom': {
      const cacheParts = ['custom-key', ...(options?.cacheKeyParts ?? [])];
      if (options?.cacheKeyUseUser !== false) {
        cacheParts.push(extractUserAccessToken(options?.req ?? null));
      }
      return getCacheKey(cacheParts);
    }
    case 'request':
      return getCacheKeyByRequest(options?.req ?? null);
    case 'props':
      return getCacheKeyByProps(options);
    case 'wishlist':
      return getCacheKey([
        USER_WISHLIST_CONSTANT,
        extractUserAccessToken(options?.req ?? null),
      ]);
    default:
      return getCacheKey([`default-${type}`]);
  }
};

/**
 * Get data from Redis cache according to props
 *
 * @param {instance} cache sinstance of previosly initiated redis client
 * @param {object} options specified options which variate specific options
 */
export const getCachedDataProps = async (cache, props = {}, cacheId = '') => {
  return await getCachedData({}, cache, {
    cacheKeyType: 'props',
    cacheId: cacheId,
    ...props,
  });
};

/**
 * Get data from Redis cache
 *
 * @param {Object} req - Next.js request object
 * @param {Object} cache - Redis client instance
 * @param {Object} options - Cache options
 * @returns {Promise<Object|false>} Cached data or false if not found
 */
export const getCachedData = async (req, cache, options = {}) => {
  if (!cache) return false;

  const cacheKey = options?.cacheKey ??
    (getCacheKeyByType(options?.cacheKeyType, { req, ...options }) + getLocalSuffix(req));

  const data = await cache.get(cacheKey);

  if (!data) {
    return false;
  }

  return JSON.parse(data);
};

/**
 * Get data from Redis cache and output it to response
 * Used mainly by API routes
 *
 * @param {Object} req - Next.js request object
 * @param {Object} res - Next.js response object
 * @param {Object} cache - Redis client instance
 * @param {Object} options - Cache options
 * @returns {Promise<boolean>} True if cached data was returned, false otherwise
 */
export const outputCachedData = async (req, res, cache, options = {}) => {
  if (!cache) return false;

  const cachedData = await getCachedData(req, cache, options);
  if (cachedData === null || cachedData === false) return false;

  if (res !== null) {
    res.setHeader('Grandus-Cached-Data', true);
    res.status(200).json(cachedData);
  }
  return true;
};

/**
 * Save data to Redis cache according to props
 *
 * @param {instance} cache sinstance of previosly initiated redis client
 * @param {object} data data to be saved in cache
 * @param {object} options specified options which variate specific options
 */
export const saveDataToCacheProps = async (
  cache,
  data,
  props = {},
  cacheId = '',
) => {
  return await saveDataToCache({}, cache, data, {
    cacheKeyType: 'props',
    cacheId: cacheId,
    ...props,
  });
};

/**
 * Save data to Redis cache
 *
 * @param {Object} req - Next.js request object
 * @param {Object} cache - Redis client instance
 * @param {Object} data - Data to cache
 * @param {Object} options - Cache options including TTL
 * @returns {Promise<boolean>} False if cache not available
 */
export const saveDataToCache = async (req, cache, data, options = {}) => {
  if (!cache) return false;

  const cacheTime = options?.time ?? (process.env.CACHE_TIME ?? 60);

  const cacheKey = options?.cacheKey ??
    (getCacheKeyByType(options?.cacheKeyType, { req, ...options }) + getLocalSuffix(req));

  try {
    cache.set(cacheKey, JSON.stringify(data), 'EX', cacheTime);
  } catch (error) {
    console.error('Cache save error:', error);
  }
};

/**
 * Get locale suffix for cache key
 * @param {Object} req - Request object with cookies
 * @returns {string} Locale suffix or empty string
 */
const getLocalSuffix = req => {
  const locale = req?.cookies?.NEXT_LOCALE;
  return locale ? `.${locale}` : '';
};

/**
 * Centralized configuration
 * Single source of truth for environment variables and defaults
 */

/**
 * Get configuration value with fallback
 * @param {string} key - Environment variable key
 * @param {*} defaultValue - Default value if not set
 * @returns {*} Configuration value
 */
const getEnv = (key, defaultValue = undefined) => {
  return process.env[key] ?? defaultValue;
};

/**
 * Get numeric configuration value
 * @param {string} key - Environment variable key
 * @param {number} defaultValue - Default value if not set
 * @returns {number} Numeric configuration value
 */
const getEnvNumber = (key, defaultValue = 0) => {
  const value = process.env[key];
  return value !== undefined ? Number(value) : defaultValue;
};

/**
 * API Configuration
 */
export const apiConfig = {
  get host() {
    return getEnv('HOST_API');
  },
  get frontendHost() {
    return getEnv('HOST');
  },
  get ownerToken() {
    return getEnv('GRANDUS_TOKEN_OWNER');
  },
  get webinstanceToken() {
    return getEnv('GRANDUS_TOKEN_WEBINSTANCE');
  },
  get revalidateTime() {
    return getEnvNumber('NEXT_PUBLIC_REVALIDATE', 60);
  },
};

/**
 * Cache Configuration
 */
export const cacheConfig = {
  get enabled() {
    return !!getEnv('CACHE_ENABLED');
  },
  get useCluster() {
    return !!getEnv('CACHE_USE_CLUSTER');
  },
  get host() {
    return getEnv('CACHE_HOST');
  },
  get port() {
    return getEnv('CACHE_PORT');
  },
  get time() {
    return getEnvNumber('CACHE_TIME', 60);
  },
  get keyPrefix() {
    return getEnv('CACHE_KEY_PREFIX', 'prefix');
  },
  get keySuffix() {
    return getEnv('CACHE_KEY_SUFFIX', 'suffix');
  },
};

/**
 * Get API expand/fields configuration for specific type
 * @param {string} type - Configuration type (e.g., 'PRODUCT', 'CATEGORY')
 * @param {'EXPAND'|'FIELDS'} uriType - Type of configuration
 * @param {boolean} asUriPart - Whether to return as URI part (with key=)
 * @returns {string} Configuration value
 */
export const getApiConfig = (type, uriType = 'EXPAND', asUriPart = false) => {
  if (!type) return '';

  const key = `NEXT_PUBLIC_${type}_${uriType}`;
  const value = getEnv(key, '');

  if (!value) return '';

  return asUriPart ? `${uriType.toLowerCase()}=${value}` : value;
};

/**
 * Default fetch options for Next.js
 */
export const getDefaultFetchOptions = (additionalTags = []) => ({
  next: {
    revalidate: apiConfig.revalidateTime,
    ...(additionalTags.length > 0 && { tags: additionalTags }),
  },
});

/**
 * Request configuration helpers
 */
export const requestConfig = {
  get additionalFields() {
    return getEnv('NEXT_PUBLIC_REQUEST_ADDITIONAL_FIELDS', '');
  },
};

export default {
  api: apiConfig,
  cache: cacheConfig,
  request: requestConfig,
  getApiConfig,
  getDefaultFetchOptions,
};

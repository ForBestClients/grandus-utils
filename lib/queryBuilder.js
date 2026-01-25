/**
 * Query string builder utility
 * Replaces repetitive URI building patterns across fetchers
 */

/**
 * Build query string from object of parameters
 * Handles null/undefined values by skipping them
 *
 * @param {Object} params - Key-value pairs for query parameters
 * @param {Object} options - Additional options
 * @param {string} options.prefix - Prefix before query string (default: '?')
 * @param {boolean} options.encode - Whether to encode values (default: false)
 * @returns {string} Query string or empty string
 */
export const buildQueryString = (params = {}, options = {}) => {
  const { prefix = '?', encode = false } = options;

  const parts = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => {
      const encodedValue = encode ? encodeURIComponent(value) : value;
      return `${key}=${encodedValue}`;
    });

  return parts.length > 0 ? `${prefix}${parts.join('&')}` : '';
};

/**
 * Build query string and append to URL
 *
 * @param {string} baseUrl - Base URL
 * @param {Object} params - Query parameters
 * @param {Object} options - Options passed to buildQueryString
 * @returns {string} Complete URL with query string
 */
export const buildUrl = (baseUrl, params = {}, options = {}) => {
  const hasExistingQuery = baseUrl.includes('?');
  const queryOptions = {
    ...options,
    prefix: hasExistingQuery ? '&' : '?',
  };

  return `${baseUrl}${buildQueryString(params, queryOptions)}`;
};

/**
 * Create params object from props with conditional inclusion
 * Useful for building API query params from component props
 *
 * @param {Object} props - Source props object
 * @param {Array<string|[string, string]>} mappings - Array of prop names or [propName, queryName] tuples
 * @returns {Object} Filtered params object
 */
export const propsToParams = (props = {}, mappings = []) => {
  const params = {};

  for (const mapping of mappings) {
    const [propName, queryName] = Array.isArray(mapping) ? mapping : [mapping, mapping];
    const value = props?.[propName];

    if (value !== undefined && value !== null && value !== '') {
      params[queryName] = value;
    }
  }

  return params;
};

export default buildQueryString;

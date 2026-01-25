import { USER_CONSTANT } from 'grandus-lib/constants/SessionConstants';
import dayjs from 'dayjs';

/**
 * Extract query string from URL
 * @param {string} url - Full URL
 * @returns {string} Query string including '?' or empty string
 */
export const reqExtractUri = url => {
  const uriPosition = url.indexOf('?');
  return uriPosition > 0 ? url.slice(uriPosition) : '';
};

/**
 * Get host from request or environment
 * @param {Object} req - Request object
 * @returns {string} Host URL with protocol
 */
export const reqGetHost = req => {
  if (process.env.HOST) {
    return process.env.HOST;
  }

  const host = req?.headers?.host ?? '';
  const protocol = host.includes('localhost') ? 'http://' : 'https://';

  return protocol + host;
};

/**
 * Get API host from environment
 * @returns {string} API host URL
 */
export const reqApiHost = () => {
  return process.env.HOST_API;
};

/**
 * Get API expand/fields configuration
 * @param {string} type - Configuration type
 * @param {boolean} asUriPart - Include parameter name prefix
 * @param {string} uriType - Parameter type (EXPAND or FIELDS)
 * @returns {string} Configuration value
 */
export const getApiExpand = (type = '', asUriPart = false, uriType = 'EXPAND') => {
  if (!type) return '';

  const paramType = uriType || 'EXPAND';
  const expandPrepend = asUriPart ? `${paramType.toLowerCase()}=` : '';
  const expandData = process.env[`NEXT_PUBLIC_${type}_${paramType}`] ?? '';

  return expandPrepend + expandData;
};

/**
 * Get API fields configuration
 * @param {string} type - Configuration type
 * @param {boolean} asUriPart - Include parameter name prefix
 * @returns {string} Fields configuration value
 */
export const getApiFields = (type = '', asUriPart = false) => {
  return getApiExpand(type, asUriPart, 'FIELDS');
};

/**
 * Get headers for frontend forwarding
 * @param {Object} req - Request object
 * @param {Object} options - Options with forwardUrl
 * @returns {Object} Headers object
 */
export const reqGetHeadersFront = (req, options = {}) => {
  return {
    ...req?.headers,
    host: req?.headers?.host,
    'grandus-frontend-url': options?.forwardUrl ?? req?.url,
  };
};

/**
 * Extract frontend URL from headers (case-insensitive)
 * @param {Object} headers - Headers object
 * @returns {string|undefined} Frontend URL
 */
export const getFrontendUrlFromHeaders = headers => {
  return headers?.['Grandus-Frontend-Url'] ?? headers?.['grandus-frontend-url'];
};

/**
 * Build request headers with authentication
 * @param {Object} req - Request object with session and cookies
 * @returns {Object} Complete headers object
 */
export const reqGetHeaders = req => {
  const result = {
    'Content-Type': 'application/json',
    'Owner-Token': process.env.GRANDUS_TOKEN_OWNER,
    'Webinstance-Token': process.env.GRANDUS_TOKEN_WEBINSTANCE,
  };

  // Add locale if present
  const locale = req?.cookies?.NEXT_LOCALE;
  if (locale) {
    result['Accept-Language'] = locale;
  }

  // Forward URI from headers
  const uriToForward = getFrontendUrlFromHeaders(req?.headers);
  if (uriToForward) {
    const removedProtocol = uriToForward
      .replace('http://', '')
      .replace('https://', '');

    result.URI = removedProtocol.replace(req?.headers?.host ?? '', '');
  }

  // Return early if no session
  if (!req?.session) return result;

  // Add authorization if user has access token
  const user = req.session?.[USER_CONSTANT];
  if (user?.accessToken) {
    result.Authorization = `Bearer ${user.accessToken}`;
  }

  // Process additional fields from environment
  const additionalFieldsEnv = process.env.NEXT_PUBLIC_REQUEST_ADDITIONAL_FIELDS;
  if (!additionalFieldsEnv) return result;

  const additionalFields = additionalFieldsEnv.split(',');
  const session = req.session ?? {};

  for (const field of additionalFields) {
    const [key, sessionPath] = field.split('|');
    if (!key) continue;

    // Get value from session using the path (or key if no path specified)
    const pathToUse = sessionPath ?? key;
    const value = session?.[pathToUse];

    if (value) {
      result[key] = value;
    }
  }

  return result;
};

/**
 * Get number of decimal places in a number
 * @param {number|string} number - Number to analyze
 * @returns {number} Number of decimal places
 */
export const getTheNumberOfDecimals = number => {
  const numberParsed = Number(number);

  if (Number.isInteger(numberParsed) || !number) {
    return 0;
  }

  const decimalStr = number.toString().split('.')[1] ?? '';
  return decimalStr.length;
};

/**
 * Format date using dayjs
 * @param {string} date - Date string
 * @param {string} dateTemplate - Output format template
 * @returns {string} Formatted date
 */
export const getFormatDate = (date, dateTemplate) => {
  return dayjs(date, 'YYYY-MM-DDTHH:mm:ss').format(dateTemplate);
};

/**
 * Base API Fetcher
 * Standardized fetch wrapper with consistent error handling and options
 */

import { reqGetHeaders, reqApiHost } from 'grandus-lib/utils';
import { apiConfig, getDefaultFetchOptions } from './config.js';
import { buildUrl } from './queryBuilder.js';

/**
 * Standard API error class
 */
export class ApiError extends Error {
  constructor(message, status, endpoint) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.endpoint = endpoint;
  }
}

/**
 * Handle fetch response
 * @param {Response} response - Fetch response
 * @param {string} endpoint - API endpoint for error context
 * @returns {Promise<Object>} Parsed JSON response
 */
const handleResponse = async (response, endpoint) => {
  if (!response.ok) {
    // Log error for debugging but don't throw to maintain backwards compatibility
    console.error(`API Error: ${response.status} at ${endpoint}`);
  }

  try {
    return await response.json();
  } catch (error) {
    console.error(`JSON Parse Error at ${endpoint}:`, error);
    return {};
  }
};

/**
 * Create base request configuration
 * @param {Object} req - Request object with cookies/headers
 * @returns {Object} Headers configuration
 */
const createRequestConfig = (req = {}) => ({
  headers: reqGetHeaders(req),
});

/**
 * Make API GET request
 *
 * @param {string} endpoint - API endpoint (e.g., '/api/v2/products')
 * @param {Object} options - Request options
 * @param {Object} options.params - Query parameters
 * @param {Object} options.req - Request object with cookies
 * @param {Array} options.tags - Cache tags for Next.js
 * @param {boolean} options.extractData - Extract .data from response (default: true)
 * @param {Object} options.headers - Additional headers
 * @returns {Promise<*>} Response data
 */
export const apiGet = async (endpoint, options = {}) => {
  const {
    params = {},
    req = {},
    tags = [],
    extractData = true,
    headers: additionalHeaders = {},
  } = options;

  // Build request object with cookies if provided
  const requestObj = { ...req };
  if (options.cookies) {
    requestObj.cookies = options.cookies;
  }

  const baseUrl = `${reqApiHost(requestObj)}${endpoint}`;
  const url = buildUrl(baseUrl, params);

  const fetchOptions = {
    ...createRequestConfig(requestObj),
    ...getDefaultFetchOptions(tags),
    headers: {
      ...createRequestConfig(requestObj).headers,
      ...additionalHeaders,
    },
  };

  try {
    const response = await fetch(url, fetchOptions);
    const data = await handleResponse(response, endpoint);

    return extractData ? data?.data : data;
  } catch (error) {
    console.error(`Fetch Error at ${endpoint}:`, error.message);
    return extractData ? undefined : {};
  }
};

/**
 * Make API POST request
 *
 * @param {string} endpoint - API endpoint
 * @param {Object} body - Request body
 * @param {Object} options - Request options (same as apiGet)
 * @returns {Promise<*>} Response data
 */
export const apiPost = async (endpoint, body = {}, options = {}) => {
  const {
    params = {},
    req = {},
    tags = [],
    extractData = true,
    headers: additionalHeaders = {},
  } = options;

  const requestObj = { ...req };
  if (options.cookies) {
    requestObj.cookies = options.cookies;
  }

  const baseUrl = `${reqApiHost(requestObj)}${endpoint}`;
  const url = buildUrl(baseUrl, params);

  const fetchOptions = {
    method: 'POST',
    ...createRequestConfig(requestObj),
    ...getDefaultFetchOptions(tags),
    body: JSON.stringify(body),
    headers: {
      ...createRequestConfig(requestObj).headers,
      ...additionalHeaders,
    },
  };

  try {
    const response = await fetch(url, fetchOptions);
    const data = await handleResponse(response, endpoint);

    return extractData ? data?.data : data;
  } catch (error) {
    console.error(`Fetch Error at ${endpoint}:`, error.message);
    return extractData ? undefined : {};
  }
};

/**
 * Create a typed fetcher for specific endpoint
 * Factory function to create reusable fetchers
 *
 * @param {string} endpoint - API endpoint
 * @param {Object} defaultOptions - Default options for all requests
 * @returns {Function} Configured fetcher function
 */
export const createFetcher = (endpoint, defaultOptions = {}) => {
  return async (params = {}, options = {}) => {
    const mergedOptions = { ...defaultOptions, ...options, params };
    return apiGet(endpoint, mergedOptions);
  };
};

/**
 * Create a POST fetcher for specific endpoint
 *
 * @param {string} endpoint - API endpoint
 * @param {Object} defaultOptions - Default options for all requests
 * @returns {Function} Configured POST fetcher function
 */
export const createPostFetcher = (endpoint, defaultOptions = {}) => {
  return async (body = {}, params = {}, options = {}) => {
    const mergedOptions = { ...defaultOptions, ...options, params };
    return apiPost(endpoint, body, mergedOptions);
  };
};

export default {
  get: apiGet,
  post: apiPost,
  createFetcher,
  createPostFetcher,
  ApiError,
};

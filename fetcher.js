/**
 * Error handler for fetch responses
 * @param {Response} res - Fetch response
 * @throws {Error} With appropriate message based on status
 */
const handleError = (res) => {
  const errorMessages = {
    404: 'Not found',
    401: 'Unauthorized',
    403: 'Forbidden',
    500: 'Server error',
  };

  throw new Error(errorMessages[res.status] ?? `HTTP error ${res.status}`);
};

/**
 * Generic fetcher with error handling
 * Extracts .data from response automatically
 *
 * @param {string} url - URL to fetch
 * @param {Object} options - Fetch options
 * @returns {Promise<*>} Response data
 */
const fetcher = (url, options) => {
  return fetch(url, options)
    .then((res) => {
      if (!res.ok) {
        handleError(res);
      }
      return res.json();
    })
    .then(res => res?.data);
};

export default fetcher;
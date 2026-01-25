import useSWR from 'swr';

/**
 * Hook for fetching products by IDs
 * Maintains order of products as specified in productIds array
 *
 * @param {Array<number|string>} productIds - Array of product IDs to fetch
 * @param {number|false} limit - Optional limit for results
 * @returns {Object} Products data with loading states
 */
const useProducts = (productIds, limit = false) => {
  const hasProductIds = productIds?.length > 0;
  const productsUrl = hasProductIds
    ? `productIds=${productIds.join('&productIds=')}`
    : null;

  const { data, isLoading, isValidating } = useSWR(
    productsUrl
      ? `/api/lib/v1/products?${productsUrl}&fields=parameters,store,ean&perPage=${
          limit || productIds.length
        }`
      : null,
    url => fetch(url).then(r => r.json()),
    {
      revalidateOnReconnect: false,
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    },
  );

  // Map product IDs to products, maintaining order, filter out undefined
  const products = (productIds ?? [])
    .map(productId => data?.products?.find(p => p.id === Number(productId)))
    .filter(Boolean);

  const productsData = products.length > 0
    ? { products, pagination: data?.pagination }
    : null;

  return {
    data: productsData,
    isLoading,
    isValidating,
  };
};

export default useProducts;

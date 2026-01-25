import { useState } from 'react';
import useSWR from 'swr';

/**
 * Hook for managing recently viewed products
 * Provides methods to check and add items to recently viewed list
 *
 * @returns {Object} Recently viewed state and methods
 */
const useRecentlyViewed = () => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    data: recentlyViewed,
    mutate,
    isValidating,
  } = useSWR(
    `/api/lib/v1/recentlyViewed`,
    url => fetch(url).then(r => r.json()),
    {
      revalidateOnReconnect: false,
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    },
  );

  /**
   * Check if product exists in recently viewed
   * @param {number|string} productId - Product ID to check
   * @returns {boolean} True if product is in recently viewed
   */
  const itemExists = productId => {
    const productIds = recentlyViewed?.productIds ?? [];
    return productIds.some(id => id == productId);
  };

  /**
   * Add product to recently viewed
   * @param {number|string} productId - Product ID to add
   */
  const itemAdd = async productId => {
    setIsLoading(true);
    try {
      const result = await fetch(`/api/lib/v1/recentlyViewed/items/${productId}`, {
        method: 'POST',
      }).then(res => res.json());

      await mutate(result, false);
    } catch (error) {
      console.error('Failed to add to recently viewed:', error);
    }
    setIsLoading(false);
  };

  return {
    recentlyViewed,
    mutateRecentlyViewed: mutate,
    isLoading: isValidating || isLoading,
    itemAdd,
    itemExists,
  };
};

export default useRecentlyViewed;

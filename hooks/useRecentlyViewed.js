import { useState } from 'react';
import useSWR from 'swr';
import get from 'lodash/get';

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

  const itemExists = productId => {
    return (
      get(recentlyViewed, 'productIds', []).findIndex(
        element => element === productId,
      ) >= 0
    );
  };

  const itemAdd = async (productId, callback) => {
    setIsLoading(true);
    try {
      await mutate(
        await fetch(`/api/lib/v1/recentlyViewed/items/${productId}`, {
          method: 'POST',
        })
          .then(result => result.json())
          .then(result => {
            return result;
          }),
        false,
      );
    } catch (error) {
      console.error('An unexpected error happened:', error);
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

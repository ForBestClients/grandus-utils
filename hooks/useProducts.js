import useSWR from 'swr';
import isEmpty from 'lodash/isEmpty';

const useProducts = (productIds, limit = false) => {
  const productsUrl = !isEmpty(productIds)
    ? `productIds=${productIds.join('&productIds=')}`
    : false;

  return useSWR(
    productsUrl
      ? `/api/lib/v1/products?${productsUrl}&fields=parameters,store,ean&perPage=${
          limit ? limit : productIds.length
        }`
      : null,
    url => fetch(url).then(r => r.json()),
    {
      revalidateOnReconnect: false,
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    },
  );
};

export default useProducts;

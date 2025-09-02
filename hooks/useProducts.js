import useSWR from 'swr';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import find from 'lodash/find';
import filter from 'lodash/filter';
import toInteger from 'lodash/toInteger';

const useProducts = (productIds, limit = false) => {
  const productsUrl = !isEmpty(productIds)
    ? `productIds=${productIds.join('&productIds=')}`
    : false;

  const {
    data,
    isLoading,
    isValidating,
  } = useSWR(
    productsUrl
      ? `/cz/api/lib/v1/products?${productsUrl}&fields=parameters,store,ean&perPage=${
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

  const productsArray = map(productIds, (productId) => {
    return find(data?.products, ['id', toInteger(productId)]);
  });

  const products = filter(productsArray);

  const productsData = !isEmpty(products)
    ? {
      products,
      pagination: data.pagination,
    }
    : null;

  return {
    data: productsData,
    isLoading,
    isValidating,
  };
};

export default useProducts;

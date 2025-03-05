"use clients"

import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import useSWR from 'swr';
import { hasActiveFilters, arrayToPath } from '@/grandus-utils/filter';
import { get } from 'lodash';
import { useRouter } from 'next/navigation';

const useFilter = ({
  category = null,
  search = null,
  parameters = [],
  options = {},
  useDataFromRouter = false,
  fields = null,
  allProducts = false,
  enabled = true,
} = {}) => {
  const router = useRouter();
  let uri = [];

  if (useDataFromRouter) {
    map(get(router, 'query'), (uriPart, index) => {
      switch (index) {
        case 'category':
          uri.push(`id=${uriPart}`);
          break;
        case 'term':
          uri.push(`search=${uriPart}`);
          break;
        case 'parameters':
          uri.push(`param=${arrayToPath(uriPart)}`);
          break;

        default:
          uri.push(`${index}=${uriPart}`);
          break;
      }
    });
  } else {
    if (!isEmpty(parameters)) {
      uri.push(`param=${arrayToPath(parameters)}`);
    }

    if (category) {
      uri.push(`id=${category}`);
    }

    if (search) {
      uri.push(`search=${search}`);
    }

    if (fields) {
      uri.push(`fields=${fields}`);
    }
  }

  const filterRoute = allProducts ? 'filters/all' : 'filters';
  const url = `/api/lib/v1/${filterRoute}?${uri.join('&')}`;

  const {
    data: filter,
    mutate,
    isValidating,
  } = useSWR(enabled ? url : false, url => fetch(url).then(r => r.json()), {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    shouldRetryOnError: true,
    ...options,
  });

  return {
    filter,
    hasActiveFilters: hasActiveFilters(filter),
    mutateFilter: mutate,
    isLoading: isValidating,
  };
};

export default useFilter;

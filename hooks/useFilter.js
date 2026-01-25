import useSWR from 'swr';
import { RESERVED_URI_PARTS } from 'grandus-lib/constants/UrlConstants';
import { CATEGORY_PARAMETERS_SHOW_LIMIT } from 'grandus-lib/constants/AppConstants';
import { useRouter } from 'next/navigation';

/**
 * Sort chunks by first element (currently disabled)
 */
const sortChunks = chunks => chunks;

/**
 * Get SEO title data from filter selections
 * @param {Object} filter - Filter object with selected values
 * @returns {Array<string>} Array of selected filter names/values
 */
export const getSeoTitleData = (filter = {}) => {
  const titleData = [];
  const selected = filter?.selected ?? {};

  // Extract names from stores
  (selected.stores?.data ?? []).forEach(store => {
    if (store?.name) titleData.push(store.name);
  });

  // Extract names from brands
  (selected.brands?.data ?? []).forEach(brand => {
    if (brand?.name) titleData.push(brand.name);
  });

  // Extract names from store locations
  (selected.storeLocations?.data ?? []).forEach(store => {
    if (store?.name) titleData.push(store.name);
  });

  // Extract names from statuses
  (selected.statuses?.data ?? []).forEach(status => {
    if (status?.name) titleData.push(status.name);
  });

  // Extract parameter values
  (selected.parameters?.data ?? []).forEach(parameter => {
    (parameter?.values ?? []).forEach(value => {
      if (value?.value) titleData.push(value.value);
    });
  });

  return titleData;
};

/**
 * Check if filter has any active selections (excluding category)
 * @param {Object} filter - Filter object
 * @returns {boolean} True if has active filters
 */
export const hasActiveFilters = (filter = {}) => {
  const selected = filter?.selected ?? {};
  const keys = Object.keys(selected).filter(key => key !== 'category');
  return keys.length > 0 && keys.some(key => {
    const value = selected[key];
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object' && value !== null) return Object.keys(value).length > 0;
    return !!value;
  });
};

/**
 * Convert params object to API body format
 * @param {Object} params - URL parameters
 * @returns {Object} API body object
 */
export const getApiBodyFromParams = (params = {}) => {
  if (!params) return {};

  const newParams = { ...params };
  const apiBody = {};

  // Process reserved URI parts
  RESERVED_URI_PARTS.forEach(reserved => {
    const identifiedReserved = newParams[reserved.urlTitle] ?? newParams[reserved.key];

    if (identifiedReserved) {
      if (Array.isArray(reserved.key)) {
        reserved.key.forEach((key, index) => {
          apiBody[key] = identifiedReserved?.[index];
        });
        delete newParams[reserved.urlTitle];
      } else {
        apiBody[reserved.key] = Array.isArray(identifiedReserved)
          ? identifiedReserved.map(ir => decodeURIComponent(ir))
          : [decodeURIComponent(identifiedReserved)];
        delete newParams[reserved.urlTitle];
        delete newParams[reserved.key];
      }
    }
  });

  // Process remaining params
  apiBody.param = {};
  Object.entries(newParams).forEach(([key, item]) => {
    if (item) {
      apiBody.param[key] = Array.isArray(item)
        ? item.map(i => decodeURIComponent(i))
        : [decodeURIComponent(item)];
    }
  });

  return apiBody;
};

/**
 * Convert path to API body
 * @param {string} path - URL path
 * @returns {Object} API body object
 */
export const getApiBodyFromPath = path => {
  return getApiBodyFromParams(pathToParams(path));
};

/**
 * Transform query object with changes and deletions
 * @param {Object} query - Original query
 * @param {Object} dataToChange - Data to merge
 * @param {Array<string>} toDelete - Keys to delete
 * @returns {Object} New query object
 */
export const queryToQuery = (
  query,
  dataToChange = {},
  toDelete = ['parameters', 'category'],
) => {
  const newQuery = { ...query, ...dataToChange };

  if (toDelete?.length > 0) {
    toDelete.forEach(key => delete newQuery[key]);
  }

  return newQuery;
};

/**
 * Convert query object to query string
 * @param {Object} query - Query object
 * @param {Object} dataToChange - Data to merge
 * @param {Array<string>} toDelete - Keys to delete
 * @param {Object} options - Options for encoding and key replacement
 * @returns {string} Query string
 */
export const queryToQueryString = (
  query,
  dataToChange = {},
  toDelete = ['parameters', 'category'],
  options = {},
) => {
  const queryAdjusted = queryToQuery(
    query,
    typeof dataToChange === 'object' && dataToChange !== null ? dataToChange : {},
    Array.isArray(toDelete) ? toDelete : [],
  );

  return Object.entries(queryAdjusted)
    .map(([key, value]) => {
      const finalKey = options?.replace?.[key] ?? key;
      const finalValue = options?.encode ? encodeURIComponent(value) : value;
      return `${finalKey}=${finalValue}`;
    })
    .join('&');
};

/**
 * Get category link attributes from router
 * @param {Object} router - Next.js router
 * @param {Object} options - Link options
 * @returns {Object} Link attributes
 */
export const getCategoryLinkAttributesFromRouter = (router, options = {}) => {
  return getCategoryLinkAttributes(
    router?.query?.category,
    arrayToPath(router?.query?.parameters ?? []),
    router.query,
    options,
  );
};

/**
 * Get category link attributes
 * @param {string} category - Category slug
 * @param {string} parameters - Filter parameters path
 * @param {Object} query - Query object
 * @param {Object} options - Link options
 * @returns {Object} Link attributes with href and as
 */
export const getCategoryLinkAttributes = (
  category,
  parameters = '',
  query = {},
  options = {},
) => {
  if (options?.absoluteHref) {
    return { href: options.absoluteHref };
  }

  const emptyResult = {
    href: { pathname: `/`, query: {} },
    as: { pathname: `/`, query: {} },
  };

  if (!category || typeof category !== 'string') {
    return emptyResult;
  }

  const newQuery = options?.toDelete
    ? queryToQuery(query, options?.dataToChange ?? {}, options.toDelete)
    : queryToQuery(query, options?.dataToChange ?? {});

  return {
    href: {
      pathname: `/kategoria/[category]/[[...parameters]]`,
      query: newQuery,
    },
    as: {
      pathname: `/kategoria/${category}/${parameters}`,
      query: newQuery,
    },
  };
};

/**
 * Get campaign link attributes from router
 */
export const getCampaignLinkAttributesFromRouter = (router, options = {}) => {
  return getCampaignLinkAttributes(
    router?.query?.campaign,
    arrayToPath(router?.query?.parameters ?? []),
    router.query,
    options,
  );
};

/**
 * Get search link attributes from router
 */
export const getSearchLinkAttributesFromRouter = (router, options = {}) => {
  return getSearchLinkAttributes(
    encodeURIComponent(router?.query?.term ?? ''),
    arrayToPath(router?.query?.parameters ?? []),
    router.query,
    options,
  );
};

/**
 * Get campaign link attributes
 */
export const getCampaignLinkAttributes = (
  campaign,
  parameters = '',
  query = {},
  options = {},
) => {
  const newQuery = options?.toDelete
    ? queryToQuery(query, options?.dataToChange ?? {}, options.toDelete)
    : queryToQuery(query, options?.dataToChange ?? {});

  return {
    href: {
      pathname: `/akcie/[campaign]/[[...parameters]]`,
      query: newQuery,
    },
    as: {
      pathname: `/akcie/${campaign}/${parameters}`,
      query: newQuery,
    },
  };
};

/**
 * Get system filter attributes for reserved filter types
 */
export const getSystemFilterAttributes = (data, key, options = {}) => {
  const reservedPart = RESERVED_URI_PARTS.find(r => r.key === key);

  return {
    parameter: {
      id: key,
      name: options?.name ?? reservedPart?.title ?? key,
      urlTitle: reservedPart?.urlTitle ?? key,
      values: data,
    },
    handleChange: options?.handleChange,
    selected: options?.selected,
    options: {
      styles: options?.styles ?? {},
      ...getShowMoreAttributes(
        { id: key, values: data },
        options?.openedParameter,
        options?.onClickToggleOpen,
      ),
      ...options,
    },
  };
};

/**
 * Get show more attributes for filter parameters
 */
export const getShowMoreAttributes = (
  parameter,
  opened,
  onClickToggleOpen,
  options = {},
) => {
  const values = parameter?.values ?? [];
  const limit = options?.parametersShowLimit ?? CATEGORY_PARAMETERS_SHOW_LIMIT;

  return {
    showMoreEnabled: values.length > limit,
    showMoreActive: !(opened ?? []).includes(parameter?.id),
    showMoreLimit: limit,
    showMoreToggle: onClickToggleOpen,
  };
};

/**
 * Get search link attributes
 */
export const getSearchLinkAttributes = (
  searchTerm,
  parameters = '',
  query = {},
  options = {},
) => {
  const newQuery = options?.toDelete
    ? queryToQuery(query, options?.dataToChange ?? {}, options.toDelete)
    : queryToQuery(query, options?.dataToChange ?? {});

  return {
    href: {
      pathname: `/vyhladavanie/[term]/[[...parameters]]`,
      query: newQuery,
    },
    as: {
      pathname: `/vyhladavanie/${searchTerm}/${parameters}`,
      query: newQuery,
    },
  };
};

/**
 * Split array into pairs and convert to params object
 * @param {Array} array - Array of key/value pairs
 * @returns {Object} Params object
 */
export const arrayToParams = array => {
  if (!array?.length) return {};

  // Map values with encoding, then chunk into pairs
  const mapped = array.map(value =>
    value.split(',').map(val => encodeURIComponent(val))
  );

  // Chunk into pairs of 2
  const chunks = [];
  for (let i = 0; i < mapped.length; i += 2) {
    chunks.push(mapped.slice(i, i + 2));
  }

  // Sort and convert to object
  const sorted = sortChunks(chunks);
  return Object.fromEntries(sorted.filter(pair => pair.length === 2));
};

/**
 * Convert path to params object
 * @param {string} path - URL path
 * @returns {Object} Params object
 */
export const pathToParams = path => {
  if (!path) return {};
  return arrayToParams(path.split('/'));
};

/**
 * Convert array to URL path
 * @param {Array} array - Array of values
 * @returns {string} URL path
 */
export const arrayToPath = array => {
  if (!array?.length) return '';

  // Chunk into pairs of 2
  const chunks = [];
  for (let i = 0; i < array.length; i += 2) {
    chunks.push(array.slice(i, i + 2));
  }

  return sortChunks(chunks).flat().join('/');
};

/**
 * Convert params object to URL path
 * @param {Object} params - Params object
 * @returns {string} URL path
 */
export const paramsToPath = params => {
  const array = Object.entries(params ?? {}).flatMap(([key, value]) => [key, value]);
  return arrayToPath(array);
};

/**
 * Filter hook for managing product filters
 * Fetches filter data from API based on category, search, and parameters
 *
 * @param {Object} config - Hook configuration
 * @returns {Object} Filter state and methods
 */
const useFilter = ({
  category = null,
  search = null,
  parameters = [],
  options = {},
  useDataFromRouter = false,
  fields = null,
  allProducts = false,
  enabled = true,
  marketingCampaign = false,
} = {}) => {
  const router = useRouter();
  const uri = [];

  if (useDataFromRouter) {
    const query = router?.query ?? {};
    Object.entries(query).forEach(([index, uriPart]) => {
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
    if (parameters?.length > 0) {
      uri.push(`param=${arrayToPath(parameters)}`);
    }

    if (category) {
      uri.push(`id=${category}`);
    }

    if (search) {
      uri.push(`search=${search}`);
    }

    if (marketingCampaign) {
      uri.push(`marketingCampaign=${marketingCampaign}`);
    }

    if (fields) {
      uri.push(`fields=${fields}`);
    }
  }

  const filterRoute = allProducts ? 'filters/all' : 'filters';
  const url = `/api/lib/v1/${filterRoute}?${uri.join('&')}`;

  const { data: filter, mutate, isValidating } = useSWR(
    enabled ? url : null,
    url => fetch(url).then(r => r.json()),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: true,
      ...options,
    },
  );

  return {
    filter,
    hasActiveFilters: hasActiveFilters(filter),
    mutateFilter: mutate,
    isLoading: isValidating,
  };
};

export default useFilter;

import { reqGetHeaders, reqApiHost } from 'grandus-lib/utils';

import cache, {
  getCachedDataProps,
  saveDataToCacheProps,
} from 'grandus-lib/utils/cache';

import { cache as cacheReact } from 'react';

const CACHE_ID = '/grandus-utils/fetches/ssr/StaticBlocks.jsx';

/**
 * Check if data has content
 */
const hasData = data => {
  if (!data) return false;
  if (Array.isArray(data)) return data.length > 0;
  if (typeof data === 'object') return Object.keys(data).length > 0;
  return !!data;
};

/**
 * React-cached static blocks fetcher
 */
export const getStaticBlocksPromise = cacheReact(async props => {
  const req = props?.cookies ? { cookies: props.cookies } : {};

  // Build query params
  const queryParams = [];

  if (props?.hash) {
    queryParams.push(`hash=${encodeURIComponent(props.hash)}`);
  }

  if (props?.group) {
    queryParams.push(`group=${encodeURIComponent(props.group)}`);
  }

  if (props?.fields) {
    queryParams.push(`fields=${props.fields}`);
  }

  if (props?.perPage !== false) {
    queryParams.push(`per-page=${props?.perPage ?? '999'}`);
  }

  if (props?.expand !== false) {
    queryParams.push(`expand=${props?.expand ?? 'url,customCss,customJavascript'}`);
  }

  const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

  const response = await fetch(
    `${reqApiHost()}/api/v2/static-blocks${queryString}`,
    {
      headers: reqGetHeaders(req),
      next: { revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE) },
    },
  );

  return response.json();
});

/**
 * Get static blocks with Redis caching
 * @param {Object} props - Query parameters
 * @returns {Promise<Object>} Static blocks data
 */
const getStaticBlocks = async props => {
  const cachedData = await getCachedDataProps(cache, props, CACHE_ID);

  if (hasData(cachedData)) {
    return cachedData;
  }

  const staticBlocks = await getStaticBlocksPromise(props);

  await saveDataToCacheProps(cache, staticBlocks, props, CACHE_ID);

  return staticBlocks;
};

export default getStaticBlocks;

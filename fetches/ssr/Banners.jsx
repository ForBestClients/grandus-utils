import { reqGetHeaders, reqApiHost } from 'grandus-lib/utils';

import cache, {
  getCachedDataProps,
  saveDataToCacheProps,
} from 'grandus-lib/utils/cache';

import { cache as cacheReact } from 'react';

import isEmpty from 'lodash/isEmpty';
import join from 'lodash/join';

const getBannersData = cacheReact(async params => {
  const cachedData = await getCachedDataProps(
    cache,
    params,
    '/grandus-utils/fetches/ssr/Banners.jsx',
  );

  if (!isEmpty(cachedData)) {
    return cachedData;
  }

  const req = {};

  if(params?.cookies) {
    req.cookies = params?.cookies
  }

  let uri = [];

  if (params?.type) {
    uri.push('type=' + params?.type);
  }

  if (params?.propertyId) {
    uri.push('propertyId=' + params?.propertyId);
  }
  if(params?.limit) {
    uri.push('limit=' + params?.limit);
  }

  if (params?.extend) {
    uri.push('extend=' + params?.extend);
  }

  const result = await fetch(
    `${reqApiHost(req)}/api/v2/banners${
      isEmpty(uri) ? '' : '?v=2&' + join(uri, '&')
    }`,
    {
      headers: reqGetHeaders(req),
      next: {
        revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE),
        tags: ['banner'],
      },
    },
  )
    .then(result => result.json())
    .then(r => r?.data);

  await saveDataToCacheProps(
    cache,
    result,
    params,
    '/grandus-utils/fetches/ssr/Banners.jsx',
  );

  return result;
});

export default getBannersData;

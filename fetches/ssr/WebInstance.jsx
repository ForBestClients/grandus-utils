import { reqApiHost, reqGetHeadersBasic } from 'grandus-lib/utils/edge';

import cache, {
  getCachedDataProps,
  saveDataToCacheProps,
} from 'grandus-lib/utils/cache';

import { cache as cacheReact } from 'react';

import isEmpty from 'lodash/isEmpty';

export const getWebInstancePromise = cacheReact(async () => {
  const req = {};

  return fetch(
    `${reqApiHost(req)}/api/web-instance?id=${process.env.GRANDUS_TOKEN_HOST}`,
    {
      headers: reqGetHeadersBasic(req),
      next: { revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE) },
    },
  )
    .then(result => result.json())
    .then(r => r?.webInstance);
});

const getWebInstance = async () => {
  const cachedData = await getCachedDataProps(
    cache,
    {},
    '/grandus-utils/fetches/ssr/WebInstance.jsx',
  );

  if (!isEmpty(cachedData)) {
    return cachedData;
  }

  const webinstance = await getWebInstancePromise();

  await saveDataToCacheProps(
    cache,
    webinstance,
    {},
    '/grandus-utils/fetches/ssr/WebInstance.jsx',
  );

  return webinstance;
};

export default getWebInstance;

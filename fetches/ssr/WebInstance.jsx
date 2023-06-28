import cache, {
  getCachedDataProps,
  saveDataToCacheProps,
} from 'grandus-lib/utils/cache';

import { cache as cacheReact } from 'react';

import isEmpty from 'lodash/isEmpty';
import { getWebInstanceRawPromise } from 'grandus-utils/fetches/promises/WebInstance';

export const getWebInstancePromise = cacheReact(async () => {
  return getWebInstanceRawPromise();
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

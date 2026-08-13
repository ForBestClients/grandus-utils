import { reqGetHeaders, reqApiHost } from 'grandus-lib/utils';

import cache, {
  getCachedDataProps,
  saveDataToCacheProps,
} from 'grandus-lib/utils/cache';

import { cache as cacheReact } from 'react';

import isEmpty from 'lodash/isEmpty';
import { getRequestContext, getContextLocale } from 'grandus-utils/context';

export const getStaticsDataPromise = cacheReact(async props => {
  const req = getRequestContext(props);

  const uri = [];

  if (props?.location) {
    uri.push(`location=${props?.location}`);
  }

  if (props?.fields) {
    uri.push(`fields=${props?.location}`);
  }

  if (props?.expand) {
    uri.push(`expand=${props?.expand}`);
  } else {
    uri.push(`expand=content,customCss,customJavascript`);
  }

  return fetch(
    `${reqApiHost(req)}/api/v2/pages${props?.id ? `/${props?.id}` : ''}${
      !isEmpty(uri) ? `?${uri.join('&')}` : ''
    }`,
    {
      headers: reqGetHeaders(req),
      next: { revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE) },
    },
  ).then(result => result.json());
});

const revalidateCache = async props => {
  const data = await getStaticsDataPromise(props);
  // cacheId musí sedieť s čítaním v getStaticsData – bez neho sa zapisovalo
  // pod iný kľúč, než sa číta, takže revalidate nikdy nikto neprečítal.
  saveDataToCacheProps(
    cache,
    data,
    props,
    '/grandus-utils/fetches/ssr/Statics.jsx',
    getContextLocale(props),
  );
};

export const getStaticsData = async props => {
  if (props?.disableCache) {
    return getStaticsDataPromise(props);
  }

  const cachedData = await getCachedDataProps(
    cache,
    props,
    '/grandus-utils/fetches/ssr/Statics.jsx',
    getContextLocale(props),
  );

  if (!isEmpty(cachedData)) {
    return cachedData;
  }

  const data = await getStaticsDataPromise(props);

  await saveDataToCacheProps(
    cache,
    data,
    props,
    '/grandus-utils/fetches/ssr/Statics.jsx',
    getContextLocale(props),
  );

  return data;
};

const getStatics = async props => {
  const staticData = await getStaticsData(props);

  return staticData?.data;
};

export default getStatics;

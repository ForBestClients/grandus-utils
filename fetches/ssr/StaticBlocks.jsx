import { reqGetHeaders, reqApiHost } from 'grandus-lib/utils';

import cache, {
  getCachedDataProps,
  saveDataToCacheProps,
} from 'grandus-lib/utils/cache';

import { cache as cacheReact } from 'react';

import isEmpty from 'lodash/isEmpty';

export const getStaticBlocksPromise = cacheReact(async props => {
  const req = {};
  if(props?.cookies) {
    req.cookies = props?.cookies
  }

  const uri = [];

  if (props?.hash) {
    uri.push('hash=' + encodeURIComponent(props?.hash));
  }

  if (props?.group) {
    uri.push(`group=${encodeURIComponent(props?.group)}`);
  }

  if (props?.fields) {
    uri.push('fields=' + props?.fields);
  }

  if (props?.perPage !== false) {
    uri.push('per-page=' + (props?.perPage ? props?.perPage : '999'));
  }

  if (props?.expand !== false) {
    uri.push(
      'expand=' +
        (props?.expand ? props?.expand : 'url,customCss,customJavascript'),
    );
  }

  return fetch(
    `${reqApiHost(req)}/api/v2/static-blocks${
      !isEmpty(uri) ? `?${uri.join('&')}` : ''
    }`,
    {
      headers: reqGetHeaders(req),
      next: { revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE) },
    },
  ).then(result => result.json());
});

const getStaticBlocks = async props => {
  const cachedData = await getCachedDataProps(
    cache,
    props,
    '/grandus-utils/fetches/ssr/StaticBlocks.jsx',
  );

  if (!isEmpty(cachedData)) {
    return cachedData;
  }

  const staticBlocks = await getStaticBlocksPromise(props);

  await saveDataToCacheProps(
    cache,
    staticBlocks,
    props,
    '/grandus-utils/fetches/ssr/StaticBlocks.jsx',
  );

  return staticBlocks;
};

export default getStaticBlocks;

import { reqApiHost, reqGetHeadersBasic } from 'grandus-lib/utils/edge';

import cache, {
  getCachedDataProps,
  saveDataToCacheProps,
} from 'grandus-lib/utils/cache';

import { cache as cacheReact } from 'react';

import isEmpty from 'lodash/isEmpty';
import join from 'lodash/join';

const getCategoriesData = cacheReact(async props => {
  const req = {};
  let uri = [];

  // not implemented on backend
  if (props?.depth !== false) {
    uri.push('depth=' + (props?.depth ? props?.depth : '0'));
  }

  // not implemented on backend
  if (props?.expand) {
    uri.push('expand=' + props?.expand);
  }

  // not implemented on backend
  if (props?.fields) {
    uri.push('fields=' + props?.fields);
  }

  const categories = await fetch(
    `${reqApiHost(req)}/api/v2/categories${
      isEmpty(uri) ? '' : '?' + join(uri, '&')
    }`,
    {
      headers: reqGetHeadersBasic(req),
    },
  ).then(result => result.json());

  return categories;
});

const getCategories = async props => {
  const cachedData = await getCachedDataProps(
    cache,
    props,
    '/grandus-utils/fetches/ssr/category/Categories.jsx',
  );

  if (!isEmpty(cachedData)) {
    return cachedData;
  }

  const data = await getCategoriesData(props);

  await saveDataToCacheProps(
    cache,
    data,
    props,
    '/grandus-utils/fetches/ssr/category/Categories.jsx',
  );

  return data?.data;
};

export default getCategories;

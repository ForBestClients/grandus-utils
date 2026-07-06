import { reqApiHost } from 'grandus-lib/utils/edge';
import { reqGetHeaders } from 'grandus-utils';
import getRequestObject, { getRequestLocale } from 'grandus-utils/request';

import cache, {
  getCachedDataProps,
  saveDataToCacheProps,
} from 'grandus-lib/utils/cache';

import { cache as cacheReact } from 'react';

import isEmpty from 'lodash/isEmpty';
import join from 'lodash/join';

const getCategoriesData = cacheReact(async props => {
  const req = await getRequestObject();
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
      headers: reqGetHeaders(req),
    },
  ).then(result => result.json());

  return categories;
});

const getCategories = async props => {
  const locale = await getRequestLocale();
  const cacheProps = { ...props, locale };

  const cachedData = await getCachedDataProps(
    cache,
    cacheProps,
    '/grandus-utils/fetches/ssr/category/Categories.jsx',
  );

  if (!isEmpty(cachedData)) {
    return cachedData?.data;
  }

  const data = await getCategoriesData(props);

  await saveDataToCacheProps(
    cache,
    data,
    cacheProps,
    '/grandus-utils/fetches/ssr/category/Categories.jsx',
  );

  return data?.data;
};

export default getCategories;

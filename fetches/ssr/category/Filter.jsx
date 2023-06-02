import crypto from 'crypto';
import { cache } from 'react';

import { reqApiHost, reqGetHeaders, reqExtractUri } from 'grandus-lib/utils';
import { getApiBodyFromParams, arrayToParams } from 'grandus-lib/utils/filter';

export const getFilterData = cache(async params => {
  const req = {};

  const category = params?.props?.params?.category;
  const parameters = params?.props?.params?.parameters;

  const body = {
    categoryName: category,
    ...getApiBodyFromParams(arrayToParams(parameters)),
  };

  const fetchData = {
    url: `${reqApiHost(req)}/api/v2/filters${reqExtractUri(req?.url)}`,
    body: {
      method: 'POST',
      headers: reqGetHeaders(req),
      body: JSON.stringify(body),
      cache: 'force-cache',
    },
  };

  const urlHash = crypto
    .createHash('md5')
    .update(JSON.stringify(fetchData))
    .digest('hex');

  const filter = await fetch(
    `${fetchData?.url}${
      (fetchData?.url.indexOf('?') > 0 ? '&cacheHash=' : '?cacheHash=') +
      urlHash
    }`,
    fetchData?.body,
  )
    .then(result => result.json())
    .catch(() => {
      console.error('error Filter.jsx', params);
      return {};
    });

  return filter;
});

const getFilter = async params => {
  const filterData = await getFilterData(params);

  return filterData?.data;
};

export default getFilter;

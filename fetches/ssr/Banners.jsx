import { reqGetHeaders, reqApiHost } from 'grandus-lib/utils';

import isEmpty from 'lodash/isEmpty';
import join from 'lodash/join';

const getBannersData = async params => {
  const req = {};

  let uri = [];

  if (params?.type) {
    uri.push('type=' + params?.type);
  }

  if (params?.propertyId) {
    uri.push('propertyId=' + params?.propertyId);
  }

  const result = await fetch(
    `${reqApiHost(req)}/api/v2/banners${
      isEmpty(uri) ? '' : '?v=2&' + join(uri, '&')
    }`,
    {
      headers: reqGetHeaders(req),
      next: { revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE) },
    },
  )
    .then(result => result.json())
    .then(r => r?.data);

  return result;
};

export default getBannersData;

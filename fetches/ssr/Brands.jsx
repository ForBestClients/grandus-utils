import { reqGetHeaders, reqApiHost } from 'grandus-lib/utils';
import isEmpty from 'lodash/isEmpty';

const getBrands = async props => {
  const req = {};

  const uri = [];

  if (props?.perPage) {
    uri.push(`per-page=${props?.perPage}`);
  } else {
    uri.push(`per-page=12`);
  }

  if (props?.orderBy) {
    uri.push(`orderBy=${props?.orderBy}`);
  } else {
    uri.push(`orderBy=priority-desc`);
  }

  const url = `${reqApiHost(req)}/api/v2/brands${
    !isEmpty(uri) ? `?${uri.join('&')}` : ''
  }`;

  const data = await fetch(url, {
    headers: reqGetHeaders(req),
  })
    .then(result => result.json())
    .then(r => r.data);

  return data;
};

export default getBrands;

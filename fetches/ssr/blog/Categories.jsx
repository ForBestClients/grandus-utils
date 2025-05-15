import { reqApiHost, reqGetHeaders } from 'grandus-utils';
import isEmpty from 'lodash/isEmpty';
import getRequestObject from 'grandus-utils/request';

async function getCategoriesData(props) {
  const req = await getRequestObject();

  const uri = [];
  if (props?.forum !== undefined) {
    uri.push(`forum=${props?.forum}`);
  }

  const url = `${reqApiHost(req)}/api/v2/blogs/categories${
    !isEmpty(uri) ? `?${uri.join('&')}` : ''
  }`;

  return await fetch(url, {
    headers: reqGetHeaders(req),
    next: {
      revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE),
      tags: ['blog'],
    },
  })
    .then(result => result.json())
    .then(r => r.data);
}

export default getCategoriesData;

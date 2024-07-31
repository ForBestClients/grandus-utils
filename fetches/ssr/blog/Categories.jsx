import { reqApiHost, reqGetHeaders } from 'grandus-lib/utils';
import isEmpty from "lodash/isEmpty";

async function getCategoriesData(props) {
  const req = {};

  const uri = [];
  if (props?.forum !== undefined) {
    uri.push(`forum=${props?.forum}`)
  }

  const url = `${reqApiHost(req)}/api/v2/blogs/categories${
    !isEmpty(uri) ? `?${uri.join('&')}` : ''
  }`;

  return await
    fetch(url, {
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

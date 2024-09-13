import { reqApiHost, reqGetHeaders } from 'grandus-lib/utils';
import isEmpty from "lodash/isEmpty";
import reduce from "lodash/reduce";
import {cookies} from "next/headers";

async function getCategoriesData(props) {
    const req = {};
    const cookieStore = cookies()
    const cookieObject = reduce(cookieStore.getAll(), (acc, item)=> {
        acc[item?.name]=item?.value
        return acc
    }, {});
    req.cookies = cookieObject

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

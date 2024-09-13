import { reqApiHost, reqGetHeaders } from 'grandus-lib/utils';
import { isEmpty } from 'lodash';
import fetcher from 'grandus-utils/fetcher';
import reduce from "lodash/reduce";
import {cookies} from "next/headers";

const getPage = async slug => {
  const req = {};
  const cookieStore = cookies()
  const cookieObject = reduce(cookieStore.getAll(), (acc, item)=> {
    acc[item?.name]=item?.value
    return acc
  }, {});
  req.cookies = cookieObject

  if (isEmpty(slug)) {
    return null;
  }

  const url = `${reqApiHost(
    req,
  )}/api/v2/pages/${slug}?expand=photo,content,customCss,customJavascript,attachments,products`;

  const options = {
    headers: reqGetHeaders(req),
    next: {
      revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE),
      tags: ['page'],
    },
  };

  return fetcher(url, options);
};

export default getPage;

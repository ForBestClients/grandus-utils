import { reqApiHost, reqGetHeaders } from 'grandus-utils';
import { isEmpty } from 'lodash';
import fetcher from 'grandus-utils/fetcher';
import getRequestObject from 'grandus-utils/request';

const getPage = async slug => {
  const req = await getRequestObject();

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

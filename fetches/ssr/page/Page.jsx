import { reqApiHost, reqGetHeaders } from 'grandus-lib/utils';
import { isEmpty } from 'lodash';
import fetcher from 'grandus-utils/fetcher';

const getPage = async slug => {
  const req = {};

  if (isEmpty(slug)) {
    return null;
  }

  const url = `${reqApiHost(
    req,
  )}/api/v2/pages/${slug}?expand=photo,content,customCss,customJavascript,attachments,products`;

  const options = {
    headers: reqGetHeaders(req),
    next: { revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE) },
  };

  return fetcher(url, options);
};

export default getPage;

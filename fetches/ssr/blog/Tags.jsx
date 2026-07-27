import { reqApiHost, reqGetHeaders } from 'grandus-utils';
import getRequestObject from 'grandus-utils/request';

async function getTagsData() {
  const req = await getRequestObject();

  const url = `${reqApiHost(req)}/api/v2/blogs/tags`;

  return await fetch(url, {
    headers: reqGetHeaders(req),
    next: {
      revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE),
      tags: ['blog'],
    },
  })
    .then(result => result.json())
    .then(r => r.data)
    .catch(() => []);
}

export default getTagsData;

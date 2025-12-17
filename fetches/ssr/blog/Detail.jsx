import { reqApiHost, reqGetHeaders } from '/grandus-lib/utils';
import { getApiExpand } from '@/grandus-utils';

async function getData(params) {
  const req = {};

  const uri = [];

  if (params?.expand) {
    uri.push(`expand=${params.expand}`);
  } else {
    uri.push(`expand=tags,category,text,gallery,products`);
  }

  const [blog] = await Promise.all([
    fetch(
      `${reqApiHost(req)}/api/v2/blogs/${
        params?.urlTitle
      }?${uri.join('&')}`,
      {
        headers: reqGetHeaders(req),
        next: {
          revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE),
          tags: ['blog'],
        },
      },
    )
      .then(result => result.json())
      .then(r => r.data),
  ]);

  return blog;
}

export default getData;

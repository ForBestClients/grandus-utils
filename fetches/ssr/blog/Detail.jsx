import { reqApiHost, reqGetHeaders } from 'grandus-utils';
import getRequestObject from 'grandus-utils/request';

async function getData(params) {
  const req = await getRequestObject();

  const [blog] = await Promise.all([
    fetch(
      // `tags` zámerne nie je v expande - s ním API degraduje pole tagov
      // na mapu `{urlName: name}` bez `id`. Bez neho prídu ako plné objekty.
      `${reqApiHost(req)}/api/v2/blogs/${
        params?.urlTitle
      }?expand=category,text,gallery,products,additionalInfos`,
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

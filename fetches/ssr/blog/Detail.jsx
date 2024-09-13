import { reqApiHost, reqGetHeaders } from '/grandus-lib/utils';

async function getData(params) {
  const req = {};

  const [blog] = await Promise.all([
    fetch(
      `${reqApiHost(req)}/api/v2/blogs/${
        params?.urlTitle
      }?expand=tags,category,text,gallery,products`,
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

import { reqApiHost, reqGetHeaders } from '/grandus-lib/utils';
import reduce from "lodash/reduce";
import {cookies} from "next/headers";

async function getData(params) {
  const req = {};
  const cookieStore = cookies()
  const cookieObject = reduce(cookieStore.getAll(), (acc, item)=> {
    acc[item?.name]=item?.value
    return acc
  }, {});
  req.cookies = cookieObject

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

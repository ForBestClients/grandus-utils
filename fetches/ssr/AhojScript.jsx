import { reqGetHeaders, reqApiHost } from 'grandus-lib/utils';
import { getWebInstanceRawPromise } from 'grandus-utils/fetches/promises/WebInstance';
import reduce from "lodash/reduce";
import {cookies} from "next/headers";

const getAhojScript = async () => {
    const req = {};
    const cookieStore = cookies()
    const cookieObject = reduce(cookieStore.getAll(), (acc, item)=> {
        acc[item?.name]=item?.value
        return acc
    }, {});
    req.cookies = cookieObject
  const webinstance = await getWebInstanceRawPromise();

  let response = '';

  if (webinstance?.id) {
    response = await fetch(
      `${reqApiHost(req)}/api/ahoj/gateway/script?webInstanceId=` +
        webinstance?.id,
      {
        method: 'get',
        headers: reqGetHeaders(req),
        next: { revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE) },
      },
    ).then(result => result.text());
  }
  return response;
};

export default getAhojScript;

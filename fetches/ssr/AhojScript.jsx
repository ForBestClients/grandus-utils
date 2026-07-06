import { reqGetHeaders, reqApiHost } from 'grandus-lib/utils';
import getRequestObject from 'grandus-utils/request';
import { getWebInstanceRawPromise } from 'grandus-utils/fetches/promises/WebInstance';

const getAhojScript = async () => {
  const req = await getRequestObject();
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

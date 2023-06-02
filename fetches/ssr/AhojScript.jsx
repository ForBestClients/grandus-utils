import { reqGetHeaders, reqApiHost } from 'grandus-lib/utils';
import getWebInstance from 'grandus-utils/fetches/ssr/WebInstance';

const getAhojScript = async () => {
  const req = {};
  const webinstance = await getWebInstance();

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

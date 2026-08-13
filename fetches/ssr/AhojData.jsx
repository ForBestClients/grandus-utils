import { reqGetHeaders, reqApiHost } from 'grandus-lib/utils';

import { getWebInstanceRawPromise } from 'grandus-utils/fetches/promises/WebInstance';
import { getRequestContext } from 'grandus-utils/context';
const getAhojData = async params => {
  const req = getRequestContext(params);
  const webinstance = await getWebInstanceRawPromise();

  let response = '';

  if (webinstance?.id) {
    response = await fetch(
      `${reqApiHost(req)}/api/ahoj/gateway/product-data?webInstanceId=${
        webinstance?.id
      }&price=${params?.price}&productId=${params?.id}`,
      {
        method: 'get',
        headers: reqGetHeaders(req),
        next: { revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE) },
      },
    ).then(result => result.json());
  }
  return response;
};

export default getAhojData;

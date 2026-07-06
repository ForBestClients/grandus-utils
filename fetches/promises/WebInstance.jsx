import { reqApiHost } from 'grandus-lib/utils/edge';
import { reqGetHeaders } from 'grandus-utils';
import getRequestObject from 'grandus-utils/request';

export const getWebInstanceRawPromise = async () => {
  const req = await getRequestObject();

  return fetch(
    `${reqApiHost(req)}/api/web-instance?id=${process.env.GRANDUS_TOKEN_HOST}`,
    {
      headers: reqGetHeaders(req),
      next: { revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE) },
    },
  )
    .then(result => result.json())
    .then(r => r?.webInstance)
}
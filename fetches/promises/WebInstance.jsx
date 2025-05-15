import { reqApiHost, reqGetHeadersBasic } from 'grandus-lib/utils/edge';

export const getWebInstanceRawPromise = async () => {
  const req = {};

  return fetch(
    `${reqApiHost(req)}/api/web-instance?id=${process.env.GRANDUS_TOKEN_HOST}`,
    {
      headers: reqGetHeadersBasic(req),
      next: { revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE) },
    },
  )
    .then(result => result.json())
    .then(r => r?.webInstance);
};
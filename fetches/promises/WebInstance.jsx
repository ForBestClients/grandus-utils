import { reqApiHost, reqGetHeadersBasic } from 'grandus-lib/utils/edge';
import { getRequestContext } from 'grandus-utils/context';

export const getWebInstanceRawPromise = async (props = undefined) => {
  const req = getRequestContext(props);

  return fetch(
    `${reqApiHost(req)}/api/web-instance?id=${process.env.GRANDUS_TOKEN_HOST}`,
    {
      headers: reqGetHeadersBasic(req),
      next: { revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE) },
    },
  )
    .then(result => result.json())
    .then(r => r?.webInstance)
}
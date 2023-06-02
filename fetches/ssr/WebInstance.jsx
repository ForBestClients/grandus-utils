import { reqApiHost, reqGetHeadersBasic } from '/grandus-lib/utils/edge';

const getWebInstance = async () => {
  const req = {};

  const webinstance = await fetch(
    `${reqApiHost(req)}/api/web-instance?id=${process.env.GRANDUS_TOKEN_HOST}`,
    {
      headers: reqGetHeadersBasic(req),
      next: { revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE) },
    },
  )
    .then(result => result.json())
    .then(r => r?.webInstance);

  return webinstance;
};

export default getWebInstance;

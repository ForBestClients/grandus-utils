import { reqApiHost, reqGetHeadersBasic } from 'grandus-lib/utils/edge';

export const getFaqDataByHash = async (hash = 'FAQ') => {
  const req = {};
  const url = `${reqApiHost(req)}/api/v2/additional-info?hash=${hash}`;

  const response = await fetch(url, {
    headers: reqGetHeadersBasic(req),
    next: { revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE) || 60 },
  });

  const data = await response.json();
  return data?.data || [];
};

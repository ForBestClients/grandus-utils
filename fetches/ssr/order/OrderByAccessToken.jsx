import { reqApiHost, reqGetHeaders } from 'grandus-lib/utils';

const getOrder = async token => {
  const req = {};

  if (!token) {
    return null;
  }

  const result = await fetch(`${reqApiHost(req)}/api/v2/orders/${token}`, {
    headers: reqGetHeaders(req),
    next: { revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE) },
  })
    .then(result => result.json())
    .then(r => r?.data);

  return result;
};

export default getOrder;

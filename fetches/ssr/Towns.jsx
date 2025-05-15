import { reqGetHeaders, reqApiHost } from 'grandus-utils';
import getRequestObject from 'grandus-utils/request';

const getTowns = async () => {
  const req = await getRequestObject();

  const result = await fetch(`${reqApiHost(req)}/api/v2/towns`, {
    headers: reqGetHeaders(req),
    next: { revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE) },
  })
    .then(result => result.json())
    .then(r => r?.data);

  return result;
};

export default getTowns;

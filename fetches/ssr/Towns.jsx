import { reqGetHeaders, reqApiHost } from 'grandus-lib/utils';
import { getRequestContext } from 'grandus-utils/context';

const getTowns = async () => {
  const req = getRequestContext();

  const result = await fetch(`${reqApiHost(req)}/api/v2/towns`, {
    headers: reqGetHeaders(req),
    next: { revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE) },
  })
    .then(result => result.json())
    .then(r => r?.data);

  return result;
};

export default getTowns;

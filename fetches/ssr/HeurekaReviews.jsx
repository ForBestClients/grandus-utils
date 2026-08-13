import { reqGetHeaders, reqApiHost } from 'grandus-lib/utils';
import { getRequestContext } from 'grandus-utils/context';

const getHeurekaReviews = async (props = undefined) => {
  const req = getRequestContext(props);

  return await fetch(`${reqApiHost(req)}/api/v2/review`, {
    headers: reqGetHeaders(req),
    next: { revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE) },
  })
    .then(result => result.json())
    .then(r => r?.data);
};

export default getHeurekaReviews;

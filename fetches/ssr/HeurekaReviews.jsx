import { reqGetHeaders, reqApiHost } from 'grandus-lib/utils';
import getRequestObject from 'grandus-utils/request';

const getHeurekaReviews = async () => {
  const req = await getRequestObject();

  return await fetch(`${reqApiHost(req)}/api/v2/review`, {
    headers: reqGetHeaders(req),
    next: { revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE) },
  })
    .then(result => result.json())
    .then(r => r?.data);
};

export default getHeurekaReviews;

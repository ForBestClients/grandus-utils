import {
  getApiExpand,
  getApiFields,
  reqApiHost,
  reqGetHeaders,
} from 'grandus-utils';
import getRequestObject from 'grandus-utils/request';

const getOrder = async token => {
  const req = await getRequestObject();

  if (!token) {
    return null;
  }

  const uri = [];

  uri.push(getApiFields('ORDER', true));
  uri.push(getApiExpand('ORDER', true));

  const result = await fetch(
    `${reqApiHost(req)}/api/v2/orders/${token}?${uri.join('&')}`,
    {
      headers: reqGetHeaders(req),
      next: { revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE) },
    },
  )
    .then(result => result.json())
    .then(r => r?.data);

  return result;
};

export default getOrder;

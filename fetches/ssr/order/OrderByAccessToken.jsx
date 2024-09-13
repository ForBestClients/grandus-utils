import { getApiExpand, getApiFields, reqApiHost, reqGetHeaders } from 'grandus-lib/utils';
import reduce from "lodash/reduce";
import {cookies} from "next/headers";

const getOrder = async token => {
  const req = {};
  const cookieStore = cookies()
  const cookieObject = reduce(cookieStore.getAll(), (acc, item)=> {
    acc[item?.name]=item?.value
    return acc
  }, {});
  req.cookies = cookieObject

  if (!token) {
    return null;
  }

  const uri = [];

  uri.push(getApiFields('ORDER', true));
  uri.push(getApiExpand('ORDER', true));

  const result = await fetch(`${reqApiHost(req)}/api/v2/orders/${token}?${uri.join('&')}`, {
    headers: reqGetHeaders(req),
    next: { revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE) },
  })
    .then(result => result.json())
    .then(r => r?.data);

  return result;
};

export default getOrder;

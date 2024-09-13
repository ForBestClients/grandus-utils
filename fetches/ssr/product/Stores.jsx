import { get, sortBy } from 'lodash';
import { reqApiHost, reqGetHeaders } from 'grandus-lib/utils';
import reduce from "lodash/reduce";
import {cookies} from "next/headers";

const getStores = async params => {
    const req = {};
    const cookieStore = cookies()
    const cookieObject = reduce(cookieStore.getAll(), (acc, item)=> {
        acc[item?.name]=item?.value
        return acc
    }, {});
    req.cookies = cookieObject
  const page = await fetch(
    `${reqApiHost(req)}/api/v2/deliveries/possible-by-items`,
    {
      method: 'post',
      headers: reqGetHeaders(req),
      body: JSON.stringify({
        customType: 1,
        items: {
          productId: params.id,
        },
      }),
    },
  ).then(result => result.json());

  return sortBy(get(page, 'data', []), item => item.name);
};

export default getStores;

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '5mb',
    },
  },
};

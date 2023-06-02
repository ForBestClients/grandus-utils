import { get, sortBy } from 'lodash';
import { reqApiHost, reqGetHeaders } from 'grandus-lib/utils';

const getStores = async params => {
  let req = {};
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

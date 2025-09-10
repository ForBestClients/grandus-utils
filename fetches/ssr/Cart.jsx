import { reqApiHost, reqGetHeaders } from 'grandus-utils';
import getRequestObject from 'grandus-utils/request';
import { CART_CONSTANT } from '@/grandus-lib/constants/SessionConstants';
import { get } from 'lodash';
import { addCartUrlField } from '@/grandus-utils/cart';

const getCart = async () => {
  const req = await getRequestObject();

  const cartSession = req.session[CART_CONSTANT];
  const cartAccessToken = get(cartSession, 'accessToken');
  let url = `${reqApiHost(req)}/api/v2/carts`;

  if (cartAccessToken) {
    url += `/${cartAccessToken}`;
  }

  url = addCartUrlField(url, req);

 return await fetch(url, {
    headers: reqGetHeaders(req),
    next: { revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE) },
  })
    .then(result => result.json())
    .then(r => r?.data);
};

export default getCart;

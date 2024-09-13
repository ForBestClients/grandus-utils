import { reqApiHost, reqGetHeaders } from 'grandus-utils';
import reduce from "lodash/reduce";
import {cookies} from "next/headers";

const getProductReviewsPromise = async (id) => {
  const req = {};
  const cookieStore = cookies()
  const cookieObject = reduce(cookieStore.getAll(), (acc, item)=> {
    acc[item?.name]=item?.value
    return acc
  }, {});
  req.cookies = cookieObject
  return fetch(`${reqApiHost(req)}/api/v2/reviews/product/${id}?sort=-id`, {
    headers: reqGetHeaders(req),
  })
    .then(result => result.json())
    .then(r => r.data);
};

export default getProductReviewsPromise;

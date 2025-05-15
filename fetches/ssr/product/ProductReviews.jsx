import { reqApiHost, reqGetHeaders } from 'grandus-utils';
import getRequestObject from 'grandus-utils/request';

const getProductReviewsPromise = async id => {
  const req = await getRequestObject();

  return fetch(`${reqApiHost(req)}/api/v2/reviews/product/${id}?sort=-id`, {
    headers: reqGetHeaders(req),
  })
    .then(result => result.json())
    .then(r => r.data);
};

export default getProductReviewsPromise;

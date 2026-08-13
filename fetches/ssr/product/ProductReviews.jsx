import { reqApiHost, reqGetHeaders } from 'grandus-utils';
import { getRequestContext } from 'grandus-utils/context';

const getProductReviewsPromise = async (id) => {
  const req = getRequestContext();
  return fetch(`${reqApiHost(req)}/api/v2/reviews/product/${id}?sort=-id`, {
    headers: reqGetHeaders(req),
  })
    .then(result => result.json())
    .then(r => r.data);
};

export default getProductReviewsPromise;
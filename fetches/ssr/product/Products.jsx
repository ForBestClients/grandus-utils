import { reqApiHost, reqGetHeadersBasic } from '/grandus-lib/utils/edge';
import { getProductCardFields,reqGetHeaders } from 'grandus-lib/utils';

const getProducts = async params => {
  const req = {};

  const products = await Promise.all([
    fetch(
      `${reqApiHost(
        req
      )}/api/v2/products?fields=${getProductCardFields()}&per-page=10&orderBy=time-desc`,
      {
        headers: reqGetHeaders(req),
        next: { revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE) },
      }
    )
      .then((result) => result.json())
      .then((r) => r.data),
  ]);

  return products;
};

export default getProducts;
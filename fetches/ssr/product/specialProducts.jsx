import { reqApiHost, reqGetHeadersBasic } from '/grandus-lib/utils/edge';
import { getProductCardFields,reqGetHeaders } from 'grandus-lib/utils';

const getSpecialProducts = async () => {
  const req = {};

  const specialProducts = await Promise.all([
    fetch(
      `${reqApiHost(
        req
      )}/api/v2/products?fields=${getProductCardFields()}&favourite=1&per-page=10&orderBy=priority-desc`,
      {
        headers: reqGetHeaders(req),
        next: { revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE) },
      }
    )
      .then((result) => result.json())
      .then((r) => r.data),
  ]);

  return specialProducts;
};

export default getSpecialProducts;
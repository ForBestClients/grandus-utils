import { reqApiHost } from '/grandus-lib/utils/edge';
import { getProductCardFields } from 'grandus-lib/utils';
import { reqGetHeaders } from 'grandus-utils';
import getRequestObject from 'grandus-utils/request';

const getProducts = async params => {
  const req = await getRequestObject();

  const products = await Promise.all([
    fetch(
      `${reqApiHost(
        req,
      )}/api/v2/products?fields=${getProductCardFields()}&per-page=10&orderBy=time-desc`,
      {
        headers: reqGetHeaders(req),
        next: { revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE) },
      },
    )
      .then((result) => result.json())
      .then((r) => r.data),
  ]);

  return products;
};

export default getProducts;
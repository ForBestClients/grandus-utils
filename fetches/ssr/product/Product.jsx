import { reqApiHost, reqGetHeadersBasic } from '/grandus-lib/utils/edge';
import { getApiExpand, getApiFields } from 'grandus-utils';
import { getProcessedCardFields } from 'utils';

export const getProductData = async params => {
  const req = {};

  const uri = [];
  const productDetailFields = getApiFields('PRODUCT_DETAIL').split(',');
  const processedFields = getProcessedCardFields('crosssaleProducts.products.');

  uri.push(`fields=${[...productDetailFields, ...processedFields].join(',')}`);
  uri.push(getApiExpand('PRODUCT_DETAIL', true));

  const [product] = await Promise.all([
    fetch(
      `${reqApiHost(req)}/api/v2/products/${params?.urlTitle}?${uri.join('&')}`,
      {
        headers: reqGetHeadersBasic(req),
        next: { revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE) },
      },
    ).then(result => result.json()),
  ]);

  return product;
};

const getProduct = async params => {
  const productData = await getProductData(params);

  return productData?.data;
};

export default getProduct;

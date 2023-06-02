import { getMetaData } from 'grandus-lib/utils/meta';

import getProductData from 'grandus-utils/fetches/ssr/product/Product';

const getProductMetadata = async props => {
  const product = await getProductData(props?.params);

  const meta = getMetaData(
    product?.name,
    product?.shortProductDescription?.description,
    'mobilonline.sk',
    {},
    // { image: { url: `/api/og/product/image/${product?.urlTitle}` } },
  );

  return meta;
};

export default getProductMetadata;

import { getMetaData } from 'grandus-lib/utils/meta';
import { reqApiHost, reqGetHeadersBasic } from 'grandus-lib/utils/edge';
import isEmpty from 'lodash/isEmpty';
import { get } from 'lodash';

const getProductMetadata = async props => {
  const urlTitle = get(props, 'params.urlTitle', '');

  const product = await fetch(
    `${reqApiHost({})}/api/v2/products?urlTitle=${urlTitle}`,
    {
      headers: reqGetHeadersBasic({})
    },
  )
    .then(result => result.json())
    .then(r => get(r, 'data[0]'));

  if (isEmpty(product)) {
    return false;
  }

  const meta = getMetaData(
    product?.name,
    product?.shortProductDescription?.description,
    'mobilonline.sk',
    {},
    { alternates: { canonical: `/produkt/${product?.urlTitle}` } },
  );

  return meta;
};

export default getProductMetadata;

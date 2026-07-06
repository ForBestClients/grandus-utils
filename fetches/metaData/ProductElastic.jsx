import { getMetaData } from 'grandus-lib/utils/meta';
import { reqApiHost } from 'grandus-lib/utils/edge';
import { reqGetHeaders } from 'grandus-utils';
import getRequestObject from 'grandus-utils/request';
import isEmpty from 'lodash/isEmpty';
import { get } from 'lodash';

const getProductMetadata = async props => {
  const req = await getRequestObject();
  const urlTitle = get(props, 'params.urlTitle', '');

  const product = await fetch(
    `${reqApiHost(req)}/api/v2/products?urlTitle=${urlTitle}`,
    {
      headers: reqGetHeaders(req)
    },
  )
    .then(result => result.json())
    .then(r => get(r, 'data[0]'));

  if (isEmpty(product)) {
    return false;
  }

  const meta = getMetaData(
    product?.name,
    product?.shortDescription,
    'mobilonline.sk',
    {},
    { alternates: { canonical: `/produkt/${product?.urlTitle}` } },
  );

  return meta;
};

export default getProductMetadata;

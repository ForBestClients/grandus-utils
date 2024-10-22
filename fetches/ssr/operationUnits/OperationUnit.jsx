import { reqApiHost, reqGetHeadersBasic } from 'grandus-lib/utils/edge';
import { getApiExpand, getApiFields } from 'grandus-utils';

export const getOperationUnitPromise = async params => {
  const req = {};

  const uri = [];

  uri.push(`fields=${getApiFields('OPERATION_UNIT_DETAIL')}`);

  if (params?.expand) {
    uri.push(`expand=${params.expand}`);
  } else {
    uri.push(getApiExpand('OPERATION_UNIT_DETAIL', true));
  }

  return fetch(
    `${reqApiHost(req)}/api/v2/operation-units/${params?.urlName}?${uri.join('&')}`,
    {
      headers: reqGetHeadersBasic(req),
      next: { revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE) },
    },
  ).then(result => result.json());
};

export const getOperationUnitData = async params => {
  const [product] = await Promise.all([getOperationUnitPromise(params)]);

  return product;
};

const getOperationUnit = async params => {
  const operationUnitData = await getOperationUnitData(params);

  return operationUnitData?.data;
};

export default getOperationUnit;

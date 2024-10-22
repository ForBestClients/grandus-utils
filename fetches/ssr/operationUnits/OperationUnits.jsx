import { reqApiHost, reqGetHeaders } from '/grandus-lib/utils';
import cache, {getCachedDataProps, saveDataToCacheProps} from "@/grandus-lib/utils/cache";
import isEmpty from "lodash/isEmpty";

async function getOperationUnitsPromises() {
  const req = {};

  const uri = [];

  if (props?.id) {
    uri.push('id=' + encodeURIComponent(props?.hash));
  }

  if (props?.perPage !== false) {
    uri.push('per-page=' + (props?.perPage ? props?.perPage : '999'));
  }
uri.push(process.env.NEXT_PUBLIC_OPERATION_UNITS_EXPAND
    ? process.env.NEXT_PUBLIC_OPERATION_UNITS_EXPAND
    : 'openingHours, town.county, parameters');

  const [operationUnits] = await Promise.all([
    fetch(`${reqApiHost(req)}/api/v2/operation-units?${uri.join('&')}`, {
      headers: reqGetHeaders(req),
      next: { revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE) },
    })
      .then(result => result.json())
  ]);

  return operationUnits;
}


const getOperationUnits = async props => {
  const cachedData = await getCachedDataProps(
      cache,
      props,
      '/grandus-utils/fetches/ssr/OperationUnits.jsx',
  );

  if (!isEmpty(cachedData)) {
    return cachedData;
  }

  const operationUnits = await getOperationUnitsPromises(props);

  await saveDataToCacheProps(
      cache,
      operationUnits,
      props,
      '/grandus-utils/fetches/ssr/OperationUnits.jsx',
  );

  return operationUnits;
};

export default getOperationUnits;

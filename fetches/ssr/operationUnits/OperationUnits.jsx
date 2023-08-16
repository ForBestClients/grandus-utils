import { reqApiHost, reqGetHeaders } from '/grandus-lib/utils';

async function getOperationUnits() {
  const req = {};

  const expand = process.env.NEXT_PUBLIC_OPERATION_UNITS_EXPAND
    ? process.env.NEXT_PUBLIC_OPERATION_UNITS_EXPAND
    : 'openingHours, town.county, parameters';

  const [operationUnits] = await Promise.all([
    fetch(`${reqApiHost(req)}/api/v2/operation-units?expand=${expand}`, {
      headers: reqGetHeaders(req),
      next: { revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE) },
    })
      .then(result => result.json())
      .then(r => r.data),
  ]);

  return operationUnits;
}

export default getOperationUnits;

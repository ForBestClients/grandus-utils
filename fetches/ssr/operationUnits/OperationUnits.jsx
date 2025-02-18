import { reqApiHost, reqGetHeaders } from '/grandus-lib/utils';

async function getOperationUnits(params) {
  const req = {};
  const uri = [];

  if (params?.expand) {
    uri.push(`expand=${params?.expand}`);
  } else {
    uri.push(
      `expand=${
        process.env.NEXT_PUBLIC_OPERATION_UNITS_EXPAND
          ? process.env.NEXT_PUBLIC_OPERATION_UNITS_EXPAND
          : 'openingHours, town.county, parameters'
      }`,
    );
  }

  if (params?.parentId) {
    uri.push(`parentId=${params?.parentId}`);
  }

  const uriString = uri?.length ? `?${uri.join('&')}` : '';

  const [operationUnits] = await Promise.all([
    fetch(`${reqApiHost(req)}/api/v2/operation-units${uriString}`, {
      headers: reqGetHeaders(req),
      next: { revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE) },
    })
      .then(result => result.json())
      .then(r => r.data),
  ]);

  return operationUnits;
}

export default getOperationUnits;

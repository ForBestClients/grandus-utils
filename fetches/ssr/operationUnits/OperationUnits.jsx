import { reqApiHost, reqGetHeaders } from '/grandus-lib/utils';
import reduce from "lodash/reduce";
import {cookies} from "next/headers";

async function getOperationUnits() {
  const req = {};
  const cookieStore = cookies()
  const cookieObject = reduce(cookieStore.getAll(), (acc, item)=> {
    acc[item?.name]=item?.value
    return acc
  }, {});
  req.cookies = cookieObject

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

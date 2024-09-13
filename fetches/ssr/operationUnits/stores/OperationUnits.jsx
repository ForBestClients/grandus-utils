import {
  reqGetHeaders,
  reqApiHost,
  getPaginationFromHeaders,
} from 'grandus-lib/utils';
import reduce from "lodash/reduce";
import {cookies} from "next/headers";

export const revalidate = process.env.NEXT_PUBLIC_REVALIDATE;

const getOperationUnits = async props => {
  const req = {};
  const cookieStore = cookies()
  const cookieObject = reduce(cookieStore.getAll(), (acc, item)=> {
    acc[item?.name]=item?.value
    return acc
  }, {});
  req.cookies = cookieObject

  let expand = 'openingHours';
  if(props?.expand){
    expand = props?.expand;
  }

  const [operationUnits] = await Promise.all([
    fetch(`${reqApiHost(req)}/api/v2/operation-units?expand=${expand}`, {
      headers: reqGetHeaders(req),
      next: { revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE) },
    })
      .then(result => {
        return result.json();
      })
      .then(r => r.data),
  ]);

  return {
    operationUnits,
  };
};

export default getOperationUnits;

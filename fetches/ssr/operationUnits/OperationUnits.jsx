import {
  reqGetHeaders,
  reqApiHost,
  getPaginationFromHeaders,
} from 'grandus-lib/utils';

export const revalidate = process.env.NEXT_PUBLIC_REVALIDATE;

const getOperationUnits = async props => {
  const req = {};

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

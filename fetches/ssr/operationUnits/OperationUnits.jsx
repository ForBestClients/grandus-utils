import { reqApiHost, reqGetHeaders } from '/grandus-lib/utils';

async function getOperationUnits() {
  const req = {};

  const [operationUnits] = await Promise.all([
    fetch(
      `${reqApiHost(
        req,
      )}/api/v2/operation-units?expand=openingHours,town.county,parameters`,
      {
        headers: reqGetHeaders(req),
        next: { revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE) },
      },
    )
      .then(result => result.json())
      .then(r => r.data),
  ]);

  return operationUnits;
}

export default getOperationUnits;

import { reqGetHeaders, reqApiHost } from 'grandus-lib/utils';

const getCountries = async () => {
  const req = {};

  const result = await fetch(`${reqApiHost(req)}/api/v2/countries`, {
    headers: reqGetHeaders(req),
    next: { revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE) },
  })
    .then(result => result.json())
    .then(r => r?.data);

  return result;
};

export default getCountries;

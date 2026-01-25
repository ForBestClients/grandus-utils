import { reqGetHeaders, reqApiHost } from 'grandus-lib/utils';

/**
 * Fetch all countries from API
 * @returns {Promise<Array>} Array of country objects
 */
const getCountries = async () => {
  const response = await fetch(`${reqApiHost()}/api/v2/countries`, {
    headers: reqGetHeaders({}),
    next: { revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE) },
  });

  const data = await response.json();
  return data?.data;
};

export default getCountries;

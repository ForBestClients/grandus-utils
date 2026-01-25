import { reqGetHeaders, reqApiHost } from 'grandus-lib/utils';

/**
 * Fetch all towns from API
 * @returns {Promise<Array>} Array of town objects
 */
const getTowns = async () => {
  const response = await fetch(`${reqApiHost()}/api/v2/towns`, {
    headers: reqGetHeaders({}),
    next: { revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE) },
  });

  const data = await response.json();
  return data?.data;
};

export default getTowns;

import { reqGetHeaders, reqApiHost } from 'grandus-lib/utils';

const getBrands = async (props) => {
  const req = {};


  const data = await fetch(
    `${reqApiHost(req)}/api/v2/brands?per-page=${props?.perPage ? props?.perPage : "12"}&orderBy=priority-desc`,
    {
      headers: reqGetHeaders(req),
      next: { revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE) },
    }
  )
    .then((result) => result.json())
    .then((r) => r.data);

  return data;
};

export default getBrands;

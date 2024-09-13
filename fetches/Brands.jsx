import { reqGetHeaders, reqApiHost } from 'grandus-lib/utils';
import reduce from "lodash/reduce";
import {cookies} from "next/headers";

const getBrands = async props => {
  const req = {};
  const cookieStore = cookies()
  const cookieObject = reduce(cookieStore.getAll(), (acc, item)=> {
    acc[item?.name]=item?.value
    return acc
  }, {});
  req.cookies = cookieObject

  const data = await fetch(
    `${reqApiHost(req)}/api/v2/brands?per-page=${
      props?.perPage ? props?.perPage : '12'
    }&orderBy=priority-desc`,
    {
      headers: reqGetHeaders(req),
      next: { revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE) },
    },
  )
    .then(result => result.json())
    .then(r => r.data);

  return data;
};

export default getBrands;

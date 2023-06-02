import { reqGetHeaders, reqApiHost } from 'grandus-lib/utils';

const getStatics = async (location, fields = '') => {
  const req = {};

  const statics = await fetch(
    `${reqApiHost(req)}/api/v2/pages?location=${location}${
      fields ? '&fields=' + fields : ''
    }&expand=content,customCss,customJavascript`,
    {
      headers: reqGetHeaders(req),
      next: { revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE) },
    },
  )
    .then(result => result.json())
    .then(r => r?.data);

  return statics;
};

export default getStatics;

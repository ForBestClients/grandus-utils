import { reqGetHeaders, reqApiHost } from 'grandus-lib/utils';
import isEmpty from 'lodash/isEmpty';

const getStaticBlocks = async props => {
  const req = {};
  const uri = [];

  if (props?.group) {
    uri.push(`group=${encodeURIComponent(props?.group)}`);
  }

  if (props?.expand) {
    uri.push(`expand=${encodeURIComponent(props?.expand)}`);
  } else {
    uri.push(`expand=customCss,customJavascript`);
  }

  if (props?.perPage) {
    uri.push(`per-page=${props?.perPage}`);
  } else {
    uri.push(`per-page=999`);
  }

  const staticBlocks = await fetch(
    `${reqApiHost(req)}/api/v2/static-blocks${
      !isEmpty(uri) ? `?${uri.join('&')}` : ''
    }`,
    {
      headers: reqGetHeaders(req),
      next: { revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE) },
    },
  ).then(result => result.json());

  return staticBlocks;
};

export default getStaticBlocks;

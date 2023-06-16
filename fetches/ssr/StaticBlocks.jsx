import { reqGetHeaders, reqApiHost } from 'grandus-lib/utils';
import isEmpty from 'lodash/isEmpty';

export const getStaticBlocksPromise = async props => {
  const req = {};
  const uri = [];

  if (props?.hash) {
    uri.push('hash=' + encodeURIComponent(props?.hash));
  }

  if (props?.group) {
    uri.push(`group=${encodeURIComponent(props?.group)}`);
  }

  if (props?.fields) {
    uri.push('fields=' + props?.fields);
  }

  if (props?.perPage !== false) {
    uri.push('per-page=' + (props?.perPage ? props?.perPage : '999'));
  }

  if (props?.expand !== false) {
    uri.push(
      'expand=' +
      (props?.expand ? props?.expand : 'customCss,customJavascript'),
    );
  }

  return fetch(
    `${reqApiHost(req)}/api/v2/static-blocks${
      !isEmpty(uri) ? `?${uri.join('&')}` : ''
    }`,
    {
      headers: reqGetHeaders(req),
      next: { revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE) },
    },
  ).then(result => result.json());
};

const getStaticBlocks = async props => {
  const staticBlocks = await getStaticBlocksPromise(props);

  return staticBlocks;
};

export default getStaticBlocks;

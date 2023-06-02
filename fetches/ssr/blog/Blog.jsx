import {
  getPaginationFromHeaders,
  reqApiHost,
  reqGetHeaders,
} from 'grandus-lib/utils';

import isEmpty from 'lodash/isEmpty';

const getBlogData = async props => {
  const req = {};
  let pagination = {};

  const uri = [];

  if (props?.perPage) {
    uri.push(`per-page=${props?.perPage}`);
  } else {
    uri.push(`per-page=${process.env.NEXT_PUBLIC_BLOG_DEFAULT_PER_PAGE}`);
  }

  if (props?.params?.value) {
    uri.push(`search=${props?.params?.value}`);
  }

  if (props?.params?.id) {
    uri.push(`communityCategoryId=${props?.params?.id}`);
  }

  if (props?.searchParams?.page) {
    uri.push(`page=${props?.searchParams?.page}`);
  }

  if (props?.fields) {
    uri.push(`fields=${props?.fields}`);
  } else {
    uri.push(`fields=id,title,urlTitle,photo,perex,publishTime`);
  }

  const url = `${reqApiHost(req)}/api/v2/blogs${
    !isEmpty(uri) ? `?${uri.join('&')}` : ''
  }`;

  let [blogs] = await Promise.all([
    fetch(url, {
      headers: reqGetHeaders(req),
      next: { revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE) },
    })
      .then(result => {
        pagination = getPaginationFromHeaders(result.headers);
        return result.json();
      })
      .then(r => r.data)
      .catch(() => []),
  ]);

  return {
    blogs,
    pagination,
  };
};

export default getBlogData;

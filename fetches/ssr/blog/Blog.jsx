import { reqApiHost, reqGetHeaders } from 'grandus-utils';
import { getPaginationFromHeaders } from 'grandus-lib/utils';

import isEmpty from 'lodash/isEmpty';
import getRequestObject from 'grandus-utils/request';

const getBlogData = async props => {
  const req = await getRequestObject();
  let pagination = {};

  const uri = [];

  if (props?.params?.isLocked !== undefined) {
    uri.push(`isLocked=${props?.params?.isLocked}`);
  }

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
    uri.push(
      `fields=id,title,subtitle,urlTitle,photo,perex,publishTime,tags,communityCategory,category`,
    );
  }

  const url = `${reqApiHost(req)}/api/v2/blogs${
    !isEmpty(uri) ? `?${uri.join('&')}` : ''
  }`;

  let [blogs] = await Promise.all([
    fetch(url, {
      headers: reqGetHeaders(req),
      next: {
        revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE),
        tags: ['blog'],
      },
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

import { reqApiHost, reqGetHeaders } from 'grandus-lib/utils';

import { arrayToPath } from 'grandus-lib/utils/filter';

import isEmpty from 'lodash/isEmpty';

import crypto from 'crypto';

const getCategory = async params => {
  const req = {};
  const category = params?.category;
  const externalUrl = `/kategoria/${category}${
    !isEmpty(params?.parameters) ? '/' : ''
  }${arrayToPath(params?.parameters)}`; //@todo paginacia

  const body = JSON.stringify({
    externalUrl: externalUrl,
  });

  const urlHash = crypto.createHash('md5').update(body).digest('hex');

  let [categoryData, categoryVirtualData] = await Promise.all([
    fetch(
      `${reqApiHost(req)}/api/v2/categories/${
        params?.category
      }?expand=childCategories,promotedProducts`,
      {
        headers: reqGetHeaders(req),
        next: { revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE) },
      },
    )
      .then(result => result.json())
      .catch(() => {
        console.error(params);
        return {};
      }),
    fetch(
      `${reqApiHost(
        req,
      )}/api/v2/categories/by-external-url?expand=childCategories,promotedProducts?cacheHash=${urlHash}`,
      {
        headers: reqGetHeaders(req),
        next: { revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE) },
        method: 'POST',
        body: body,
      },
    )
      .then(result => result.json())
      .catch(() => {
        console.error(params);
        return {};
      }),
  ]);

  const data = {
    category: isEmpty(categoryVirtualData?.data?.id)
      ? categoryData?.data
      : categoryVirtualData?.data,
    // : assign({}, categoryData?.data, categoryVirtualData?.data),
  };

  return data;
};

export default getCategory;

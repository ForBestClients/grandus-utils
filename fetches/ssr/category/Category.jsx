import { reqApiHost, reqGetHeaders } from 'grandus-utils';

import { arrayToPath } from 'grandus-lib/utils/filter';

import { cache as cacheReact } from 'react';

import isEmpty from 'lodash/isEmpty';
import assign from 'lodash/assign';
import size from 'lodash/size';

import crypto from 'crypto';
import get from 'lodash/get';
import getRequestObject from 'grandus-utils/request';

const handleCategoryData = (category, categoryVirtual) => {
  if (isEmpty(categoryVirtual)) {
    return category;
  }

  const categoryOverride = {};

  if (categoryVirtual?.id) {
    categoryOverride.isVirtual = true;

    categoryOverride.description = categoryVirtual?.description
      ? categoryVirtual?.description
      : '';

    categoryOverride.shortDescription = categoryVirtual?.shortDescription
      ? categoryVirtual?.shortDescription
      : '';

    categoryOverride.alternativeDescription =
      categoryVirtual?.alternativeDescription
        ? categoryVirtual?.alternativeDescription
        : '';

    categoryOverride.childCategories = categoryVirtual?.childCategories
      ? categoryVirtual?.childCategories
      : [];

    if (categoryVirtual?.hash) {
      categoryOverride.hash = categoryVirtual?.hash;
    }

    if (categoryVirtual?.perex) {
      categoryOverride.perex = categoryVirtual?.perex;
    }

    if (
      categoryVirtual?.title &&
      categoryVirtual?.title !== categoryVirtual?.name
    ) {
      categoryOverride.title = categoryVirtual.title;
    }
  }

  const result = assign({ isVirtual: false }, category, categoryOverride);

  return result;
};

const getCategory = cacheReact(async params => {
  const req = await getRequestObject();
  const category = params?.category;
  const externalUrl = `/kategoria/${category}${
    !isEmpty(params?.parameters) ? '/' : ''
  }${arrayToPath(params?.parameters)}`; //@todo paginacia

  const body = JSON.stringify({
    externalUrl: decodeURIComponent(externalUrl),
  });

  const urlHash = crypto.createHash('md5').update(body).digest('hex');

  let [categoryData, categoryVirtualData] = await Promise.all([
    fetch(
      `${reqApiHost(req)}/api/v2/categories/${
        params?.category
      }?expand=childCategories,promotedProducts,${get(params, 'expand', '')}`,
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
      )}/api/v2/categories/by-external-url?expand=childCategories,promotedProducts,${get(params, 'expand', '')}&cacheHash=${urlHash}`,
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
    category: handleCategoryData(categoryData?.data, categoryVirtualData?.data),
  };

  return data;
});

export default getCategory;

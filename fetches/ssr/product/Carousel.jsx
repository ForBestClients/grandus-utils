import { reqApiHost, reqGetHeaders } from 'grandus-lib/utils';
import isEmpty from 'lodash/isEmpty';
import { getProcessedCardFields } from 'utils';

import cache, {
  getCachedDataProps,
  saveDataToCacheProps,
} from 'grandus-lib/utils/cache';

// import { cache as cacheReact } from 'react';

const getCarouselData = async params => {
  const cachedData = await getCachedDataProps(
    cache,
    params,
    '/grandus-utils/fetches/ssr/product/Carousel.jsx',
  );

  if (!isEmpty(cachedData)) {
    return cachedData;
  }

  const req = {};

  const uri = [];

  uri.push(`location=${params?.location ? params?.location : 1}`);
  uri.push(`type=${params?.type ? params?.type : 1}`);
  uri.push(`layout=${params?.layout ? params?.layout : 1}`);

  if (params?.fields) {
    uri.push(`fields=${params?.fields}`);
  } else {
    const processedFields = getProcessedCardFields('entities.').join(',');

    uri.push(
      `fields=id,title,description,url,hash,photo${
        processedFields ? ',' + processedFields : ''
      }`,
    );
  }

  const url = `${reqApiHost(req)}/api/v2/carousels${
    params?.id ? `/${params?.id}` : ''
  }${!isEmpty(uri) ? `?${uri.join('&')}` : ''}`;

  let carousels = [];

  try {
    carousels = await fetch(url, {
      headers: reqGetHeaders(req),
      next: { revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE) },
    })
      .then(result => {
        if (!result.ok) {
          throw new Error('Network response was not ok');
        }
        return result.json();
      })
      .then(r => r.data);
  } catch (error) {
    console.error(
      'There has been a problem with your fetch operation: ',
      error,
    );
    carousels = [];
  }

  await saveDataToCacheProps(
    cache,
    carousels,
    params,
    '/grandus-utils/fetches/ssr/product/Carousel.jsx',
  );

  return carousels;
};

export default getCarouselData;

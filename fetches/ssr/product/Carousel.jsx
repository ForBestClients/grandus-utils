import { reqApiHost, reqGetHeaders } from 'grandus-lib/utils';
import isEmpty from 'lodash/isEmpty';
import { getProcessedCardFields } from 'utils';

const getCarouselData = async params => {
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
    !isEmpty(uri) ? `?${uri.join('&')}` : ''
  }`;

  const carousels = await fetch(url, {
    headers: reqGetHeaders(req),
    next: { revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE) },
  })
    .then(result => result.json())
    .then(r => r.data);

  return carousels;
};

export default getCarouselData;

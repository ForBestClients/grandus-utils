import { getMetaData } from 'grandus-lib/utils/meta';

import getCategoryData from 'grandus-utils/fetches/ssr/category/Category';
import getBannerData from 'grandus-utils/fetches/ssr/category/Banner';
import { getFilterCategoryDataPromise } from 'grandus-utils/fetches/ssr/category/Filter';
import { getSeoTitleData } from 'grandus-lib/utils/filter';
import map from 'lodash/map';
import get from 'lodash/get';
import split from 'lodash/split';
import toLower from 'lodash/toLower';
import isEmpty from 'lodash/isEmpty';

const getCategoryMetadata = async props => {
  let [category, filterData] = await Promise.all([
    getCategoryData(props?.params),
    getFilterCategoryDataPromise({ props: props }),
  ]);

  const banner = await getBannerData(category?.category?.id);

  const seoTitleData = getSeoTitleData(filterData.data);

  const seoTitleDataNormalized = [];

  map(seoTitleData, item => {
    const itemName = get(split(item, '||'), '[1]', item);
    if (toLower(itemName) !== toLower(category?.category?.title)) {
      seoTitleDataNormalized.push(itemName);
    }
  });

  const seoTitle = category?.category?.title
    + (isEmpty(seoTitleDataNormalized)
      ? ''
      : ' ' + seoTitleDataNormalized.join(', '));

  const meta = getMetaData(
    seoTitle,
    filterData?.meta?.description
      ? filterData?.meta?.description
      : category?.category?.perex,
    'mobilonline.sk',
    banner?.photo,
    {
      keywords: filterData?.meta?.keywords,
      alternates: { canonical: category?.category?.canonicalUrl },
    },
  );

  return meta;
};

export default getCategoryMetadata;

import { getMetaData } from 'grandus-lib/utils/meta';

import getCategoryData from 'grandus-utils/fetches/ssr/category/Category';
import getBannerData from 'grandus-utils/fetches/ssr/category/Banner';
import { getFilterDataPromise, getFilterCategoryDataPromise } from 'grandus-utils/fetches/ssr/category/Filter';

const getCategoryMetadata = async props => {
  let [category, filterData] = await Promise.all([
    getCategoryData(props?.params),
    getFilterCategoryDataPromise({ props: props }),
  ]);

  const banner = await getBannerData(category?.category?.id);

  const meta = getMetaData(
    category?.category?.title,
    filterData?.meta?.description
      ? filterData?.meta?.description
      : category?.category?.description,
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

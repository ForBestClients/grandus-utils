import getBannersData from 'grandus-utils/fetches/ssr/Banners';
import isEmpty from 'lodash/isEmpty';

const getBannerData = async propertyId => {
  // TODO TEMPORARY DISABLED ON BETA
  // let [bannersCategory, bannersDefault] = await Promise.all([
  //   getBannersData({ type: 3, propertyId: propertyId }),
  //   getBannersData({ type: 13 }), //fetch default banner
  // ]);

  const bannersCategory = [];
  const bannersDefault = await getBannersData({ type: 13 });

  return !isEmpty(bannersCategory)
    ? bannersCategory[0]
    : !isEmpty(bannersDefault)
    ? bannersDefault[0]
    : {};
};

export default getBannerData;

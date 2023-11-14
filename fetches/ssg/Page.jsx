import map from 'lodash/map';
import getStatics from 'grandus-utils/fetches/ssr/Statics';

const getPageDataStatic = async () => {
  const pages = await getStatics();
  const output = [];

  map(pages, page => {
    output.push({ id: page?.urlTitle?.toString() });
  });

  return output;
};

export default getPageDataStatic;

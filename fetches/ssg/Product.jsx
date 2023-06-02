import { reqGetHeaders, reqApiHost } from '/grandus-lib/utils';

import getProductsData from 'grandus-utils/fetches/ssr/product/Filter';
import getCarouselData from 'grandus-utils/fetches/ssr/product/Carousel';
import map from 'lodash/map';
import uniqBy from 'lodash/uniqBy';
import slice from 'lodash/slice';

const getProductDataStatic = async () => {
  const req = {};

  let [categoriesData, carouselsData] = await Promise.all([
    fetch(`${reqApiHost(req)}/api/v2/categories?depth=1`, {
      headers: reqGetHeaders(req),
    })
      .then(result => result.json())
      .then(r => r.data),
    getCarouselData(),
  ]);

  const categories = [];

  map(categoriesData, category => {
    categories.push({ category: category?.urlName });
    map(category?.children, children => {
      categories.push({ category: children?.urlName });
    });
  });

  const categoriesProducts = await Promise.all(
    map(uniqBy(categories, 'category'), category =>
      getProductsData({
        params: category,
      }),
    ),
  );

  let paths = [];

  map(carouselsData, carousel => {
    map(carousel?.entities, product =>
      paths.push({ urlTitle: product?.urlTitle }),
    );
  });

  map(categoriesProducts, products => {
    map(products?.products, product =>
      paths.push({ urlTitle: product?.urlTitle }),
    );
  });

  // remove duplicates
  paths = uniqBy(paths, 'urlTitle');

  // new next has option only for 100 paths per route...
  paths = slice(paths, 0, 50);

  return paths;
};

export default getProductDataStatic;

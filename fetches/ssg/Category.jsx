import { reqGetHeaders, reqApiHost } from 'grandus-utils';

import map from 'lodash/map';

const getCategoryDataStatic = async () => {
  const req = {};

  let [categoriesData] = await Promise.all([
    fetch(`${reqApiHost(req)}/api/v2/categories?depth=1`, {
      headers: reqGetHeaders(req),
    })
      .then(result => result.json())
      .then(r => r.data),
  ]);

  const categories = [];

  map(categoriesData, category => {
    categories.push({ category: category?.urlName, parameters: [] });
    map(category?.children, children => {
      categories.push({ category: children?.urlName, parameters: [] });
    });
  });

  return categories;
};

export default getCategoryDataStatic;

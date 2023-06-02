import map from 'lodash/map';
import getCategoriesData from 'grandus-utils/fetches/ssr/blog/Categories';

const getBlogCategoryDataStatic = async () => {
  const categoriesData = await getCategoriesData();
  const categories = [];

  map(categoriesData, category => {
    categories.push({ id: category?.id?.toString(), name: category?.urlName });
  });

  return categories;
};

export default getBlogCategoryDataStatic;

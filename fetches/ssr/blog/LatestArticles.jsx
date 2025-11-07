import getBlogData from 'grandus-utils/fetches/ssr/blog/Blog';

async function getLatestArticlesData(propsOverride) {
  const props = { perPage: 3, ...propsOverride };

  const blogData = await getBlogData(props);

  return blogData?.blogs;
}

export default getLatestArticlesData;

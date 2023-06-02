import getBlogData from 'grandus-utils/fetches/ssr/blog/Blog';

async function getLatestArticlesData() {
  const props = { perPage: 3 };

  const blogData = await getBlogData(props);

  return blogData?.blogs;
}

export default getLatestArticlesData;

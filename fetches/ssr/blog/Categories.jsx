import { reqApiHost, reqGetHeaders } from 'grandus-lib/utils';

async function getCategoriesData() {
  const req = {};

  const [categories] = await Promise.all([
    fetch(`${reqApiHost(req)}/api/v2/blogs/categories`, {
      headers: reqGetHeaders(req),
      next: { revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE) },
    })
      .then(result => result.json())
      .then(r => r.data),
  ]);

  return categories;
}
export default getCategoriesData;

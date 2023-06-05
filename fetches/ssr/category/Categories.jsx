import { reqApiHost, reqGetHeadersBasic } from 'grandus-lib/utils/edge';
import isEmpty from 'lodash/isEmpty';
import join from 'lodash/join';

const getCategoriesData = async props => {
  const req = {};
  let uri = [];

  // not implemented on backend
  if (props?.depth !== false) {
    uri.push('depth=' + (props?.depth ? props?.depth : '0'));
  }

  // not implemented on backend
  if (props?.expand) {
    uri.push('expand=' + props?.expand);
  }

  // not implemented on backend
  if (props?.fields) {
    uri.push('fields=' + props?.fields);
  }

  const categories = await fetch(
    `${reqApiHost(req)}/api/v2/categories${
      isEmpty(uri) ? '' : '?' + join(uri, '&')
    }`,
    {
      headers: reqGetHeadersBasic(req),
    },
  ).then(result => result.json());

  return categories;
};

const getCategories = async props => {
  const data = await getCategoriesData(props);

  return data?.data;
};

export default getCategories;

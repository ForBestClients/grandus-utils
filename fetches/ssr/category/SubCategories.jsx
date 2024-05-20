import split from 'lodash/split';
import find from 'lodash/find';
import toString from 'lodash/toString';
import map from 'lodash/map';
import get from 'lodash/get';

import { getFilterData } from 'grandus-utils/fetches/ssr/category/Filter';

import { getFilterUrl, arrayToParams } from 'grandus-lib/utils/filter';
import omit from 'lodash/omit';
import isFunction from 'lodash/isFunction';

const getSubCategories = async props => {
  const filterData = await getFilterData({ props: { params: props } });

  const filter = filterData?.data;

  const [parameterId, limit] = split(props?.hash, '-');

  const parameter = find(
    filter?.parameters,
    parameter => toString(parameter?.id) == toString(parameterId),
  );

  const subCategories = [];

  map(parameter?.values, (parameterValue, index) => {
    if (limit && index >= limit) {
      return;
    }

    const parameterTitle = parameter?.urlTitle
      ? parameter?.urlTitle
      : parameter['v2-name'];

    const parameterValueId = get(
      parameterValue,
      'id',
      encodeURIComponent(parameterValue?.value),
    );
    const parameterValueValue = get(
      parameterValue,
      'value',
      get(parameterValue, 'name'),
    );
    const parameterValueTitle = encodeURIComponent(
      get(
        parameterValue,
        'urlName',
        get(parameterValue, 'v2-value', parameterValueValue),
      ),
    );

    const parameters = isFunction(props?.callback)
      ? props.callback(arrayToParams(props?.parameters ?? {}))
      : (arrayToParams(props?.parameters ?? {}));

    const url = getFilterUrl(
      props?.category,
      [],
      parameters,
      parameterTitle,
      parameterValueTitle,
    );

    subCategories.push({
      id: `${parameter?.id}-${parameterValueId}`,
      name: `${parameterValueValue} ${
        parameterValue?.productCount ? `(${parameterValue?.productCount})` : ''
      }`,
      externalUrl: url,
      urlName: props?.category,
    });
  });

  return subCategories;
};

export default getSubCategories;

import split from 'lodash/split';
import find from 'lodash/find';
import toString from 'lodash/toString';
import map from 'lodash/map';
import get from 'lodash/get';

import { getFilterData } from 'grandus-utils/fetches/ssr/category/Filter';

import { getFilterUrl, arrayToParams } from 'grandus-lib/utils/filter';
import omit from 'lodash/omit';

const getSubCategories = async props => {
  const filterData = await getFilterData({ props: { params: props } });

  const filter = filterData?.data;

  const [parameterId, limit] = split(props?.hash, '-');

  const parameter = find(
    filter?.parameters,
    parameter => toString(parameter?.id) == toString(parameterId),
  );

  const subCategories = [];

  console.log(props);

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

    const url = getFilterUrl(
      props?.category,
      [],
      props?.parameters
        ? omit(arrayToParams(props?.parameters), props.category === 'prislusenstvo-na-mobil' ? ['seria'] : [])
        : {},
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

  console.log(subCategories);

  return subCategories;
};

export default getSubCategories;

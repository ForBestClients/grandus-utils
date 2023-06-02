import { getMetaData } from 'grandus-lib/utils/meta';

import getCutterData from 'grandus-utils/fetches/ssr/product/Cutter';

const getCutterMetadata = async props => {
  const { productShiny } = await getCutterData();

  const meta = getMetaData(
    productShiny?.name,
    productShiny?.shortProductDescription?.description,
    'mobilonline.sk',
    {},
  );

  return meta;
};

export default getCutterMetadata;

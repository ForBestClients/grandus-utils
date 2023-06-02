import { reqApiHost, reqGetHeaders } from 'grandus-lib/utils';
import { CUTTER_MATTE_PATH, CUTTER_SHINY_PATH } from 'utils/cutter';

const getCutterData = async () => {
  const req = {};

  const [productShiny, productMatte] = await Promise.all([
    fetch(`${reqApiHost(req)}${CUTTER_SHINY_PATH}`, {
      headers: reqGetHeaders(req),
      next: { revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE) },
    })
      .then(result => result.json())
      .then(r => r.data),
    fetch(`${reqApiHost(req)}${CUTTER_MATTE_PATH}`, {
      headers: reqGetHeaders(req),
      next: { revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE) },
    })
      .then(result => result.json())
      .then(r => r.data),
  ]);

  return {
    productShiny,
    productMatte,
  };
};

export default getCutterData;

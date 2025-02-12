import { reqApiHost, reqGetHeaders } from 'grandus-lib/utils';
import {
  CUTTER_MATTE_PATH,
  CUTTER_PREMIUM_PATH,
  CUTTER_SHINY_PATH,
} from 'utils/cutter';

export const getCutterShinyPromise = () => {
  const req = {};

  return fetch(`${reqApiHost(req)}${CUTTER_SHINY_PATH}`, {
    headers: reqGetHeaders(req),
    next: { revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE) },
  })
    .then(result => result.json())
    .then(r => r.data);
};

export const getCutterMattePromise = () => {
  const req = {};

  return fetch(`${reqApiHost(req)}${CUTTER_MATTE_PATH}`, {
    headers: reqGetHeaders(req),
    next: { revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE) },
  })
    .then(result => result.json())
    .then(r => r.data);
};


export const getCutterPremiumPromise = () => {
  const req = {};

  return fetch(`${reqApiHost(req)}${CUTTER_PREMIUM_PATH}`, {
    headers: reqGetHeaders(req),
    next: { revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE) },
  })
    .then(result => result.json())
    .then(r => r.data);
};


const getCutterData = async () => {
  const [productShiny, productMatte, productPremium] = await Promise.all([
    getCutterShinyPromise(),
    getCutterMattePromise(),
    getCutterPremiumPromise()
  ]);

  return {
    productShiny,
    productMatte,
    productPremium,
  };
};

export default getCutterData;

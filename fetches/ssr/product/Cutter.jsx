import { reqApiHost, reqGetHeaders } from 'grandus-lib/utils';
import {
  CUTTER_MATTE_ELASTIC_PATH,
  CUTTER_MATTE_PATH,
  CUTTER_SHINY_ELASTIC_PATH,
  CUTTER_SHINY_PATH,
} from 'utils/cutter';
import get from 'lodash/get';

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

export const getCutterShinyElasticPromise = () => {
  const req = {};

  return fetch(`${reqApiHost(req)}${CUTTER_SHINY_ELASTIC_PATH}`, {
    headers: reqGetHeaders(req),
    next: { revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE) },
  })
    .then(result => result.json())
    .then(r => get(r, 'data[0]'));
};

export const getCutterMatteElasticPromise = () => {
  const req = {};

  return fetch(`${reqApiHost(req)}${CUTTER_MATTE_ELASTIC_PATH}`, {
    headers: reqGetHeaders(req),
    next: { revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE) },
  })
    .then(result => result.json())
    .then(r => get(r, 'data[0]'));
};

const getCutterData = async () => {
  const [productShiny, productMatte] = await Promise.all([
    getCutterShinyPromise(),
    getCutterMattePromise(),
  ]);

  return {
    productShiny,
    productMatte,
  };
};

export default getCutterData;

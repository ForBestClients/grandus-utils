import { reqApiHost, reqGetHeaders } from 'grandus-lib/utils';
import reduce from "lodash/reduce";
import {cookies} from "next/headers";
import {
  CUTTER_MATTE_ELASTIC_PATH,
  CUTTER_MATTE_PATH,
  CUTTER_SHINY_ELASTIC_PATH,
  CUTTER_SHINY_PATH,
} from 'utils/cutter';
import get from 'lodash/get';

export const getCutterShinyPromise = () => {
  const req = {};
  const cookieStore = cookies()
  const cookieObject = reduce(cookieStore.getAll(), (acc, item)=> {
    acc[item?.name]=item?.value
    return acc
  }, {});
  req.cookies = cookieObject

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

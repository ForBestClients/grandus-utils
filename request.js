import { cookies, headers } from 'next/headers';
import GrandusSession from '@/grandus-utils/session';

const AVAILABLE_HEADER_KEYS = [
  'grandus-frontend-url',
  'accept-language',
];

const AVAILABLE_COOKIE_KEYS = [
  'NEXT_LOCALE',
];

const getRequestObject = async () => {
  const headerList = await headers();
  const cookieList = cookies();
  const sessionList = await GrandusSession.getSessionObject();

  const reducedHeaders = AVAILABLE_HEADER_KEYS.reduce((acc, key) => {
    acc[key] = headerList.get(key);
    return acc;
  }, {});

  const reducedCookies = AVAILABLE_COOKIE_KEYS.reduce((acc, key) => {
    const value = cookieList?.get(key)?.value;

    if (value) {
      acc[key] = value;
    }

    return acc;
  }, {});

  const req = {
    headers: reducedHeaders,
    cookies: reducedCookies,
    session: sessionList,
  };

  return req;
};

export default getRequestObject;
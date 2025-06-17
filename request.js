import { cookies, headers } from 'next/headers';
import GrandusSession from '@/grandus-utils/session';
import { SESSION_USER_PARAMETERS_CONSTANT } from '@/constants/UserConstants';
import { CURRENCY_COOKIE_NAME_CONSTANT } from '@/grandus-lib/constants/SessionConstants';

const AVAILABLE_HEADER_KEYS = ['grandus-frontend-url', 'accept-language', 'x-currency'];

const AVAILABLE_COOKIE_KEYS = ['NEXT_LOCALE', CURRENCY_COOKIE_NAME_CONSTANT];

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

  return {
    headers: reducedHeaders,
    cookies: reducedCookies,
    session: sessionList,
  };
};

export default getRequestObject;

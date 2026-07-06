import { cookies, headers } from 'next/headers';

const AVAILABLE_HEADER_KEYS = ['grandus-frontend-url'];

const getSupportedLocales = () =>
  (
    process.env.NEXT_PUBLIC_LOCALES ??
    process.env.NEXT_PUBLIC_DEFAULT_LOCALE ??
    ''
  ).split(',');

const asSupportedLocale = value =>
  getSupportedLocales().includes(value) ? value : null;

/**
 * Resolves request language: x-locale header (set by middleware),
 * NEXT_LOCALE cookie (API routes bypass middleware) or default locale.
 * Returns default locale outside of a request scope (e.g. build time).
 */
export const getRequestLocale = async () => {
  try {
    const headerList = await headers();
    const headerLocale = asSupportedLocale(headerList.get('x-locale'));
    if (headerLocale) {
      return headerLocale;
    }

    const cookieList = await cookies();
    const cookieLocale = asSupportedLocale(
      cookieList?.get('NEXT_LOCALE')?.value,
    );

    return cookieLocale ?? process.env.NEXT_PUBLIC_DEFAULT_LOCALE;
  } catch (e) {
    return process.env.NEXT_PUBLIC_DEFAULT_LOCALE;
  }
};

/**
 * Builds a request-like object for reqGetHeaders() from the incoming
 * app-router request scope. Accept-Language is a validated locale (never
 * the raw browser header) and is only present for non-default locales —
 * default locale requests carry no language header at all. Returns
 * an empty object outside of a request scope (e.g. build time).
 */
const getRequestObject = async () => {
  try {
    const headerList = await headers();

    const reducedHeaders = AVAILABLE_HEADER_KEYS.reduce((acc, key) => {
      const value = headerList.get(key);
      if (value) {
        acc[key] = value;
      }
      return acc;
    }, {});

    const locale = await getRequestLocale();
    if (locale && locale !== process.env.NEXT_PUBLIC_DEFAULT_LOCALE) {
      reducedHeaders['accept-language'] = locale;
    }

    return {
      headers: reducedHeaders,
      cookies: {},
    };
  } catch (e) {
    return {};
  }
};

export default getRequestObject;

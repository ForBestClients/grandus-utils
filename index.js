import { USER_CONSTANT } from 'grandus-lib/constants/SessionConstants';

import get from 'lodash/get';
import toLower from 'lodash/toLower';
import replace from 'lodash/replace';
import isEmpty from 'lodash/isEmpty';
import split from 'lodash/split';
import toNumber from 'lodash/toNumber';
import isInteger from 'lodash/isInteger';
import dayjs from 'dayjs';

export const reqExtractUri = url => {
  const uriPosition = (url ?? '').indexOf('?');
  return uriPosition > 0 ? (url ?? '').slice(uriPosition) : '';
};

export const reqGetHost = req => {
  if (process.env.HOST) {
    return process.env.HOST;
  }

  let protocol = 'https://';
  const host = get(req, 'headers.host', '');
  if (host.indexOf('localhost') > -1) {
    protocol = 'http://';
  }

  return protocol + host;
};

export const reqApiHost = req => {
  return process.env.HOST_API;
};

export const getApiExpand = (
  type = '',
  asUriPart = false,
  uriType = 'EXPAND',
) => {
  if (!type) {
    return '';
  }

  const expandPrepend = asUriPart
    ? `${toLower(uriType ? uriType : 'EXPAND')}=`
    : '';
  const expandData =
    process.env[`NEXT_PUBLIC_${type}_${uriType ? uriType : 'EXPAND'}`] ?? null;

  return expandPrepend + (expandData ?? '');
};

export const getApiFields = (type = '', asUriPart = false) => {
  return getApiExpand(type, asUriPart, 'FIELDS');
};

export const reqGetHeadersFront = (req, options = {}) => {
  return {
    ...get(req, 'headers'),
    host: get(req, 'headers.host'),
    'grandus-frontend-url': get(options, 'forwardUrl', get(req, 'url')),
  };
};

export const getFrontendUrlFromHeaders = headers => {
  return get(
    headers,
    'Grandus-Frontend-Url',
    get(headers, 'grandus-frontend-url'),
  );
};

export const reqGetHeaders = req => {
  const result = {
    'Content-Type': 'application/json',
    'Owner-Token': process.env.GRANDUS_TOKEN_OWNER,
    'Webinstance-Token': process.env.GRANDUS_TOKEN_WEBINSTANCE,
  };

  const locale = get(req, 'cookies.NEXT_LOCALE');

  if (locale) {
    result['Accept-Language'] = locale;
  }

  const uriToForward = getFrontendUrlFromHeaders(req?.headers);
  if (uriToForward) {
    const removedProtocol = replace(
      replace(uriToForward, 'http://', ''),
      'https://',
      '',
    );

    Object.assign(result, {
      URI: replace(removedProtocol, get(req, 'headers.host'), ''),
    });
  }

  if (!get(req, 'session')) return result;

  const user = get(req.session, USER_CONSTANT);

  if (get(user, 'accessToken')) {
    Object.assign(result, {
      Authorization: `Bearer ${get(user, 'accessToken')}`,
    });
  }

  if (!process.env.NEXT_PUBLIC_REQUEST_ADDITIONAL_FIELDS) return result;

  const additionalFields = split(
    process.env.NEXT_PUBLIC_REQUEST_ADDITIONAL_FIELDS,
    ',',
  );

  if (!isEmpty(additionalFields)) {
    const session = req.session ?? [];

    additionalFields.map(field => {
      const fieldExpanded = split(field, '|', 2);

      const key = get(fieldExpanded, '[0]');
      const value = get(
        session,
        get(fieldExpanded, '[1]', get(fieldExpanded, '[0]')),
      );

      if (value) {
        const data = {};
        data[key] = value;

        Object.assign(result, data);
      }
    });
  }

  return result;
};

export const getTheNumberOfDecimals = number => {
  const numberParsed = toNumber(number);

  if (isInteger(numberParsed) || !number) {
    return 0;
  }

  const decimalStr = number.toString().split('.')[1] ?? '';

  return decimalStr.length;
};

export const getFormatDate = (date, dateTemplate) => {


  return dayjs(date, 'YYYY-MM-DDTHH:mm:ss').format(dateTemplate);
};

import { withIronSessionApiRoute } from 'iron-session/next';
import { GENERAL_CONSTANT } from 'grandus-lib/constants/SessionConstants';

/**
 * Wrap API route with Iron Session
 * @param {Function} handler - API route handler
 * @returns {Function} Wrapped handler with session
 */
export default function withSession(handler) {
  return withIronSessionApiRoute(handler, {
    password: process.env.SECRET_COOKIE_PASSWORD,
    cookieName: GENERAL_CONSTANT,
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
    },
  });
}

/**
 * Extract user data from session for safe storage
 * @param {Object} user - User object from API
 * @returns {Object} Extracted user data
 */
export const extractSessionUser = user => ({
  accessToken: user?.accessToken,
  id: user?.id,
  fullName: user?.fullName,
  name: user?.attributes?.name,
  surname: user?.attributes?.surname,
  email: user?.attributes?.email,
  phone: user?.attributes?.phone,
  street: user?.attributes?.street,
  city: user?.attributes?.city,
  zip: user?.attributes?.zip,
  countryId: user?.countryId,
  companyName: user?.attributes?.companyName,
  ico: user?.attributes?.ico,
  dic: user?.attributes?.dic,
  icDPH: user?.attributes?.icDPH,
  fatturistaIdentifier: user?.fatturistaIdentifier,
});

/**
 * Extract cart data from session for safe storage
 * @param {Object} cart - Cart object from API
 * @returns {Object} Extracted cart data
 */
export const extractSessionCart = cart => ({
  accessToken: cart?.accessToken,
  userId: cart?.userId,
  count: cart?.count,
  countPieces: cart?.pieceCount,
  sum: cart?.sumData,
  coupon: cart?.coupon,
});

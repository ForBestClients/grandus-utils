import { cookies } from 'next/headers';
import { GENERAL_CONSTANT } from '@/grandus-lib/constants/SessionConstants';
import { unsealData } from 'iron-session';


const GrandusSession = {
  getSessionObject: async function() {
    const cookieStore = cookies();
    const value = cookieStore.get(GENERAL_CONSTANT)?.value ?? '';

    if (!value) {
      return null;
    }

    const session = await unsealData(value, {
      password: process.env.SECRET_COOKIE_PASSWORD,
      cookieName: GENERAL_CONSTANT,
      cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
      },
    });

    return session;
  },
};

export default GrandusSession;
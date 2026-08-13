/**
 * Request context pre SSR fetchery.
 *
 * Fetchery v tomto balíku bežia v štyroch prostrediach: RSC, pages/api,
 * edge runtime (opengraph-image) a potenciálne client bundle. Preto tu NESMIE
 * byť žiadny import z `next/*` – zhodil by build pages/ alebo client vrstvy.
 *
 * Ambientný kontext si registruje aplikácia cez setRequestContextResolver().
 * Bez registrovaného resolvera a bez explicitných props vracia getRequestContext
 * prázdny objekt, čiže presne pôvodné správanie – zmena je spätne kompatibilná
 * pre všetky projekty, ktoré tento submodul používajú.
 */

let contextResolver = null;

/**
 * @param {(() => ({cookies?: object, headers?: object}|null))|null} resolver
 *   MUSÍ byť bezstavový – volá sa pri každom fetchi, nie raz za request.
 */
export const setRequestContextResolver = resolver => {
  contextResolver = typeof resolver === 'function' ? resolver : null;
};

export const resetRequestContextResolver = () => {
  contextResolver = null;
};

/**
 * Poradie zdrojov:
 *  1. props.cookies / props.headers – explicitné (pages/api, edge, force-static)
 *  2. registrovaný resolver – ambientný request scope (RSC)
 *  3. {} – pôvodné správanie
 *
 * Resolver na strane aplikácie siaha na next/headers, ktoré mimo request scope
 * HÁDŽE (nevracia null). Try/catch je tu, aby ten guard nemusel byť skopírovaný
 * v každom fetcheri zvlášť.
 */
export const getRequestContext = (props = {}) => {
  const explicitCookies = props?.cookies ?? null;
  const explicitHeaders = props?.headers ?? null;

  let ambient = null;

  if ((!explicitCookies || !explicitHeaders) && contextResolver) {
    try {
      ambient = contextResolver();
    } catch (error) {
      ambient = null;
    }
  }

  const req = {};

  const cookies = explicitCookies ?? ambient?.cookies ?? null;
  if (cookies) {
    req.cookies = cookies;
  }

  const headers = explicitHeaders ?? ambient?.headers ?? null;
  if (headers) {
    req.headers = headers;
  }

  return req;
};

/**
 * Jazyk z request kontextu, pre cache kľúče.
 *
 * Vracia `null`, keď jazyk nie je známy (jednojazyčné projekty, volania mimo
 * requestu). getCacheKeyByProps si `null` normalizuje na pôvodný tvar kľúča,
 * takže sa nič nerozbije.
 */
export const getContextLocale = (props = undefined) => {
  const context = getRequestContext(props);

  return context?.cookies?.NEXT_LOCALE ?? null;
};

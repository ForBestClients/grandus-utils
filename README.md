# readme for grandus-utils 

## preklady 

- FE default jazyk a BE musi byt rovnaky
  - ak nie tak pouzit `NEXT_PUBLIC_DEFAULT_LOCALE` v env
- aktualny jazyk treba ukladat v cookie `NEXT_LOCALE`
- nazov cookie treba nastavit pre i18next plugin v subore `app/i18n/settings.js`
- do BE treba posielat `accept-language` hlavicku
  - preto treba posielat spravne vyskladany object do fcie `reqGetHeaders`
  - priklad: `grandus-utils/fetches/ssr/product/Product.jsx`

### nevyhody

- v pages routry sa neda pouzit fetche z `grandus-utils/fetches/ssr`
- postupne api ktore puzivaju fcie z tohto priecinka treba prerobit do app routra 
  - prikald: `skinhair-sk/app/api/product/route.js`
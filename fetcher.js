import get from "lodash/get";

const handleError = (res) => {
  if (res.status === 404) {
    throw new Error("Not found");
  }

  if (res.status === 401) {
    throw new Error("Unauthorized");
  }

  throw new Error("Other error");
}

const fetcher = (url, options) => {
  return fetch(url, options)
    .then((res) => {
      if (!res.ok) {
        handleError(res);
      }
      return res.json();
    })
    .then(res => get(res, 'data'));
}

export default fetcher;
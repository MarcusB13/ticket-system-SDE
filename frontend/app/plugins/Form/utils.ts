export const getCsrfTokenFromCookie = () => {
  if (typeof document === "undefined") {
    return "";
  }

  const name = "csrfToken=";

  const decodedCookie = decodeURIComponent(document.cookie);
  const cookiesArray = decodedCookie.split(";");

  for (let i = 0; i < cookiesArray.length; i++) {
    let cookie = cookiesArray[i].trim();

    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  return "";
};

import { AUTHENTICATED } from "./Constants";

export const getTokenFromUrl = (url) => {
  const params = new URL(url).searchParams;
  return params.get("token");
};

export const cleanupTokenFromUrl = (url) => {
  const urlObj = new URL(url);
  urlObj.searchParams.delete("token");
  return urlObj.toString();
};

export const handleTokenStorage = (token) => {
  if (token) {
    sessionStorage.setItem("authToken", token);
    return token;
  }
  return sessionStorage.getItem("authToken");
};

export const checkAuthStatus = () => {
  const status = sessionStorage.getItem(AUTHENTICATED);
  return status === "logged-out" ? "logged-out" : "false";
};

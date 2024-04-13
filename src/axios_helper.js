import axios from "axios";

export const getAuthToken = () => {
  return window.localStorage.getItem("auth_token");
};

export const setRoles = (roles) => {
  window.localStorage.setItem("roles", JSON.stringify(roles));
};

export const isUserAdmin = () => {
  const roles = JSON.parse(window.localStorage.getItem("roles"));
  if (roles === null) {
    return false;
  }
  for (let i = 0; i < roles.length; i++) {
    if (roles[i].name === "ADMIN") {
      return true;
    }
  }
  return false;
}


export const setAuthHeader = (token) => {
  if (token !== null) {
    window.localStorage.setItem("auth_token", token);
  } else {
    window.localStorage.removeItem("auth_token");
  }
};

export const isLoggedIn = () => {
  return getAuthToken() !== null;
};

export const logout = () => {
  setAuthHeader(null);
};

axios.defaults.baseURL = "https://backend-pweb.onrender.com";
axios.defaults.headers.post["Content-Type"] = "application/json";

export const request = (method, url, data) => {
  let headers = {};
  if (getAuthToken() !== null && getAuthToken() !== "null") {
    headers = { Authorization: `Bearer ${getAuthToken()}` };
  }

  return axios({
    method: method,
    url: url,
    headers: headers,
    data: data,
  });
};

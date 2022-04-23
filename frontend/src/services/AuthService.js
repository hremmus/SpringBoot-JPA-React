import api from "services";

const baseURL = "/auth";

export const loginUser = ({ email, password }) => {
  return api.post(baseURL + "/signin/", {
    email,
    password,
  });
};

export const joinUser = ({ email, password, nickname }) => {
  return api.post(baseURL + "/signup/", {
    email,
    password,
    nickname,
  });
};

export const logoutUser = () => {
  return api.get(baseURL + "/signout/");
};

export const refreshToken = () => {
  return api.post(baseURL + "/refreshtoken/", null, { withCredentials: true });
};

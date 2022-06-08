import api from "services";

const baseURL = "/user";

export const verifyPassword = (request) => {
  return api.post(baseURL + "/checkpassword", request);
};

export const updateUser = (request) => {
  return api.put(baseURL, request);
};

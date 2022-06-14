import api from "services";

const baseURL = "/user";

export const verifyPassword = (request) => {
  return api.post(baseURL + "/checkpassword", request);
};

export const updateUser = (request) => {
  return api.put(baseURL, request);
};

export const getUsers = (request, accessToken) => {
  return api.get(baseURL + `s`, {
    params: request,
    headers: {
      Authorization: accessToken,
    },
  });
};

export const deleteUser = (id) => {
  return api.delete(`http://localhost:8080/api/user/${id}`);
};

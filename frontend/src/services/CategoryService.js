import api from "services";

const baseURL = "/categories";

export const getCategories = () => {
  return api.get(baseURL);
};

export const createCategory = (request) => {
  return api.post(baseURL, request);
};

export const deleteCategory = (id) => {
  return api.delete(`${baseURL}/${id}`);
};

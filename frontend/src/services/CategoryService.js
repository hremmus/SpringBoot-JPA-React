import api from "services";

const baseURL = "/categories/";

export const getCategories = () => {
  return api.get(baseURL);
};

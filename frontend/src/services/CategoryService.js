import axios from "axios";

const baseURL = "http://localhost:8080/api/categories/";

export const getCategories = () => {
  return axios.get(baseURL);
};

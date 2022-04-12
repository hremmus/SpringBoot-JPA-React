import axios from "axios";

const baseURL = "http://localhost:8080/api/comments/";

export const getComments = (condition) => {
  return axios.get(baseURL, { params: condition });
};

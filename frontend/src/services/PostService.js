import axios from "axios";

const baseURL = "http://localhost:8080/api/posts";

export const getPosts = (condition) => {
  return axios.get(baseURL, { params: condition });
};

import axios from "axios";

const baseURL = "http://localhost:8080/api/posts/";

export const getPosts = (condition) => {
  return axios.get(baseURL, { params: condition });
};

export const createPost = ({ title, content, categoryId }) => {
  return axios.post(baseURL, { title, content, categoryId });
};
